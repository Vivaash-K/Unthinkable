from app.services.pdf_image_service import extract_images_from_pdf
imgs = extract_images_from_pdf('../frontend/sample_with_image.pdf')
print('Found', len(imgs), 'images')
for i,img in enumerate(imgs):
    print(i, img['name'], 'bytes=', len(img['image_bytes']))
