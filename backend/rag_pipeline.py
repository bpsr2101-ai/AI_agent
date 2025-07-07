from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain.docstore.document import Document
from .vectorstore import VectorStoreManager, create_session_vectorstore
from .parsers import parse_pdf, parse_docx
from .config import *
import os

# Preload embedding and LLM
embedding_model = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY, model=EMBEDDING_MODEL)
llm = ChatOpenAI(openai_api_key=OPENAI_API_KEY, model=LLM_MODEL)

# Preload manuals at startup
def load_preloaded_manuals():
    docs = []
    for fname in os.listdir(PRELOADED_MANUALS_DIR):
        fpath = os.path.join(PRELOADED_MANUALS_DIR, fname)
        with open(fpath, "rb") as f:
            if fname.lower().endswith(".pdf"):
                text = parse_pdf(f.read())
            elif fname.lower().endswith(".docx"):
                text = parse_docx(f.read())
            else:
                continue
        # Chunk
        splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        for chunk in splitter.split_text(text):
            docs.append(Document(page_content=chunk, metadata={"source": fname}))
    return docs

PRELOADED_DOCS = load_preloaded_manuals()
PRELOADED_VECTORSTORE = VectorStoreManager(embedding_model, persist_path="preloaded_faiss").load_or_create(PRELOADED_DOCS)

def process_upload(file, session_id):
    content = file.file.read()
    if file.filename.lower().endswith(".pdf"):
        text = parse_pdf(content)
    elif file.filename.lower().endswith(".docx"):
        text = parse_docx(content)
    else:
        raise ValueError("Unsupported file type")
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    docs = [Document(page_content=chunk, metadata={"source": file.filename}) for chunk in splitter.split_text(text)]
    # Create session vectorstore
    session_vectorstore = create_session_vectorstore(docs, embedding_model)
    from .session import SESSION_STORE
    SESSION_STORE[session_id]["vectorstore"] = session_vectorstore
    return {"status": "uploaded"}

def answer_question(question, session_id):
    # 1. Search preloaded manuals
    preloaded_results = PRELOADED_VECTORSTORE.similarity_search(question, k=3)
    # 2. Search session uploads (if any)
    from .session import SESSION_STORE
    session_vectorstore = SESSION_STORE[session_id].get("vectorstore")
    session_results = []
    if session_vectorstore:
        session_results = session_vectorstore.similarity_search(question, k=3)
    # 3. Combine and deduplicate
    all_results = preloaded_results + session_results
    seen = set()
    unique_results = []
    for doc in all_results:
        key = (doc.metadata.get("source"), doc.page_content[:50])
        if key not in seen:
            seen.add(key)
            unique_results.append(doc)
    # 4. Assemble context
    context = "\n\n".join([f"Source: {doc.metadata.get('source')}\n{doc.page_content}" for doc in unique_results])
    # 5. Prompt LLM
    prompt = (
        f"You are an expert in reading the user manual documentation. When user greets don't read the manual, just say hello and inform what you can do"
        f"Answer the following question strictly using only the provided manual context."
        f"Include citations in the form 'According to [source]...'.\n\n"
        f"Context:\n{context}\n\n"
        f"Question: {question}\n"
        f"Answer:"
    )
    answer = llm.invoke(prompt).content
    # 6. Prepare citations
    citations = [
        {"source": doc.metadata.get("source"), "snippet": doc.page_content[:200]}
        for doc in unique_results
    ]
    return {"answer": answer, "citations": ""}