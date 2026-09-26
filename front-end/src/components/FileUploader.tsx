'use client';

import React, { useRef, useState, useCallback } from 'react';
import { Upload, X, FileText, Image, Film, Archive, File } from 'lucide-react';

interface FileUploaderProps {
  onUpload: (file: File) => Promise<void>;
  accept?: string;           // e.g. "image/*" or ".pdf,.docx"
  maxSizeMB?: number;
  hint?: string;
  label?: string;
  variant?: 'cover' | 'material';  // cover = compact square, material = wide
  currentUrl?: string | null;      // current image URL to preview (for covers)
  disabled?: boolean;
}

function humanSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
}

function fileIcon(mime: string) {
  if (mime.startsWith('image/'))  return <Image   className="w-5 h-5 text-blue-500"   />;
  if (mime.startsWith('video/'))  return <Film    className="w-5 h-5 text-purple-500" />;
  if (mime.includes('zip') || mime.includes('archive')) return <Archive className="w-5 h-5 text-amber-500" />;
  if (mime.includes('pdf') || mime.includes('word') || mime.includes('text')) return <FileText className="w-5 h-5 text-red-500" />;
  return <File className="w-5 h-5 text-slate-400" />;
}

export function FileUploader({
  onUpload,
  accept = '*/*',
  maxSizeMB = 200,
  hint,
  label = 'Upload file',
  variant = 'material',
  currentUrl,
  disabled = false,
}: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validate = useCallback((file: File): string | null => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `File too large. Maximum size is ${maxSizeMB} MB.`;
    }
    return null;
  }, [maxSizeMB]);

  const handleFile = useCallback((file: File) => {
    const err = validate(file);
    if (err) { setError(err); return; }
    setError('');
    setSuccess(false);
    setSelectedFile(file);
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
  }, [validate]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setError('');
    try {
      await onUpload(selectedFile);
      setSuccess(true);
      setSelectedFile(null);
      setPreview(null);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const clear = () => {
    setSelectedFile(null);
    setPreview(null);
    setError('');
  };

  // ── Cover variant (compact image uploader) ────────────────────────────────
  if (variant === 'cover') {
    const displayUrl = preview || currentUrl;
    return (
      <div className="space-y-2">
        {label && <p className="text-sm font-medium text-slate-700">{label}</p>}
        <div
          className={`relative w-full h-40 rounded-2xl overflow-hidden ring-2 transition-colors cursor-pointer ${
            isDragging ? 'ring-indigo-400 bg-indigo-50' : 'ring-slate-200 bg-slate-50 hover:ring-indigo-300'
          }`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => !disabled && inputRef.current?.click()}
        >
          {displayUrl ? (
            <>
              <img src={displayUrl} alt="Cover preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-2 text-white text-sm font-medium">
                  <Upload className="w-4 h-4" /> Change cover
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center gap-2 text-slate-400">
              <Image className="w-8 h-8" />
              <span className="text-xs text-center px-4">{hint || 'Click or drag to upload cover image'}</span>
            </div>
          )}
        </div>
        <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleInputChange} disabled={disabled} />

        {selectedFile && !uploading && (
          <div className="flex items-center justify-between gap-2 bg-indigo-50 rounded-xl px-3 py-2">
            <div className="flex items-center gap-2 min-w-0">
              {fileIcon(selectedFile.type)}
              <span className="text-xs text-slate-700 truncate">{selectedFile.name}</span>
              <span className="text-xs text-slate-400 flex-shrink-0">{humanSize(selectedFile.size)}</span>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={(e) => { e.stopPropagation(); handleUpload(); }}
                className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors"
              >
                Upload
              </button>
              <button onClick={(e) => { e.stopPropagation(); clear(); }} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
        {uploading && <p className="text-xs text-indigo-600 text-center animate-pulse">Uploading…</p>}
        {success  && <p className="text-xs text-green-600 text-center">✓ Uploaded successfully</p>}
        {error    && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  }

  // ── Material variant (wide file uploader) ─────────────────────────────────
  return (
    <div className="space-y-2">
      {label && <p className="text-sm font-medium text-slate-700">{label}</p>}

      {/* Drop zone */}
      <div
        className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 cursor-pointer transition-colors ${
          isDragging
            ? 'border-indigo-400 bg-indigo-50'
            : 'border-slate-300 hover:border-indigo-300 hover:bg-slate-50'
        } ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className={`w-7 h-7 ${isDragging ? 'text-indigo-500' : 'text-slate-400'}`} />
        <p className="text-sm text-slate-600 text-center">
          <span className="font-medium text-indigo-600">Click to browse</span> or drag & drop
        </p>
        {hint && <p className="text-xs text-slate-400 text-center">{hint}</p>}
      </div>
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleInputChange} disabled={disabled} />

      {/* Selected file preview */}
      {selectedFile && (
        <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 ring-1 ring-slate-200">
          {fileIcon(selectedFile.type)}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">{selectedFile.name}</p>
            <p className="text-xs text-slate-400">{humanSize(selectedFile.size)}</p>
          </div>
          {!uploading && (
            <>
              <button
                onClick={handleUpload}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors flex-shrink-0"
              >
                Upload
              </button>
              <button onClick={clear} className="p-1 text-slate-400 hover:text-slate-700 flex-shrink-0">
                <X className="w-4 h-4" />
              </button>
            </>
          )}
          {uploading && (
            <div className="flex items-center gap-1.5 text-xs text-indigo-600 flex-shrink-0">
              <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Uploading…
            </div>
          )}
        </div>
      )}

      {success && (
        <p className="text-xs text-green-600 flex items-center gap-1">
          <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
          </svg>
          File uploaded successfully
        </p>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
