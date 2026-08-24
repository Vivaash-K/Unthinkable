import os
import re
import logging
from typing import Tuple, List, Dict, Any

logger = logging.getLogger(__name__)

# Try importing pymupdf
try:
    import pymupdf as fitz
except ImportError:
    try:
        import fitz
    except ImportError:
        fitz = None

# Try importing PyPDF2
try:
    from PyPDF2 import PdfReader
except ImportError:
    PdfReader = None


def clean_extracted_text(text: str) -> str:
    """Clean up extracted PDF text to normalize spacing and paragraph structure."""
    if not text:
        return ""

    # Fix broken hyphenated words at line breaks (e.g., "infor-\nmation" -> "information")
    text = re.sub(r'(\w+)-\n(\w+)', r'\1\2', text)

    # Normalize carriage returns
    text = text.replace('\r\n', '\n').replace('\r', '\n')

    # Replace runs of more than 2 newlines with 2 newlines (preserve paragraphs)
    text = re.sub(r'\n{3,}', '\n\n', text)

    # Normalize multiple inline spaces to a single space
    lines = []
    for line in text.split('\n'):
        cleaned_line = re.sub(r'[ \t]+', ' ', line).strip()
        lines.append(cleaned_line)

    cleaned = '\n'.join(lines)
    return cleaned.strip()


def extract_text_from_pdf(pdf_path: str) -> Tuple[str, int, bool]:
    """Extract text from a PDF file.

    Returns:
        Tuple of (extracted_text, page_count, ocr_applied)
    """
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"PDF file not found: {pdf_path}")

    page_texts: List[str] = []
    page_count = 0
    ocr_applied = False

    # Strategy 1: Use PyMuPDF (pymupdf)
    if fitz is not None:
        try:
            doc = fitz.open(pdf_path)
            page_count = len(doc)
            for page_idx in range(page_count):
                page = doc[page_idx]
                text = page.get_text("text") or ""
                page_texts.append(text)
            doc.close()
        except Exception as e:
            logger.warning(f"PyMuPDF extraction failed: {e}. Trying PyPDF2 fallback.")
            page_texts = []

    # Strategy 2: Use PyPDF2 if PyMuPDF was unavailable or returned nothing
    if not page_texts and PdfReader is not None:
        try:
            reader = PdfReader(pdf_path)
            page_count = len(reader.pages)
            for page in reader.pages:
                try:
                    text = page.extract_text() or ""
                except Exception:
                    text = ""
                page_texts.append(text)
        except Exception as e:
            logger.warning(f"PyPDF2 extraction failed: {e}")

    full_text = "\n\n".join(page_texts)
    cleaned_text = clean_extracted_text(full_text)

    # Strategy 3: Check if the document is scanned or text is negligible (< 20 chars per page on average)
    if (not cleaned_text or len(cleaned_text.strip()) < 20) and fitz is not None:
        logger.info("PDF has negligible text layer. Attempting OCR on rendered pages...")
        try:
            from app.services.ocr_service import is_tesseract_available, extract_text_from_image_bytes
            if is_tesseract_available():
                doc = fitz.open(pdf_path)
                ocr_texts = []
                for page_idx in range(len(doc)):
                    page = doc[page_idx]
                    # Render page to high-res image
                    pix = page.get_pixmap(dpi=150)
                    img_bytes = pix.tobytes("png")
                    page_ocr = extract_text_from_image_bytes(img_bytes)
                    if page_ocr.strip():
                        ocr_texts.append(f"--- Page {page_idx + 1} ---\n" + page_ocr.strip())
                doc.close()

                if ocr_texts:
                    cleaned_text = "\n\n".join(ocr_texts)
                    ocr_applied = True
        except Exception as ocr_err:
            logger.warning(f"Scanned PDF OCR fallback failed: {ocr_err}")

    return cleaned_text, page_count, ocr_applied
