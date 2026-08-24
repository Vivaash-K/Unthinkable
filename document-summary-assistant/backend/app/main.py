import os
import re
import uuid
import shutil
import logging
from pathlib import Path
from typing import Optional, Union

from fastapi import FastAPI, UploadFile, File, HTTPException, Request, Form, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import (
    UPLOAD_DIR,
    MAX_FILE_SIZE_BYTES,
    ALLOWED_MIME_TYPES,
    CORS_ORIGINS,
    GEMINI_API_KEY,
    OPENAI_API_KEY,
)
from app.schemas.models import (
    UploadResponse,
    ProcessRequest,
    ProcessResponse,
    SummarizeRequest,
    SummarizeResponse,
    HealthResponse,
)
from app.services.pdf_service import extract_text_from_pdf
from app.services.ocr_service import extract_text_from_image, is_tesseract_available
from app.services.summary_service import summarize_text

# Logging setup
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("document-summary-assistant")

# Initialize FastAPI application
app = FastAPI(
    title="Document Summary Assistant API",
    description="Backend API for Document Upload, Text Extraction (PDF + OCR), and Intelligent Summarization.",
    version="1.0.0",
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS if CORS_ORIGINS != ["*"] else ["*"],
    allow_origin_regex=r"https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def format_bytes(size: int) -> str:
    """Format file size in bytes to human readable format."""
    if size < 1024:
        return f"{size} B"
    elif size < 1024 * 1024:
        return f"{size / 1024:.1f} KB"
    else:
        return f"{size / (1024 * 1024):.2f} MB"


def sanitize_filename(filename: str) -> str:
    """Sanitize filename to prevent directory traversal or unsafe characters."""
    clean = re.sub(r'[^a-zA-Z0-9_.-]', '_', filename)
    return clean.strip('_') or f"doc_{uuid.uuid4().hex[:8]}"


@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    """Health check and engine status endpoint."""
    return HealthResponse(
        status="healthy",
        version="1.0.0",
        tesseractAvailable=is_tesseract_available(),
        geminiAvailable=bool(GEMINI_API_KEY),
        openaiAvailable=bool(OPENAI_API_KEY),
    )


@app.post("/api/upload", response_model=UploadResponse)
async def upload_document(file: UploadFile = File(...)):
    """Upload and validate document (PDF, PNG, JPG/JPEG)."""
    # 1. Validate file presence and name
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No filename provided in upload.",
        )

    # 2. Validate MIME type
    content_type = file.content_type or ""
    if content_type == "image/jpg":
        content_type = "image/jpeg"

    ext = Path(file.filename).suffix.lower()
    valid_exts = {".pdf", ".png", ".jpg", ".jpeg"}

    if content_type not in ALLOWED_MIME_TYPES and ext not in valid_exts:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type '{content_type or ext}'. Please upload a PDF, PNG, or JPG/JPEG file.",
        )

    if not content_type:
        if ext == ".pdf":
            content_type = "application/pdf"
        elif ext == ".png":
            content_type = "image/png"
        else:
            content_type = "image/jpeg"

    # 3. Read and check file size
    try:
        content = await file.read()
        file_size = len(content)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to read uploaded file: {str(e)}",
        )

    if file_size == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded file is empty (0 bytes).",
        )

    if file_size > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds maximum allowed size of {format_bytes(MAX_FILE_SIZE_BYTES)}.",
        )

    # 4. Save file with safe unique name
    safe_name = sanitize_filename(file.filename)
    unique_filename = f"{uuid.uuid4().hex[:8]}_{safe_name}"
    dest_path = UPLOAD_DIR / unique_filename

    try:
        with dest_path.open("wb") as f:
            f.write(content)
    except Exception as e:
        logger.error(f"File save error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save uploaded file to storage.",
        )

    logger.info(f"File uploaded successfully: {unique_filename} ({format_bytes(file_size)})")

    return UploadResponse(
        filename=unique_filename,
        originalName=file.filename,
        contentType=content_type,
        sizeBytes=file_size,
        sizeFormatted=format_bytes(file_size),
    )


@app.post("/api/process", response_model=ProcessResponse)
async def process_document(request: Request):
    """Extract text from uploaded PDF or Image document.

    Accepts both JSON `{"filename": "..."}` and Form data `filename=...`.
    """
    target_filename = None
    content_type = request.headers.get("content-type", "")

    if "application/json" in content_type:
        try:
            body = await request.json()
            target_filename = body.get("filename")
        except Exception:
            pass
    elif "form" in content_type:
        form = await request.form()
        target_filename = form.get("filename")

    if not target_filename:
        # Fallback to query param or raw body
        target_filename = request.query_params.get("filename")

    if not target_filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing 'filename' parameter in request.",
        )

    file_path = UPLOAD_DIR / target_filename
    if not file_path.exists():
        matching = list(UPLOAD_DIR.glob(f"*_{target_filename}")) or list(UPLOAD_DIR.glob(target_filename))
        if matching:
            file_path = matching[0]
            target_filename = file_path.name
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"File '{target_filename}' not found in upload storage. Please re-upload.",
            )

    ext = file_path.suffix.lower()
    is_pdf = ext == ".pdf"
    extracted_text = ""
    page_count = None
    ocr_applied = False

    try:
        if is_pdf:
            extracted_text, page_count, ocr_applied = extract_text_from_pdf(str(file_path))
        else:
            extracted_text = extract_text_from_image(str(file_path))
            ocr_applied = True

        cleaned_text = extracted_text.strip()
        word_count = len(re.findall(r'\b\w+\b', cleaned_text))
        char_count = len(cleaned_text)

        if not cleaned_text or word_count == 0:
            warning = (
                "No readable text could be extracted. The document may be blank, "
                "low resolution, or password protected."
            )
            return ProcessResponse(
                filename=target_filename,
                fileType="PDF Document" if is_pdf else "Image Document",
                text="",
                wordCount=0,
                characterCount=0,
                pageCount=page_count,
                hasExtractedText=False,
                ocrApplied=ocr_applied,
                warning=warning,
            )

        return ProcessResponse(
            filename=target_filename,
            fileType="PDF Document" if is_pdf else "Image Document",
            text=cleaned_text,
            wordCount=word_count,
            characterCount=char_count,
            pageCount=page_count,
            hasExtractedText=True,
            ocrApplied=ocr_applied,
            warning=None,
        )

    except FileNotFoundError as fnf:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(fnf))
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(ve))
    except RuntimeError as re_err:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(re_err))
    except Exception as e:
        logger.exception(f"Unexpected document processing error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred during extraction: {str(e)}",
        )


@app.post("/api/summarize", response_model=SummarizeResponse)
async def summarize_document(request: Request):
    """Generate structured AI summary with Key Points and Main Ideas.

    Accepts both JSON `{"text": "...", "summaryLength": "short"}` and Form data.
    """
    target_text = ""
    target_length = "short"
    target_provider = "auto"

    content_type = request.headers.get("content-type", "")
    if "application/json" in content_type:
        try:
            body = await request.json()
            target_text = body.get("text", "")
            target_length = body.get("summaryLength", "short")
            target_provider = body.get("provider", "auto")
        except Exception:
            pass
    elif "form" in content_type:
        form = await request.form()
        target_text = form.get("text", "")
        target_length = form.get("summaryLength", "short")
        target_provider = form.get("provider", "auto")

    if not target_text or not str(target_text).strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Document text is empty. Please provide valid text to summarize.",
        )

    valid_lengths = {"short", "medium", "long"}
    if str(target_length).lower() not in valid_lengths:
        target_length = "short"

    try:
        result = summarize_text(
            text=str(target_text),
            length=str(target_length).lower(),
            provider=str(target_provider).lower(),
        )
        return SummarizeResponse(**result)
    except Exception as e:
        logger.exception(f"Summarization failure: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Summarization failed: {str(e)}",
        )
