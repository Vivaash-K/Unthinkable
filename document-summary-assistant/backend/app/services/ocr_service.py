import os
from dotenv import load_dotenv
from PIL import Image
import pytesseract

# Load .env for standalone scripts that import this module
load_dotenv()


def extract_text_from_image(path: str) -> str:
    """Use pytesseract to extract text from images. Tesseract must be installed on the host system.
    If TESSERACT_CMD is needed, set it in the environment variable TESSERACT_CMD.
    """
    try:
        tcmd = os.getenv('TESSERACT_CMD')
        if tcmd:
            pytesseract.pytesseract.tesseract_cmd = tcmd
        img = Image.open(path)
        text = pytesseract.image_to_string(img)
        return text
    except Exception as e:
        # Surface a clear error message
        raise RuntimeError(f'OCR failed for {path}: {e}')
