# Document Summary Assistant 📄✨

An intelligent, full-stack web application that allows users to upload PDF and image documents (PNG, JPG, JPEG), extract structured text using PDF parsing and OCR (Optical Character Recognition), and generate multi-length AI summaries with key bullet points and main ideas.

---

## 🌟 Features

* **🎨 Modern Dashboard UI**: Clean, responsive, glassmorphic design crafted with React, TypeScript, and Tailwind CSS.
* **📂 Versatile Document Upload**:
  * Seamless drag-and-drop file dropzone with visual drag feedback.
  * Native file browser fallback.
  * Supports **PDF**, **PNG**, **JPG**, and **JPEG** formats with client-side & server-side size/type validation (up to 25 MB).
* **🔍 Multi-Strategy Text Extraction**:
  * **PDF Parsing**: Layout-aware text extraction using **PyMuPDF (`fitz`)** and **PyPDF2**.
  * **Image OCR**: Optical character recognition powered by **Tesseract OCR** & **Pillow** image preprocessing (contrast enhancement, grayscale, sharpening).
  * **Scanned PDF Fallback**: Automatically identifies image-only or scanned PDFs and performs page-level OCR rendering.
* **🧠 Multi-Provider AI Summarization**:
  * **Google Gemini API** (`gemini-2.5-flash` / `gemini-1.5-flash`) structured JSON output.
  * **OpenAI API** (`gpt-4o-mini` / `gpt-3.5-turbo`) JSON mode.
  * **Intelligent Built-in Extractive NLP Engine**: Zero-config TF-IDF sentence-ranking algorithm that ensures 100% out-of-the-box functionality even without API keys!
* **⚡ 3 Configurable Summary Lengths**:
  * **Short**: Concise 3–5 sentence executive brief.
  * **Medium**: Balanced overview covering all key arguments and context.
  * **Long**: In-depth comprehensive breakdown with nuances and conclusions.
* **📊 Key Takeaways & Topic Extraction**:
  * **Key Points**: Top salient facts and takeaways as numbered cards.
  * **Main Ideas**: Categorized topic chips and theme badges.
  * **Document Stats**: Word count, character count, compression ratio (e.g. 68% reduction), and estimated reading time.
* **💾 Export & Productivity Actions**:
  * One-click **Copy Summary** with visual feedback.
  * Download structured report as **`.txt`** or **`.md` (Markdown)**.
  * Instant **Replace** or **Upload Another Document**.
* **🔄 Reactive Progress Pipeline**: Multi-stage progress indicator (*Uploading → Extracting & OCR → Analyzing Content → Generating Summary*) with skeleton animations.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide React Icons |
| **Backend** | Python 3.11+, FastAPI, Uvicorn, Pydantic v2 |
| **Document Processing** | PyMuPDF (fitz), PyPDF2, Pillow (PIL), Pytesseract |
| **AI / LLM Integration** | Google GenAI SDK (`google-genai`), OpenAI Python SDK, Built-in Extractive NLP Engine |
| **Deployment Ready** | Docker, Vercel, Render, Railway, Google Cloud Run |

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                 React + TypeScript Frontend                 │
│  (Drag & Drop, State Pipeline, Segmented Tabs, Export Hub)  │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / JSON / Multipart
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     FastAPI REST Backend                    │
│      (/api/upload, /api/process, /api/summarize, /api/health)│
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
               ▼                               ▼
┌─────────────────────────────┐ ┌─────────────────────────────┐
│   Text Extraction Engine    │ │   AI Summarization Engine   │
│  • PyMuPDF / PyPDF2         │ │  • Google Gemini 2.5 Flash  │
│  • Tesseract OCR            │ │  • OpenAI GPT-4o Mini       │
│  • Pillow Preprocessing     │ │  • Extractive NLP Fallback  │
└─────────────────────────────┘ └─────────────────────────────┘
```

---

## 📁 Project Structure

```text
document-summary-assistant/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx                 # Navigation & engine status
│   │   │   ├── FileUpload.tsx             # Drag-and-drop file dropzone
│   │   │   ├── FilePreview.tsx            # Selected file metadata & actions
│   │   │   ├── SummaryLengthSelector.tsx  # Short / Medium / Long segmented control
│   │   │   ├── ProcessingStatus.tsx       # 4-stage visual progress stepper
│   │   │   ├── ExtractedTextViewer.tsx    # Collapsible raw text accordion
│   │   │   ├── KeyPoints.tsx              # Numbered key takeaways list
│   │   │   ├── MainIdeas.tsx              # Topic chips & theme tags
│   │   │   ├── SummaryResult.tsx          # 3-card summary layout & export hub
│   │   │   └── ErrorMessage.tsx           # Dismissible error alert banners
│   │   ├── services/
│   │   │   └── api.ts                     # Typed REST API client
│   │   ├── types/
│   │   │   └── index.ts                   # TypeScript interfaces & types
│   │   ├── App.tsx                        # Main application orchestrator
│   │   ├── main.tsx                       # React DOM root entry
│   │   └── styles.css                     # Tailwind CSS & custom styles
│   ├── index.html                         # HTML template & Google Fonts
│   ├── package.json                       # NPM dependencies & scripts
│   ├── tailwind.config.js                 # Tailwind styling config
│   ├── postcss.config.js                  # PostCSS plugins
│   ├── tsconfig.json                      # TypeScript configuration
│   └── vite.config.ts                     # Vite build & proxy settings
│
├── backend/
│   ├── app/
│   │   ├── config.py                      # Environment config & constants
│   │   ├── schemas/
│   │   │   └── models.py                  # Pydantic request/response models
│   │   ├── services/
│   │   │   ├── pdf_service.py             # PDF text extraction & scanned page OCR
│   │   │   ├── ocr_service.py             # Image OCR & Pillow preprocessing
│   │   │   └── summary_service.py         # Gemini, OpenAI, & Extractive NLP engine
│   │   └── main.py                        # FastAPI application & REST routes
│   ├── requirements.txt                   # Python backend dependencies
│   ├── test_backend.py                    # Sanity unit tests
│   ├── test_e2e.py                        # End-to-end PDF pipeline test
│   └── uploads/                           # Temporary document storage
│
├── .env.example                           # Environment configuration template
├── .gitignore                             # Git ignore rules
└── README.md                              # Complete project documentation
```

---

## 🚀 Getting Started

### Prerequisites

* **Node.js** (v18.0 or higher) & **npm**
* **Python** (v3.10, v3.11, 3.12, or 3.13)
* *(Optional)* **Tesseract OCR**: Required for Image OCR. If not installed, PDF text extraction and built-in NLP summarization will still work seamlessly.
  * **Windows**: `winget install UB-Mannheim.TesseractOCR`
  * **macOS**: `brew install tesseract`
  * **Linux (Ubuntu/Debian)**: `sudo apt-get install -y tesseract-ocr`

---

### 1. Environment Setup

Copy `.env.example` to create your local `.env` file:

```bash
cp .env.example .env
```

Edit `.env` if you wish to use Google Gemini or OpenAI:

```env
PORT=8000
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Optional: Add your free Google Gemini API Key (https://aistudio.google.com/)
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Add your OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Set custom path to tesseract.exe on Windows if not in PATH
TESSERACT_CMD=C:\Program Files\Tesseract-OCR\tesseract.exe
```

> **Note**: If no API key is provided, the application will automatically utilize its **built-in Extractive NLP Engine**, providing instant summarization with zero external dependencies.

---

### 2. Backend Setup & Run

Navigate to the `backend` folder and create a virtual environment:

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows (PowerShell):
.venv\Scripts\Activate.ps1
# Windows (CMD):
.venv\Scripts\activate.bat
# macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run backend development server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The backend server will start at **`http://localhost:8000`**.
* Interactive Swagger Docs: `http://localhost:8000/docs`
* OpenAPI JSON: `http://localhost:8000/openapi.json`

---

### 3. Frontend Setup & Run

Open a new terminal window, navigate to the `frontend` folder, and start Vite:

```bash
# Navigate to frontend
cd frontend

# Install packages
npm install

# Start Vite dev server
npm run dev
```

The frontend application will start at **`http://localhost:5173`**.

---

## 📡 API Documentation

### 1. Health Check
* **Endpoint**: `GET /api/health`
* **Response**:
  ```json
  {
    "status": "healthy",
    "version": "1.0.0",
    "tesseractAvailable": true,
    "geminiAvailable": false,
    "openaiAvailable": false
  }
  ```

---

### 2. Document Upload
* **Endpoint**: `POST /api/upload`
* **Content-Type**: `multipart/form-data`
* **Body**: `file: File` (PDF, PNG, JPG, JPEG)
* **Response**:
  ```json
  {
    "filename": "1e0fdd76_document.pdf",
    "originalName": "document.pdf",
    "contentType": "application/pdf",
    "sizeBytes": 184520,
    "sizeFormatted": "180.2 KB"
  }
  ```

---

### 3. Text Extraction
* **Endpoint**: `POST /api/process`
* **Content-Type**: `application/json`
* **Request**:
  ```json
  {
    "filename": "1e0fdd76_document.pdf"
  }
  ```
* **Response**:
  ```json
  {
    "filename": "1e0fdd76_document.pdf",
    "fileType": "PDF Document",
    "text": "Extracted full text of the document...",
    "wordCount": 850,
    "characterCount": 5420,
    "pageCount": 3,
    "hasExtractedText": true,
    "ocrApplied": false,
    "warning": null
  }
  ```

---

### 4. AI Summarization
* **Endpoint**: `POST /api/summarize`
* **Content-Type**: `application/json`
* **Request**:
  ```json
  {
    "text": "Extracted document text...",
    "summaryLength": "short",
    "provider": "auto"
  }
  ```
* **Response**:
  ```json
  {
    "summary": "This document details the core architectural principles of modern cloud systems, focusing on microservices, automated CI/CD pipelines, and robust observability.",
    "keyPoints": [
      "Cloud computing enables organizations to scale infrastructure on demand dynamically.",
      "Containerization and orchestration streamline microservices deployments.",
      "Distributed tracing and automated alerts minimize operational overhead."
    ],
    "mainIdeas": [
      "Cloud Computing",
      "Microservices",
      "DevOps & CI/CD",
      "Observability"
    ],
    "stats": {
      "originalWords": 850,
      "summaryWords": 62,
      "compressionRatio": "93% reduction",
      "estimatedReadingTimeOriginal": "5 min read",
      "estimatedReadingTimeSummary": "< 1 min read"
    },
    "providerUsed": "Extractive NLP Engine",
    "summaryLength": "short"
  }
  ```

---

## 🧪 Running Automated Tests

Run backend tests from the project root:

```bash
# Run API endpoint sanity tests
python backend/test_backend.py

# Run end-to-end PDF processing and summarization pipeline test
python backend/test_e2e.py
```

Run frontend build check:

```bash
cd frontend
npm run build
```

---

## 📸 Screenshots & UI Walkthrough

### 1. Document Upload Dashboard
> Modern drag-and-drop zone supporting PDF and images with format tags and size validation.

```text
+-------------------------------------------------------------+
|  [DS] Document Summary Assistant                 [Online]   |
+-------------------------------------------------------------+
|                                                             |
|           Transform any document into insights              |
|                                                             |
|   + - - - - - - - - - - - - - - - - - - - - - - - - - - +   |
|   |                  [ Upload Icon ]                    |   |
|   |            Drag & drop your document here           |   |
|   |                                                     |   |
|   |               [  Browse Files  ]                    |   |
|   |         (PDF, PNG, JPG / Max size: 25MB)            |   |
|   + - - - - - - - - - - - - - - - - - - - - - - - - - - +   |
|                                                             |
+-------------------------------------------------------------+
```

### 2. Multi-Stage Processing Stepper
> Real-time visual progress indicator highlighting each processing stage.

```text
+-------------------------------------------------------------+
| (•) Extracting text & running OCR...            Step 2 of 4 |
|                                                             |
| [✓ Uploading]   [⟳ Extracting]   [○ Analyzing]   [○ Summary]|
+-------------------------------------------------------------+
```

### 3. Summary & Analysis Results
> Three distinct cards for narrative summary, key bullet points, topic chips, and download options.

```text
+-------------------------------------------------------------+
|  [★] Document Analysis Results            [Engine: Gemini]  |
|  Original: 850 words | Summary: 62 words | 93% Reduction    |
+-------------------------------------------------------------+
| [ Summary Card ]                 | [ Key Points Card ]      |
| Full natural-language summary... | 1. Key Takeaway 1        |
|                                  | 2. Key Takeaway 2        |
|                                  | 3. Key Takeaway 3        |
| [Copy] [Download .txt] [.md]     |--------------------------|
|                                  | [ Main Ideas Tags ]      |
|                                  | [Cloud] [Microservices]  |
+-------------------------------------------------------------+
```

---

## 🚢 Deployment Guidelines

### Frontend (Vercel / Netlify)
1. Set root directory to `frontend`.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Set environment variable: `VITE_API_URL=https://your-backend-api-domain.com`

### Backend (Render / Railway / Google Cloud Run)
1. Build command: `pip install -r requirements.txt`
2. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
3. Configure environment variables (`GEMINI_API_KEY`, `OPENAI_API_KEY`, `CORS_ORIGINS`).

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
