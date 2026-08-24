from PyPDF2 import PdfReader


def extract_text_from_pdf(path: str) -> str:
    """Extract text from PDF while trying to preserve logical order.
    This is a best-effort approach using PyPDF2; for complex PDFs a more advanced parser may be needed.
    """
    reader = PdfReader(path)
    texts = []
    for page in reader.pages:
        try:
            page_text = page.extract_text() or ""
        except Exception:
            page_text = ""
        texts.append(page_text)
    return "\n".join(texts)
