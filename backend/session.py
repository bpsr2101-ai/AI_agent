import uuid
from fastapi import Request, Response

# In-memory session store for demo (use Redis for production)
SESSION_STORE = {}

def get_session_id(request: Request, response: Response):
    session_id = request.cookies.get("session_id")
    if not session_id:
        session_id = str(uuid.uuid4())
        response.set_cookie(key="session_id", value=session_id, httponly=True)
    if session_id not in SESSION_STORE:
        SESSION_STORE[session_id] = {}
    return session_id

def cleanup_session(session_id: str):
    if session_id in SESSION_STORE:
        del SESSION_STORE[session_id] 