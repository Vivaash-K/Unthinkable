import io
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    print("[PASS] /api/health:", data)

def test_summarize_nlp():
    text = (
        "Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to the natural intelligence "
        "displayed by animals including humans. Leading AI textbooks define the field as the study of intelligent agents, "
        "which are any systems that perceive their environment and take actions that maximize their chance of achieving their goals. "
        "Some popular accounts use the term artificial intelligence to describe machines that mimic cognitive functions that "
        "humans associate with the human mind, such as learning and problem solving. "
        "AI applications include advanced web search engines, recommendation systems, understanding human speech, "
        "self-driving cars, automated decision-making, and competing at the highest level in strategic game systems. "
        "As machines become increasingly capable, tasks considered to require intelligence are often removed from the definition of AI, "
        "a phenomenon known as the AI effect. For instance, optical character recognition is frequently excluded from things considered to be AI."
    )
    for length in ["short", "medium", "long"]:
        res = client.post("/api/summarize", json={"text": text, "summaryLength": length})
        assert res.status_code == 200
        data = res.json()
        assert "summary" in data and len(data["summary"]) > 0
        assert "keyPoints" in data and len(data["keyPoints"]) > 0
        assert "mainIdeas" in data and len(data["mainIdeas"]) > 0
        print(f"[PASS] /api/summarize ({length}): words={data['stats']['summaryWords']}, provider={data['providerUsed']}")

def test_upload_and_process():
    fake_png = (
        b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15c4'
        b'\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82'
    )
    res = client.post("/api/upload", files={"file": ("test_dot.png", fake_png, "image/png")})
    assert res.status_code == 200
    data = res.json()
    assert "filename" in data
    print("[PASS] /api/upload:", data["filename"], data["sizeFormatted"])

if __name__ == "__main__":
    test_health()
    test_summarize_nlp()
    test_upload_and_process()
    print("ALL BACKEND SANITY TESTS COMPLETED SUCCESSFULLY!")
