import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# HuggingFace model names (can be set via environment variables)
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "text-embedding-3-small")
LLM_MODEL = os.getenv("LLM_MODEL", "gpt-4o-mini")
PRELOADED_MANUALS_DIR = "backend/preloaded_manuals"
MAX_UPLOAD_SIZE_MB = int(os.getenv("MAX_UPLOAD_SIZE_MB", 10)) 