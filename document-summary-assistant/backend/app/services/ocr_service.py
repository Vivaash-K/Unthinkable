import os
import io
import logging
from PIL import Image, ImageEnhance, ImageFilter, UnidentifiedImageError
import pytesseract
from app.config import TESSERACT_CMD

logger = logging.getLogger(__name__)

# Configure Tesseract path if provided
_tesseract_initialized = False


def _init_tesseract():
    global _tesseract_initialized
    if _tesseract_initialized:
        return

    # Check config
    if TESSERACT_CMD and os.path.exists(TESSERACT_CMD):
        pytesseract.pytesseract.tesseract_cmd = TESSERACT_CMD
    else:
        # Common Windows paths check
        default_paths = [
            r"C:\Program Files\Tesseract-OCR\tesseract.exe",
            r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
            os.path.expanduser(r"~\AppData\Local\Programs\Tesseract-OCR\tesseract.exe"),
        ]
        for p in default_paths:
            if os.path.exists(p):
                pytesseract.pytesseract.tesseract_cmd = p
                logger.info(f"Found Tesseract at {p}")
                break

    _tesseract_initialized = True


def is_tesseract_available() -> bool:
    """Check if Tesseract OCR binary is reachable."""
    _init_tesseract()
    try:
        pytesseract.get_tesseract_version()
        return True
    except Exception:
        return False


def preprocess_image_for_ocr(image: Image.Image) -> Image.Image:
    """Preprocess image to maximize OCR recognition accuracy."""
    try:
        # Convert to grayscale
        gray = image.convert('L')
        # Enhance contrast
        enhancer = ImageEnhance.Contrast(gray)
        enhanced = enhancer.enhance(1.5)
        # Moderate sharpen filter
        sharpened = enhanced.filter(ImageFilter.SHARPEN)
        return sharpened
    except Exception as e:
        logger.warning(f"Image preprocessing failed, using original: {e}")
        return image


def extract_text_from_image(path: str) -> str:
    """Extract text from an image file path."""
    if not os.path.exists(path):
        raise FileNotFoundError(f"Image file not found at: {path}")

    _init_tesseract()

    try:
        img = Image.open(path)
    except UnidentifiedImageError:
        raise ValueError("The provided file is not a valid or readable image.")
    except Exception as e:
        raise ValueError(f"Could not open image file: {str(e)}")

    return _run_ocr_on_pil(img)


def extract_text_from_image_bytes(image_bytes: bytes) -> str:
    """Extract text from raw image bytes in memory."""
    _init_tesseract()
    try:
        img = Image.open(io.BytesIO(image_bytes))
    except Exception as e:
        raise ValueError(f"Failed to read image bytes: {str(e)}")

    return _run_ocr_on_pil(img)


def _run_ocr_on_pil(img: Image.Image) -> str:
    """Run Tesseract on PIL Image with fallback error handling."""
    if not is_tesseract_available():
        raise RuntimeError(
            "Tesseract OCR is not installed or not in PATH on the host system. "
            "Please install Tesseract OCR (e.g. via 'winget install UB-Mannheim.TesseractOCR') "
            "or set TESSERACT_CMD in your .env file."
        )

    try:
        # Preprocess image
        processed = preprocess_image_for_ocr(img)
        # Run OCR with page segmentation mode 3 (fully automatic page segmentation)
        config_options = '--oem 3 --psm 3'
        text = pytesseract.image_to_string(processed, config=config_options)
        return text.strip()
    except pytesseract.TesseractNotFoundError:
        raise RuntimeError("Tesseract OCR executable was not found on this system.")
    except Exception as e:
        logger.error(f"OCR execution failed: {e}")
        raise RuntimeError(f"OCR text extraction failed: {str(e)}")
