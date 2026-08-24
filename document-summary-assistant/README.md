# Document Summary Assistant

A full-stack application to upload PDF/image documents, extract text (PDF extraction or OCR), and generate AI-powered summaries (short, medium, long).

## Stack
- Frontend: React + Vite + TypeScript + Tailwind CSS
- Backend: Python + FastAPI
- OCR: pytesseract (optional, requires Tesseract installed)

## Quickstart

Backend
1. Python 3.10+ recommended
2. cd backend
3. python -m venv .venv
4. .\.venv\Scripts\Activate.ps1  # PowerShell
5. pip install -r app/requirements.txt
6. uvicorn app.main:app --reload --port 8000

Frontend
1. cd frontend
2. npm install
3. npm run dev

## Environment
Copy `.env.example` to `.env` and set any provider keys if you plan to integrate an LLM service.

## Project structure
See `document-summary-assistant/` for frontend and backend scaffolding.

## Notes
- The backend contains simple extraction and a placeholder summarizer. Replace the summarizer with an LLM integration (OpenAI, etc.) or a more advanced extractive algorithm as needed.
- For OCR, install Tesseract separately on your system and ensure `pytesseract` is configured.

