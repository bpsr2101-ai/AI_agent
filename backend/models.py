from pydantic import BaseModel
from typing import List

class ChatRequest(BaseModel):
    question: str

class Citation(BaseModel):
    source: str
    snippet: str

class ChatResponse(BaseModel):
    answer: str
    citations: List[Citation]

class UploadResponse(BaseModel):
    status: str

class FeedbackRequest(BaseModel):
    session_id: str
    question: str
    answer: str
    feedback: str  # "positive" or "negative" 