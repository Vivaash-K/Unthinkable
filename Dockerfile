FROM python:3.11-slim

# Install system dependencies & Tesseract OCR
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-eng \
    libtesseract-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python requirements
COPY document-summary-assistant/backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY document-summary-assistant/backend .

# Run uvicorn on dynamic PORT supplied by Railway (fallback to 8000)
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
