import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { UploadCloud, File, Image as ImageIcon, FileCheck } from 'lucide-react';
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
  };

  const handleDropInternal = (e: DragEvent<HTMLDivElement>) => {
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
      onDrop={handleDropInternal}
      onClick={openFilePicker}
      className={`relative group rounded-3xl border-2 border-dashed p-8 sm:p-14 text-center cursor-pointer transition-all duration-300 ${
        disabled
          ? 'bg-sand-100/40 dark:bg-espresso-900/40 border-sand-300 dark:border-espresso-700 cursor-not-allowed opacity-60'
          : isDragging
          ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 ring-4 ring-brand-500/20 scale-[1.01]'
          : 'bg-white dark:bg-espresso-900 hover:bg-sand-50/60 dark:hover:bg-espresso-850 border-sand-300 dark:border-espresso-700 hover:border-brand-400 dark:hover:border-brand-500 shadow-sm hover:shadow-md'
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
              ? 'bg-brand-600 text-white scale-110 shadow-lg shadow-brand-600/30'
              : 'bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 group-hover:bg-brand-200/80 dark:group-hover:bg-brand-900 group-hover:scale-105'
          }`}
        >
          <UploadCloud className="w-8 h-8" />
        </div>

        {/* Text guidance */}
        <div className="space-y-1.5 max-w-md">
          <p className="text-base sm:text-lg font-semibold text-sand-900 dark:text-sand-100">
            {isDragging ? 'Drop your document here' : 'Drag & drop your document here'}
          </p>
          <p className="text-xs sm:text-sm text-sand-500 dark:text-sand-400">
            Upload a PDF, PNG, or JPEG file to extract text and generate summaries.
          </p>
        </div>

        {/* Browse Button */}
        <div>
          <button
            type="button"
            disabled={disabled}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 active:from-brand-700 active:to-brand-800 transition shadow-sm hover:shadow-brand-500/20 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
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
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-sand-500 dark:text-sand-400">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-sand-100 dark:bg-espresso-800 font-medium text-sand-700 dark:text-sand-300 border border-sand-200 dark:border-espresso-700">
            <File className="w-3 h-3 text-rose-500" /> PDF Document
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-sand-100 dark:bg-espresso-800 font-medium text-sand-700 dark:text-sand-300 border border-sand-200 dark:border-espresso-700">
            <ImageIcon className="w-3 h-3 text-amber-600" /> PNG / JPG / JPEG
          </span>
          <span className="text-sand-400 dark:text-sand-500 font-normal">Max size: 25 MB</span>
        </div>
      </div>
    </div>
  );
}
