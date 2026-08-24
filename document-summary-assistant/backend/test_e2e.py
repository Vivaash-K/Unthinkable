import io
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_full_pipeline():
    # 1. Create a clean sample PDF in memory
    from reportlab.lib.pagesizes import letter
    from reportlab.pdfgen import canvas

    pdf_buffer = io.BytesIO()
    c = canvas.Canvas(pdf_buffer, pagesize=letter)
    c.drawString(100, 750, "Document Summary Assistant Test Document")
    c.drawString(100, 720, "Cloud Computing Architecture and Scalability")
    c.drawString(100, 690, "Cloud computing enables organizations to scale infrastructure on demand.")
    c.drawString(100, 660, "Modern microservices architectures leverage containerization and orchestration.")
    c.drawString(100, 630, "Security protocols such as OAuth2 and TLS ensure reliable end-to-end protection.")
    c.drawString(100, 600, "Automated CI/CD pipelines facilitate rapid deployment and iterative releases.")
    c.drawString(100, 570, "By adopting serverless functions and event-driven design, operational overhead is minimized.")
    c.drawString(100, 540, "Observability tools provide deep metrics, distributed tracing, and real-time alerts.")
    c.showPage()
    c.save()
    pdf_bytes = pdf_buffer.getvalue()

    # Upload
    upload_res = client.post("/api/upload", files={"file": ("cloud_architecture.pdf", pdf_bytes, "application/pdf")})
    assert upload_res.status_code == 200, upload_res.text
    upload_data = upload_res.json()
    filename = upload_data["filename"]
    print("[PASS] Upload PDF:", filename)

    # Process
    proc_res = client.post("/api/process", json={"filename": filename})
    assert proc_res.status_code == 200, proc_res.text
    proc_data = proc_res.json()
    assert proc_data["hasExtractedText"] is True
    assert proc_data["wordCount"] > 20
    print(f"[PASS] Process PDF: words={proc_data['wordCount']}, chars={proc_data['characterCount']}")

    # Summarize
    sum_res = client.post("/api/summarize", json={"text": proc_data["text"], "summaryLength": "medium"})
    assert sum_res.status_code == 200, sum_res.text
    sum_data = sum_res.json()
    assert len(sum_data["summary"]) > 0
    assert len(sum_data["keyPoints"]) > 0
    assert len(sum_data["mainIdeas"]) > 0
    print("[PASS] Summarize PDF:")
    print("  Summary:", sum_data["summary"])
    print("  Key Points:", sum_data["keyPoints"])
    print("  Main Ideas:", sum_data["mainIdeas"])
    print("  Stats:", sum_data["stats"])

if __name__ == "__main__":
    test_full_pipeline()
    print("END-TO-END PDF PIPELINE TEST COMPLETED SUCCESSFULLY!")
