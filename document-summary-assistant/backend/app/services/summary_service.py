import re
import os
import json
from typing import List, Dict

# Optional OpenAI integration. If OPENAI_API_KEY is set in the environment, the LLM will be used.
try:
    import openai
except Exception:
    openai = None


def split_into_sentences(text: str) -> List[str]:
    # Very simple sentence splitter
    sentences = re.split(r'(?<=[.!?])\s+', text.strip())
    return [s.strip() for s in sentences if s.strip()]


def _extractive_summary(text: str, length: str = 'short') -> Dict:
    """Fallback extractive summarizer used when LLM is unavailable or fails."""
    sentences = split_into_sentences(text)
    if not sentences:
        return {"summary": "", "keyPoints": [], "mainIdeas": []}

    if length == 'short':
        n = 3
    elif length == 'medium':
        n = 6
    else:
        n = 12

    summary = ' '.join(sentences[:n])

    # Key points: take the first 5 sentences
    key_points = sentences[:5]

    # Main ideas: crude approach - take first clause of first few sentences
    main_ideas = []
    for s in sentences[:6]:
        clause = s.split(':')[0].split('-')[0].strip()
        if clause and clause not in main_ideas:
            main_ideas.append(clause)

    return {"summary": summary, "keyPoints": key_points, "mainIdeas": main_ideas}


def _try_parse_json_from_text(s: str) -> Dict:
    # Find the first {...} block and try to parse it as JSON
    m = re.search(r"\{[\s\S]*\}", s)
    if not m:
        raise ValueError("No JSON object found in text")
    candidate = m.group(0)
    return json.loads(candidate)


def summarize_text(text: str, length: str = 'short') -> Dict:
    """Summarize text using an LLM when available, otherwise fall back to a simple extractive summarizer.

    LLM output is requested as a strict JSON object with keys: summary, keyPoints (array), mainIdeas (array).
    """
    api_key = os.getenv('OPENAI_API_KEY')
    if openai and api_key:
        try:
            openai.api_key = api_key
            prompt = (
                "You are a helpful summarization assistant. Given the provided document text, produce a JSON object"
                " with the following keys: summary (a natural-language summary according to the requested length),"
                " keyPoints (an array of concise bullet points listing the most important facts or ideas),"
                " and mainIdeas (an array of the major topics/themes). Do NOT add any extra keys."
                " Be faithful to the input and do not invent facts."
                "\n\nRespond ONLY with valid JSON.\n\nDocument:\n" + text + "\n\nLength:" + length
            )

            # Use chat completion if available
            if hasattr(openai, 'ChatCompletion'):
                resp = openai.ChatCompletion.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": "You are a JSON output summarizer."},
                        {"role": "user", "content": prompt},
                    ],
                    temperature=0.2,
                    max_tokens=800,
                )
                content = resp['choices'][0]['message']['content']
            else:
                # Fallback to the older Completion API
                resp = openai.Completion.create(
                    engine="text-davinci-003",
                    prompt=prompt,
                    temperature=0.2,
                    max_tokens=800,
                )
                content = resp['choices'][0]['text']

            # Try to extract JSON from the model output
            parsed = _try_parse_json_from_text(content)

            # Basic validation: ensure keys exist
            if not isinstance(parsed, dict) or 'summary' not in parsed:
                raise ValueError('Parsed JSON missing required keys')

            return {
                'summary': parsed.get('summary', '').strip(),
                'keyPoints': parsed.get('keyPoints', []) if isinstance(parsed.get('keyPoints', []), list) else [],
                'mainIdeas': parsed.get('mainIdeas', []) if isinstance(parsed.get('mainIdeas', []), list) else [],
            }

        except Exception as e:
            # Log the error to server logs for debugging and fall back
            try:
                import logging
                logging.exception('LLM summarization failed; falling back to extractive summarizer: %s', e)
            except Exception:
                pass
            return _extractive_summary(text, length)

    # No API key or openai not installed — use fallback
    return _extractive_summary(text, length)


def describe_image(ocr_text: str, filename: str = '') -> str:
    """Generate a natural-language description for an image. If OpenAI is configured use it, otherwise return a fallback based on OCR text."""
    api_key = os.getenv('OPENAI_API_KEY')
    if openai and api_key:
        try:
            openai.api_key = api_key
            prompt = (
                "You are an assistant that writes concise descriptive captions for images. "
                "Given the OCR text extracted from the image (if any) and the filename, write a 1-2 sentence description of what the image likely shows. "
                "If OCR text is empty, provide a generic descriptive caption. Be concise and factual and do not invent specific unverifiable facts.\n\n"
                f"Filename: {filename}\nOCR text:\n{ocr_text}\n\nCaption:"
            )
            if hasattr(openai, 'ChatCompletion'):
                resp = openai.ChatCompletion.create(
                    model='gpt-3.5-turbo',
                    messages=[
                        {"role": "system", "content": "You produce short factual image captions."},
                        {"role": "user", "content": prompt},
                    ],
                    temperature=0.3,
                    max_tokens=150,
                )
                content = resp['choices'][0]['message']['content']
            else:
                resp = openai.Completion.create(
                    engine='text-davinci-003',
                    prompt=prompt,
                    temperature=0.3,
                    max_tokens=150,
                )
                content = resp['choices'][0]['text']
            return content.strip()
        except Exception:
            return (ocr_text.strip()[:300] + '...') if ocr_text.strip() else 'No description available.'
    # Fallback
    return (ocr_text.strip()[:300] + '...') if ocr_text.strip() else 'No description available.'
