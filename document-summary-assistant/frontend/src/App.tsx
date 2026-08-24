import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import FilePreview from './components/FilePreview';
import SummaryLengthSelector from './components/SummaryLengthSelector';
import ProcessingStatus from './components/ProcessingStatus';
import ExtractedTextViewer from './components/ExtractedTextViewer';
import SummaryResult from './components/SummaryResult';
import ErrorMessage from './components/ErrorMessage';
import {
  UploadedFileInfo,
  ProcessResult,
  SummaryResultData,
  SummaryLength,
  ProcessingStage,
  AppError,
  HealthStatus,
} from './types';
import {
  uploadDocument,
  processDocument,
  summarizeDocument,
  checkHealth,
} from './services/api';

export default function App() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [fileInfo, setFileInfo] = useState<UploadedFileInfo | null>(null);
  const [processResult, setProcessResult] = useState<ProcessResult | null>(null);
  const [summaryResult, setSummaryResult] = useState<SummaryResultData | null>(null);
  const [summaryLength, setSummaryLength] = useState<SummaryLength>('short');
  const [stage, setStage] = useState<ProcessingStage>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [error, setError] = useState<AppError | null>(null);

  // Initial health check
  useEffect(() => {
    checkHealth().then(setHealth);
  }, []);

  // Handle document upload and automatic text extraction
  const handleFileSelected = async (file: File) => {
    setError(null);
    setSummaryResult(null);
    setProcessResult(null);
    setStage('uploading');
    setStatusMessage(`Uploading ${file.name}...`);

    try {
      // 1. Upload File
      const uploaded = await uploadDocument(file);
      setFileInfo(uploaded);

      // 2. Extract Text & OCR
      setStage('extracting');
      setStatusMessage('Extracting text & running OCR analysis...');
      const processed = await processDocument(uploaded.filename);
      setProcessResult(processed);

      if (!processed.hasExtractedText || processed.wordCount === 0) {
        setError({
          title: 'No Text Extracted',
          message:
            processed.warning ||
            'Could not extract readable text from this document. It may be empty or unreadable.',
          suggestion: 'Try uploading a higher-resolution image or a text-based PDF.',
        });
        setStage('idle');
        return;
      }

      setStage('idle');
    } catch (err: any) {
      console.error('Upload or process failed:', err);
      setError({
        title: 'Document Processing Failed',
        message: err.message || 'An error occurred while uploading and extracting text.',
        suggestion: 'Please check that the backend server is running and try again.',
      });
      setStage('idle');
    }
  };

  // Handle AI summary generation
  const handleGenerateSummary = async () => {
    if (!processResult || !processResult.text) {
      setError({
        title: 'Missing Document Text',
        message: 'There is no extracted text to summarize.',
        suggestion: 'Please upload a document first.',
      });
      return;
    }

    setError(null);
    setStage('analyzing');
    setStatusMessage('Analyzing content structure & key concepts...');

    // Small delay to show smooth multi-stage transition
    setTimeout(async () => {
      setStage('summarizing');
      setStatusMessage('Synthesizing summary, key points, and main ideas...');

      try {
        const result = await summarizeDocument(processResult.text, summaryLength, 'auto');
        setSummaryResult(result);
        setStage('completed');
      } catch (err: any) {
        console.error('Summarize failed:', err);
        setError({
          title: 'Summary Generation Failed',
          message: err.message || 'An error occurred while generating the summary.',
          suggestion: 'Try selecting a different summary length or re-uploading the document.',
        });
        setStage('idle');
      }
    }, 450);
  };

  // Reset everything to upload a new document
  const handleReset = () => {
    setFileInfo(null);
    setProcessResult(null);
    setSummaryResult(null);
    setStage('idle');
    setError(null);
    setStatusMessage('');
  };

  const isProcessing =
    stage === 'uploading' ||
    stage === 'extracting' ||
    stage === 'analyzing' ||
    stage === 'summarizing';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-brand-500 selection:text-white">
      {/* Header Bar */}
      <Header health={health} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Error Alert Display */}
        <ErrorMessage
          error={error}
          onDismiss={() => setError(null)}
          onRetry={fileInfo && !processResult ? () => handleFileSelected(fileInfo as any) : undefined}
        />

        {/* Multi-stage Progress Stepper */}
        {isProcessing && (
          <div className="mb-8">
            <ProcessingStatus stage={stage} statusMessage={statusMessage} />
          </div>
        )}

        {/* Step 1: Upload Dropzone (shown when no file is uploaded and not in completed results) */}
        {!fileInfo && !isProcessing && (
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Transform any document into actionable insights
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                Upload PDFs, scanned documents, or images. Our engine extracts the text and produces
                concise, structured summaries with key takeaways in seconds.
              </p>
            </div>

            <FileUpload
              onFileSelected={handleFileSelected}
              onError={(err) => setError(err)}
              disabled={isProcessing}
            />
          </div>
        )}

        {/* Step 2: Document Loaded & Configuration Controls */}
        {fileInfo && !isProcessing && (
          <div className="space-y-6 animate-fade-in">
            {/* File Info Bar */}
            <FilePreview
              fileInfo={fileInfo}
              processResult={processResult}
              onRemove={handleReset}
              onReplace={handleFileSelected}
              disabled={isProcessing}
            />

            {/* Extracted Text Collapsible Viewer */}
            {processResult && processResult.hasExtractedText && (
              <ExtractedTextViewer processResult={processResult} />
            )}

            {/* Summary Length Selector & Generate Action */}
            {processResult && processResult.hasExtractedText && (
              <SummaryLengthSelector
                selectedLength={summaryLength}
                onChange={(len) => {
                  setSummaryLength(len);
                }}
                onGenerate={handleGenerateSummary}
                isLoading={isProcessing}
                disabled={!processResult.hasExtractedText || isProcessing}
              />
            )}

            {/* Results Section */}
            {summaryResult && (
              <div className="pt-4">
                <SummaryResult
                  data={summaryResult}
                  documentName={fileInfo.originalName}
                  onReset={handleReset}
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Document Summary Assistant • Production Quality AI Web App</span>
          <span className="text-slate-400">PDF Parsing • Tesseract OCR • Structured Summarization</span>
        </div>
      </footer>
    </div>
  );
}
