import os
import re
import json
import math
import logging
from collections import Counter
from typing import List, Dict, Any, Optional

from app.config import OPENAI_API_KEY, GEMINI_API_KEY

logger = logging.getLogger(__name__)

# Try importing OpenAI
try:
    from openai import OpenAI
except ImportError:
    OpenAI = None

# Try importing Google GenAI
try:
    from google import genai
    from google.genai import types as genai_types
except ImportError:
    genai = None
    genai_types = None

# Comprehensive English stop words for extractive NLP
STOP_WORDS = {
    'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any',
    'are', 'aren\'t', 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below',
    'between', 'both', 'but', 'by', 'can', 'can\'t', 'cannot', 'could', 'couldn\'t',
    'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during',
    'each', 'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t',
    'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here',
    'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i',
    'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it',
    'it\'s', 'its', 'itself', 'let\'s', 'me', 'more', 'most', 'mustn\'t', 'my',
    'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other',
    'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan\'t',
    'she', 'she\'d', 'she\'ll', 'she\'s', 'should', 'shouldn\'t', 'so', 'some',
    'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them', 'themselves',
    'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re',
    'they\'ve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up',
    'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were',
    'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which',
    'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would',
    'wouldn\'t', 'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours',
    'yourself', 'yourselves', 'also', 'furthermore', 'moreover', 'however', 'therefore'
}


def split_into_sentences(text: str) -> List[str]:
    """Split text into individual sentences accurately."""
    text = text.replace('\r\n', ' ').replace('\n', ' ')
    # Fixed-width look-behind for sentence terminators
    raw_sentences = re.split(r'(?<=[.!?])\s+', text)
    sentences = []
    for s in raw_sentences:
        cleaned = s.strip()
        if len(cleaned) > 10:
            sentences.append(cleaned)
    return sentences


def calculate_stats(original_text: str, summary_text: str) -> Dict[str, Any]:
    """Calculate word count, compression ratio, and estimated reading time."""
    orig_words = len(re.findall(r'\b\w+\b', original_text))
    summ_words = len(re.findall(r'\b\w+\b', summary_text))

    if orig_words > 0:
        ratio = max(0, round((1 - (summ_words / orig_words)) * 100))
        ratio_str = f"{ratio}% reduction"
    else:
        ratio_str = "0%"

    orig_time_mins = max(1, math.ceil(orig_words / 200))
    summ_time_mins = max(1, math.ceil(summ_words / 200))

    return {
        "originalWords": orig_words,
        "summaryWords": summ_words,
        "compressionRatio": ratio_str,
        "estimatedReadingTimeOriginal": f"{orig_time_mins} min read" if orig_words >= 200 else "< 1 min read",
        "estimatedReadingTimeSummary": f"{summ_time_mins} min read" if summ_words >= 200 else "< 1 min read",
    }


def _extract_main_ideas_nlp(words: List[str], sentences: List[str]) -> List[str]:
    """Extract key themes/topics from word frequency and capitalized concepts."""
    content_words = [
        w.lower() for w in words
        if w.lower() not in STOP_WORDS and len(w) > 3 and not w.isdigit()
    ]
    word_counts = Counter(content_words)

    # Extract high frequency bigrams
    bigrams = []
    for i in range(len(words) - 1):
        w1, w2 = words[i].lower(), words[i + 1].lower()
        if w1 not in STOP_WORDS and w2 not in STOP_WORDS and len(w1) > 2 and len(w2) > 2:
            bigrams.append(f"{w1.title()} {w2.title()}")
    bigram_counts = Counter(bigrams)

    ideas = []
    for bg, count in bigram_counts.most_common(4):
        if count >= 2 and bg not in ideas:
            ideas.append(bg)

    for word, count in word_counts.most_common(8):
        title_word = word.title()
        if title_word not in ideas and not any(title_word in item for item in ideas):
            ideas.append(title_word)
        if len(ideas) >= 6:
            break

    return ideas[:6] if ideas else ["Document Overview", "Key Information", "Main Findings"]


def _extractive_summary(text: str, length: str = 'short') -> Dict[str, Any]:
    """Intelligent fallback extractive summarizer using TF-IDF term scoring."""
    sentences = split_into_sentences(text)
    if not sentences:
        return {
            "summary": text.strip() if len(text.strip()) < 500 else text.strip()[:500] + "...",
            "keyPoints": [text.strip()[:150]] if text.strip() else [],
            "mainIdeas": ["Overview"],
            "providerUsed": "Extractive NLP Engine",
            "summaryLength": length,
        }

    words = re.findall(r'\b[a-zA-Z]{2,}\b', text)
    content_words = [w.lower() for w in words if w.lower() not in STOP_WORDS]
    word_freq = Counter(content_words)
    max_freq = max(word_freq.values()) if word_freq else 1

    # Normalize frequencies
    normalized_freq = {word: count / max_freq for word, count in word_freq.items()}

    # Score each sentence
    sentence_scores: List[float] = []
    total_sentences = len(sentences)

    for idx, sent in enumerate(sentences):
        sent_words = re.findall(r'\b[a-zA-Z]{2,}\b', sent.lower())
        if not sent_words:
            sentence_scores.append(0.0)
            continue

        score = sum(normalized_freq.get(w, 0.0) for w in sent_words) / len(sent_words)

        # Position weighting: boost first 15% and last 10% of sentences
        pos_ratio = idx / total_sentences
        if pos_ratio < 0.15:
            score *= 1.35
        elif pos_ratio > 0.85:
            score *= 1.15

        sentence_scores.append(score)

    # Determine sentence target based on length mode
    if length == 'short':
        target_count = min(max(3, round(total_sentences * 0.15)), 4)
        kp_count = 3
    elif length == 'medium':
        target_count = min(max(5, round(total_sentences * 0.30)), 8)
        kp_count = 5
    else:  # long
        target_count = min(max(8, round(total_sentences * 0.50)), 15)
        kp_count = 7

    # Select top ranked sentences preserving original chronological order
    ranked_indices = sorted(range(len(sentence_scores)), key=lambda i: sentence_scores[i], reverse=True)
    selected_indices = sorted(ranked_indices[:target_count])
    summary_sentences = [sentences[i] for i in selected_indices]
    summary = ' '.join(summary_sentences)

    # Key points from top sentences
    kp_indices = ranked_indices[:kp_count]
    key_points = [sentences[i].rstrip('.') for i in kp_indices]

    # Main ideas
    main_ideas = _extract_main_ideas_nlp(words, sentences)

    stats = calculate_stats(text, summary)

    return {
        "summary": summary,
        "keyPoints": key_points,
        "mainIdeas": main_ideas,
        "stats": stats,
        "providerUsed": "Extractive NLP Engine",
        "summaryLength": length,
    }


def _try_parse_json(content: str) -> Optional[Dict[str, Any]]:
    """Robust JSON extraction from LLM response strings."""
    if not content:
        return None
    cleaned = re.sub(r'^```(?:json)?\s*', '', content.strip(), flags=re.MULTILINE)
    cleaned = re.sub(r'\s*```$', '', cleaned.strip(), flags=re.MULTILINE)

    try:
        data = json.loads(cleaned)
        if isinstance(data, dict):
            return data
    except Exception:
        pass

    match = re.search(r'\{[\s\S]*\}', content)
    if match:
        try:
            data = json.loads(match.group(0))
            if isinstance(data, dict):
                return data
        except Exception:
            pass

    return None


def summarize_with_gemini(text: str, length: str) -> Optional[Dict[str, Any]]:
    """Summarize text using Google Gemini API."""
    if not GEMINI_API_KEY:
        logger.warning("summarize_with_gemini called but GEMINI_API_KEY is empty.")
        return None
    if genai is None:
        logger.warning("summarize_with_gemini called but google.genai package is not available.")
        return None

    try:
        logger.info(f"Initiating Google Gemini summarization for {len(text)} characters (mode: {length})...")
        client = genai.Client(api_key=GEMINI_API_KEY)
        length_instructions = {
            "short": "Generate a concise executive summary in approximately 3–5 sentences focusing only on the primary takeaway.",
            "medium": "Generate a well-balanced and detailed summary covering all essential arguments, key findings, and context.",
            "long": "Generate a comprehensive, in-depth summary detailing full context, core methodology/arguments, supporting evidence, and final conclusions.",
        }.get(length, "Generate a balanced summary.")

        prompt = f"""You are an expert AI document summarizer. Analyze the provided document text and generate an intelligent, faithful summary strictly based on the extracted content. Do NOT invent facts or hallucinate details.

Length requirement: {length.upper()} - {length_instructions}

Return your response strictly as a JSON object with this structure:
{{
  "summary": "Natural-language narrative summary of the document according to the specified length.",
  "keyPoints": [
    "Most important point 1",
    "Most important point 2",
    "Most important point 3"
  ],
  "mainIdeas": [
    "Theme 1",
    "Theme 2",
    "Theme 3"
  ]
}}

Document Text:
{text}
"""
        # Try current models
        candidate_models = ["gemini-3.6-flash", "gemini-2.5-flash", "gemini-1.5-flash"]
        response = None
        used_model = "gemini-3.6-flash"

        for model_name in candidate_models:
            try:
                logger.info(f"Attempting Gemini generation with model '{model_name}'...")
                response = client.models.generate_content(
                    model=model_name,
                    contents=prompt,
                    config=genai_types.GenerateContentConfig(
                        temperature=0.2,
                        response_mime_type="application/json",
                    )
                )
                if response and response.text:
                    used_model = model_name
                    logger.info(f"Successfully received response from Gemini model '{model_name}'.")
                    break
            except Exception as model_err:
                logger.warning(f"Gemini model {model_name} failed: {model_err}")

        if response and response.text:
            parsed = _try_parse_json(response.text)
            if parsed and "summary" in parsed:
                stats = calculate_stats(text, parsed.get("summary", ""))
                return {
                    "summary": parsed.get("summary", "").strip(),
                    "keyPoints": parsed.get("keyPoints", []) if isinstance(parsed.get("keyPoints"), list) else [],
                    "mainIdeas": parsed.get("mainIdeas", []) if isinstance(parsed.get("mainIdeas"), list) else [],
                    "stats": stats,
                    "providerUsed": f"Google Gemini ({used_model})",
                    "summaryLength": length,
                }
            else:
                logger.warning(f"Failed to parse JSON from Gemini response: {response.text[:200]}")
    except Exception as e:
        logger.error(f"Gemini summarization attempt failed: {e}", exc_info=True)

    return None


def summarize_with_openai(text: str, length: str) -> Optional[Dict[str, Any]]:
    """Summarize text using OpenAI API."""
    if not OPENAI_API_KEY or OpenAI is None:
        return None

    try:
        client = OpenAI(api_key=OPENAI_API_KEY)
        length_instructions = {
            "short": "Generate a concise executive summary in approximately 3–5 sentences.",
            "medium": "Generate a well-balanced summary covering all essential arguments and context.",
            "long": "Generate a comprehensive in-depth summary with full context, evidence, and conclusions.",
        }.get(length, "Generate a balanced summary.")

        system_msg = (
            "You are an expert document summarization assistant. Analyze the user's document text "
            "and respond ONLY with valid JSON having the exact keys: 'summary' (string), 'keyPoints' (array of strings), "
            "and 'mainIdeas' (array of strings). Do not hallucinate."
        )

        user_msg = f"Length mode: {length.upper()} ({length_instructions})\n\nDocument Text:\n{text}"

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_msg},
                {"role": "user", "content": user_msg},
            ],
            response_format={"type": "json_object"},
            temperature=0.2,
            max_tokens=1500,
        )

        content = response.choices[0].message.content
        parsed = _try_parse_json(content)
        if parsed and "summary" in parsed:
            stats = calculate_stats(text, parsed.get("summary", ""))
            return {
                "summary": parsed.get("summary", "").strip(),
                "keyPoints": parsed.get("keyPoints", []) if isinstance(parsed.get("keyPoints"), list) else [],
                "mainIdeas": parsed.get("mainIdeas", []) if isinstance(parsed.get("mainIdeas"), list) else [],
                "stats": stats,
                "providerUsed": "OpenAI (gpt-4o-mini)",
                "summaryLength": length,
            }
    except Exception as e:
        logger.warning(f"OpenAI summarization attempt failed: {e}")

    return None


def summarize_text(text: str, length: str = 'short', provider: str = 'auto') -> Dict[str, Any]:
    """Primary entry point for summarization.

    Supports providers: 'auto', 'gemini', 'openai', 'extractive'.
    Gracefully cascades down to Extractive NLP Engine if LLMs are unavailable.
    """
    cleaned_text = text.strip()
    if not cleaned_text:
        return {
            "summary": "No content provided to summarize.",
            "keyPoints": [],
            "mainIdeas": [],
            "stats": calculate_stats("", ""),
            "providerUsed": "None",
            "summaryLength": length,
        }

    # If specific provider requested
    if provider == "gemini":
        gemini_result = summarize_with_gemini(cleaned_text, length)
        if gemini_result:
            return gemini_result
    elif provider == "openai":
        openai_result = summarize_with_openai(cleaned_text, length)
        if openai_result:
            return openai_result
    elif provider == "extractive":
        return _extractive_summary(cleaned_text, length)

    # Auto strategy: Try Gemini -> Try OpenAI -> Fallback to Extractive
    if GEMINI_API_KEY:
        gemini_res = summarize_with_gemini(cleaned_text, length)
        if gemini_res:
            return gemini_res

    if OPENAI_API_KEY:
        openai_res = summarize_with_openai(cleaned_text, length)
        if openai_res:
            return openai_res

    # Built-in robust fallback
    return _extractive_summary(cleaned_text, length)
