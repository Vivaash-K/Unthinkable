import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { UploadCloud, File, Image as ImageIcon, FileCheck, AlertCircle } from 'lucide-react';
import { AppError } from '../types';

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  onError: (error: AppError) => void;
  disabled?: boolean;
}

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB
const ACCEPTED_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
const ACCEPTED_EXTS = ['.pdf', '.png', '.jpg', '.jpeg'];

export default function FileUpload({ onFileSelected, onError, disabled = false }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndPassFile = (file: File) => {
    // 1. Check size
    if (file.size === 0) {
      onError({
        title: 'Empty File',
        message: 'The selected file is empty (0 bytes).',
        suggestion: 'Please choose a valid PDF or image document with content.',
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      onError({
        title: 'File Too Large',
        message: `File size exceeds the 25 MB limit (selected file is ${(file.size / (1024 * 1024)).toFixed(1)} MB).`,
        suggestion: 'Please upload a file smaller than 25 MB or compress your document.',
      });
      return;
    }

    // 2. Check format
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    const isValidType = ACCEPTED_TYPES.includes(file.type) || ACCEPTED_EXTS.includes(ext);

    if (!isValidType) {
      onError({
        title: 'Unsupported File Format',
        message: `The file format '${file.type || ext}' is not supported.`,
        suggestion: 'Please upload a PDF (.pdf) or image (.png, .jpg, .jpeg) document.',
      });
      return;
    }

    onFileSelected(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndPassFile(files[0]);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndPassFile(files[0]);
    }
    // Reset value so the user can re-select the same file if desired
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFilePicker = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={openFilePicker}
      className={`relative group rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 ${
        disabled
          ? 'bg-slate-50/60 border-slate-200 cursor-not-allowed opacity-60'
          : isDragging
          ? 'bg-brand-50/80 border-brand-500 ring-4 ring-brand-500/20 scale-[1.01]'
          : 'bg-white hover:bg-slate-50/80 border-slate-300/90 hover:border-brand-400 shadow-sm hover:shadow-md'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
        onChange={handleInputChange}
        disabled={disabled}
        className="hidden"
      />

      <div className="flex flex-col items-center justify-center space-y-4">
        {/* Upload Icon with animated background */}
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            isDragging
              ? 'bg-brand-600 text-white scale-110 shadow-lg shadow-brand-500/30'
              : 'bg-brand-50 text-brand-600 group-hover:bg-brand-100 group-hover:scale-105'
          }`}
        >
          <UploadCloud className="w-8 h-8" />
        </div>

        {/* Text guidance */}
        <div className="space-y-1.5 max-w-md">
          <p className="text-base sm:text-lg font-semibold text-slate-800">
            {isDragging ? 'Drop your document here' : 'Drag & drop your document here'}
          </p>
          <p className="text-xs sm:text-sm text-slate-500">
            Upload a PDF, PNG, or JPEG file to automatically extract text and generate summaries.
          </p>
        </div>

        {/* Browse Button */}
        <div>
          <button
            type="button"
            disabled={disabled}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 transition shadow-sm hover:shadow-brand-500/20 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            onClick={(e) => {
              e.stopPropagation();
              openFilePicker();
            }}
          >
            <FileCheck className="w-4 h-4" />
            <span>Browse Files</span>
          </button>
        </div>

        {/* Format Badges & Info */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 font-medium text-slate-600 border border-slate-200/60">
            <File className="w-3 h-3 text-red-500" /> PDF Document
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 font-medium text-slate-600 border border-slate-200/60">
            <ImageIcon className="w-3 h-3 text-blue-500" /> PNG / JPG / JPEG
          </span>
          <span className="text-slate-400 font-normal">Max size: 25 MB</span>
        </div>
      </div>
    </div>
  );
}
