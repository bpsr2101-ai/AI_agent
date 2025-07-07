from fastapi import FastAPI, UploadFile, File, Depends, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from .models import ChatRequest, ChatResponse, UploadResponse, FeedbackRequest, Citation
from .session import get_session_id, cleanup_session
from .rag_pipeline import answer_question, process_upload
from .config import MAX_UPLOAD_SIZE_MB
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Set to frontend URL in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, req: Request, res: Response):
    session_id = get_session_id(req, res)
    result = answer_question(request.question, session_id)
    return ChatResponse(answer=result["answer"], citations=[Citation(**c) for c in result["citations"]])

@app.post("/upload", response_model=UploadResponse)
async def upload(file: UploadFile = File(...), req: Request = None, res: Response = None):
    if file.content_type not in ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]:
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported.")
    if hasattr(file, 'size') and file.size and file.size > MAX_UPLOAD_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large.")
    session_id = get_session_id(req, res)
    try:
        process_upload(file, session_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    return UploadResponse(status="uploaded")

@app.delete("/session/{session_id}")
async def delete_session(session_id: str):
    cleanup_session(session_id)
    return {"status": "deleted"}

@app.post("/feedback")
async def feedback(request: FeedbackRequest):
    # Log feedback (to file, DB, or monitoring)
    print(f"Feedback: {request.dict()}")
    return {"status": "ok"}

@app.get("/health")
async def health():
    return {"status": "ok"} 