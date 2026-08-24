import fitz  # PyMuPDF
from typing import List, Dict
from PIL import Image
import io
import base64


def extract_images_from_pdf(path: str) -> List[Dict]:
    """Extract images from a PDF and return a list of dicts with keys:
    - name: image filename
    - image_bytes: raw image bytes
    - b64: base64 data URL
    """
    doc = fitz.open(path)
    images = []
    for page_index in range(len(doc)):
        page = doc[page_index]
        image_list = page.get_images(full=True)
        for img_index, img in enumerate(image_list):
            xref = img[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image['image']
            ext = base_image.get('ext', 'png')
            name = f"page{page_index+1}_img{img_index+1}.{ext}"
            # Build data URL
            b64 = "data:image/{};base64,".format(ext) + base64.b64encode(image_bytes).decode('ascii')
            images.append({
                'name': name,
                'image_bytes': image_bytes,
                'b64': b64,
            })
    return images
