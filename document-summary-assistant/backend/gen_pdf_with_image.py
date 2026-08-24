from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from PIL import Image, ImageDraw, ImageFont

# Create a sample image with text for OCR
img = Image.new('RGB', (600,300), color=(255,255,255))
d = ImageDraw.Draw(img)
try:
    # Use a default truetype font if available
    f = ImageFont.truetype('arial.ttf', 20)
except Exception:
    f = ImageFont.load_default()
text = 'This image contains the caption: Sunrise over the mountains.'
d.text((20,120), text, font=f, fill=(0,0,0))
img_path = 'sample_img.png'
img.save(img_path)

# Create a PDF and embed the image
c = canvas.Canvas('..\\frontend\\sample_with_image.pdf', pagesize=letter)
c.setFont('Helvetica', 12)
c.drawString(72, 750, 'PDF with embedded image for demo')
c.drawImage(img_path, 72, 400, width=400, height=200)
# Add some text below
c.drawString(72, 380, 'Below is an embedded image that contains a caption for OCR testing.')
c.save()
print('Wrote ../frontend/sample_with_image.pdf and sample_img.png')
