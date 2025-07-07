# AI Agent: Instruction Manual Chatbot

## Overview

AI Agent is a full-stack application that allows users to upload device manuals (PDF/DOCX) and ask questions about them using natural language. The backend leverages FastAPI, LangChain, OpenAI embeddings, and FAISS for semantic search, while the frontend is built with Next.js, React, and Tailwind CSS for a modern chat experience.

---

## Features
- **Upload Manuals:** Supports PDF and DOCX uploads.
- **Semantic Search:** Uses OpenAI embeddings and FAISS for fast, relevant retrieval.
- **Chatbot Interface:** Ask questions and get answers with citations from your manuals.
- **Session-based Uploads:** User uploads are session-specific and not stored permanently.
- **Preloaded Manuals:** Includes a set of preloaded manuals for instant Q&A.

---

## Tech Stack
- **Backend:** FastAPI, LangChain, OpenAI, FAISS, PyMuPDF, python-docx
- **Frontend:** Next.js, React, Tailwind CSS, TypeScript

---

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm
- OpenAI API Key

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On macOS/Linux
   # venv\Scripts\activate  # On Windows
   ```
3. Install dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
4. Create a `.env` file in `backend/` with your OpenAI API key:
   ```env
   OPENAI_API_KEY=your_openai_api_key
   ```
5. Start the backend server from the project root:
   ```bash
   uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## Usage
- Visit `http://localhost:3000` in your browser.
- Upload a manual and start chatting!

---

## Development
- Backend code: `backend/`
- Frontend code: `frontend/`
- Preloaded manuals: `backend/preloaded_manuals/`
- Preloaded FAISS index: `preloaded_faiss/`

---

## Security Notes
- **Do not commit your `.env` file or API keys to git.**
- Uploaded manuals are session-based and not stored permanently.

---

## License
MIT 