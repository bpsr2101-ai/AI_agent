from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
from langchain.docstore.document import Document
import os

class VectorStoreManager:
    def __init__(self, embedding_model, persist_path=None):
        self.embedding_model = embedding_model
        self.persist_path = persist_path
        self.vectorstore = None

    def load_or_create(self, docs=None):
        if self.persist_path and os.path.exists(self.persist_path):
            self.vectorstore = FAISS.load_local(self.persist_path, self.embedding_model, allow_dangerous_deserialization=True)
        elif docs:
            self.vectorstore = FAISS.from_documents(docs, self.embedding_model)
            if self.persist_path:
                self.vectorstore.save_local(self.persist_path)
        else:
            raise ValueError("No docs to create vectorstore.")
        return self.vectorstore

    def similarity_search(self, query, k=5, filter_func=None):
        results = self.vectorstore.similarity_search(query, k=k)
        if filter_func:
            results = [doc for doc in results if filter_func(doc)]
        return results

# For session uploads, use in-memory FAISS
def create_session_vectorstore(docs, embedding_model):
    return FAISS.from_documents(docs, embedding_model) 