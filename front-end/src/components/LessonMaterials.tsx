'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  FileText, Film, Archive, Image, File,
  Download, Trash2, Paperclip, Loader2,
} from 'lucide-react';
import { FileUploader } from './FileUploader';
import apiClient from '../lib/api/client';
import { useTranslation } from '../lib/i18n/useTranslation';

interface MaterialFile {
  id: number;
  original_name: string;
  mime_type: string;
  size_bytes: number;
  file_type: string;
  created_at: string;
}

interface LessonMaterialsProps {
  lessonId: number;
  courseId: number;
  isTeacher: boolean;
}

function humanSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
}

function FileIcon({ mime }: { mime: string }) {
  const cls = 'w-4 h-4 flex-shrink-0';
  if (mime.startsWith('image/'))  return <Image   className={`${cls} text-blue-500`}   />;
  if (mime.startsWith('video/'))  return <Film    className={`${cls} text-purple-500`} />;
  if (mime.includes('zip'))       return <Archive className={`${cls} text-amber-500`}  />;
  if (mime.includes('pdf') || mime.includes('word') || mime.includes('text'))
    return <FileText className={`${cls} text-red-500`} />;
  return <File className={`${cls} text-slate-400`} />;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

export function LessonMaterials({ lessonId, courseId, isTeacher }: LessonMaterialsProps) {
  const { t } = useTranslation();
  const [files, setFiles]         = useState<MaterialFile[]>([]);
  const [loading, setLoading]     = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const fetchFiles = useCallback(async () => {
    try {
      const { data } = await apiClient.get(`/lessons/${lessonId}/files`);
      setFiles(data);
    } catch {
      // silently ignore — might be no files yet
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  useEffect(() => { fetchFiles(); }, [fetchFiles]);

  const handleUpload = async (file: File) => {
    const form = new FormData();
    form.append('file', file);
    form.append('courseId', String(courseId));
    await apiClient.post(`/lessons/${lessonId}/files`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    await fetchFiles();
  };

  const handleDownload = async (fileId: number, name: string) => {
    setDownloadingId(fileId);
    try {
      const { data } = await apiClient.get(`/files/${fileId}/download`);
      // Open presigned URL in new tab — browser handles download
      const a = document.createElement('a');
      a.href = data.url;
      a.download = name;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.click();
    } catch (err) {
      console.error('Download failed', err);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = async (fileId: number) => {
    if (!confirm(t('files', 'deleteConfirm'))) return;
    setDeletingId(fileId);
    try {
      await apiClient.delete(`/files/${fileId}`);
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
    } catch (err) {
      console.error('Delete failed', err);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-400 text-sm py-3">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading materials…
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Paperclip className="w-5 h-5 text-indigo-600" />
        <h2 className="text-lg font-bold text-slate-900">{t('files', 'materials')}</h2>
        {files.length > 0 && (
          <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">
            {files.length}
          </span>
        )}
      </div>

      {/* Upload area (teacher only) */}
      {isTeacher && (
        <FileUploader
          onUpload={handleUpload}
          variant="material"
          label={t('files', 'uploadMaterial')}
          hint={t('files', 'materialHint')}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.txt,image/*,video/mp4,video/webm,audio/*"
          maxSizeMB={200}
        />
      )}

      {/* File list */}
      {files.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-slate-200 rounded-2xl text-center">
          <Paperclip className="w-8 h-8 text-slate-300 mb-2" />
          <p className="text-sm text-slate-500">{t('files', 'noMaterials')}</p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100 bg-white rounded-2xl ring-1 ring-slate-200 overflow-hidden">
          {files.map((file) => (
            <li
              key={file.id}
              className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
            >
              <FileIcon mime={file.mime_type} />

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{file.original_name}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {humanSize(file.size_bytes)} · {formatDate(file.created_at)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => handleDownload(file.id, file.original_name)}
                  disabled={downloadingId === file.id}
                  title={t('files', 'download')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors disabled:opacity-50"
                >
                  {downloadingId === file.id
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <Download className="w-4 h-4" />}
                </button>

                {isTeacher && (
                  <button
                    onClick={() => handleDelete(file.id)}
                    disabled={deletingId === file.id}
                    title={t('files', 'delete')}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    {deletingId === file.id
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <Trash2 className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
