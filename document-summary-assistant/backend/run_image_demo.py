from app.services.pdf_image_service import extract_images_from_pdf
from app.services.ocr_service import extract_text_from_image
from app.services.summary_service import describe_image

imgs = extract_images_from_pdf('uploads/sample_with_image.pdf')
print('Found', len(imgs), 'images')
for i, img in enumerate(imgs):
    name = img['name']
    print('\n--- Image:', name)
    # Save bytes to temp path (already done by upload, but do local in case)
    tmp_path = f'uploads/{name}'
    with open(tmp_path, 'wb') as f:
        f.write(img['image_bytes'])
    ocr = extract_text_from_image(tmp_path)
    print('OCR text:\n', ocr)
    desc = describe_image(ocr, name)
    print('Description:\n', desc)
    print('Data URL prefix:', img['b64'][:60])
