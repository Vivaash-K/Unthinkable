# Document Summary Assistant 📄✨

An intelligent full-stack web application that allows users to upload PDF and image documents (PNG, JPG, JPEG), extract text (via PDF parsing and Tesseract OCR), and generate structured AI summaries with Key Points and Main Ideas across Short, Medium, and Long lengths.

---

## 📁 Repository Structure

* **`document-summary-assistant/frontend`**: Modern React + TypeScript + Vite + Tailwind CSS dashboard UI.
* **`document-summary-assistant/backend`**: Python FastAPI backend with PyMuPDF, Tesseract OCR, Google Gemini, OpenAI, and built-in Extractive NLP summarization engine.

For complete documentation, architecture overview, API specifications, and quickstart commands, please see:
👉 **[document-summary-assistant/README.md](./document-summary-assistant/README.md)**

---

## ⚡ Quick Start

### 1. Run Backend
```bash
cd document-summary-assistant/backend
python -m venv .venv
.venv\Scripts\Activate.ps1    # or source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Run Frontend
```bash
cd document-summary-assistant/frontend
npm install
npm run dev
```

Open your browser at `http://localhost:5173`.