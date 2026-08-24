from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class UploadResponse(BaseModel):
    filename: str
    originalName: str
    contentType: str
    sizeBytes: int
    sizeFormatted: str


class ProcessRequest(BaseModel):
    filename: str


class ImageExtractionInfo(BaseModel):
    name: str
    ocrText: Optional[str] = ""
    description: Optional[str] = ""
    b64: Optional[str] = None
    error: Optional[str] = None


class ProcessResponse(BaseModel):
    filename: str
    fileType: str
    text: str
    wordCount: int
    characterCount: int
    pageCount: Optional[int] = None
    images: Optional[List[ImageExtractionInfo]] = []
    hasExtractedText: bool = True
    ocrApplied: bool = False
    warning: Optional[str] = None


class SummarizeRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Document text to summarize")
    summaryLength: str = Field(
        default="short",
        description="Desired length: 'short', 'medium', or 'long'",
    )
    provider: Optional[str] = Field(
        default="auto",
        description="AI Provider to use: 'auto', 'gemini', 'openai', or 'extractive'",
    )


class SummaryStats(BaseModel):
    originalWords: int
    summaryWords: int
    compressionRatio: str
    estimatedReadingTimeOriginal: str
    estimatedReadingTimeSummary: str


class SummarizeResponse(BaseModel):
    summary: str
    keyPoints: List[str]
    mainIdeas: List[str]
    stats: Optional[SummaryStats] = None
    providerUsed: str
    summaryLength: str


class HealthResponse(BaseModel):
    status: str
    version: str
    tesseractAvailable: bool
    geminiAvailable: bool
    openaiAvailable: bool
