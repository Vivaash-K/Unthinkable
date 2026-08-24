from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import shutil
import os
from pathlib import Path
from dotenv import load_dotenv
from app.services.pdf_service import extract_text_from_pdf
from app.services.ocr_service import extract_text_from_image
from app.services.summary_service import summarize_text
from PIL import Image
import io

# Load environment variables from .env if present
load_dotenv()

import logging
logging.basicConfig(level=logging.INFO)

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(title="Document Summary Assistant")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post('/api/upload')
async def upload_file(file: UploadFile = File(...)):
    if file.content_type not in ("application/pdf", "image/png", "image/jpeg"):
        raise HTTPException(status_code=400, detail="Unsupported file type")
    dest = UPLOAD_DIR / file.filename
    with dest.open('wb') as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"filename": file.filename, "content_type": file.content_type}

@app.post('/api/process')
async def process_file(filename: str = Form(...)):
    path = UPLOAD_DIR / filename
    if not path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    try:
        extracted_text = ""
        images_info = []
        if filename.lower().endswith('.pdf'):
            # Extract PDF text
            extracted_text = extract_text_from_pdf(str(path))
            # Try to extract embedded images
            try:
                from app.services.pdf_image_service import extract_images_from_pdf
                from app.services.ocr_service import extract_text_from_image
                from app.services.summary_service import describe_image
                imgs = extract_images_from_pdf(str(path))
                for img in imgs:
                    # run OCR on image bytes
                    # write temp bytes to memory and use PIL via OCR service
                    img_bytes = img['image_bytes']
                    # create a PIL Image from bytes
                    import io
                    pil_img = Image.open(io.BytesIO(img_bytes))
                    # save to a temporary path in uploads for debugging
                    temp_name = f"{UPLOAD_DIR}/{img['name']}"
                    pil_img.save(temp_name)
                    ocr_text = extract_text_from_image(temp_name)
                    desc = describe_image(ocr_text, img['name'])
                    images_info.append({'name': img['name'], 'ocrText': ocr_text, 'description': desc, 'b64': img['b64']})
            except Exception as ie:
                # if image extraction fails, continue but record the failure
                images_info.append({'error': f'Image extraction/ocr failed: {ie}'})
        else:
            extracted_text = extract_text_from_image(str(path))

        if not extracted_text.strip() and not images_info:
            return JSONResponse(status_code=422, content={"error":"No text or images could be extracted from the document."})

        return {"text": extracted_text, "images": images_info}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post('/api/summarize')
async def summarize(text: str = Form(...), summaryLength: str = Form('short')):
    try:
        result = summarize_text(text, summaryLength)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
