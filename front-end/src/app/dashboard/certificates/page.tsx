'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAppSelector } from '../../../store/hooks';
import apiClient from '../../../lib/api/client';
import { useTranslation } from '../../../lib/i18n/useTranslation';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3000';

interface Certificate {
  id: number;
  course_id: number;
  course_title: string;
  issued_at: string;
  pdf_url: string | null;
  verification_code: string;
}

function CertificateCard({ cert }: { cert: Certificate }) {
  const [downloading, setDownloading] = useState(false);
  const { t } = useTranslation();

  const handleDownload = async () => {
    if (!cert.pdf_url) return;
    setDownloading(true);
    try {
      const url = `${BACKEND_URL}${cert.pdf_url}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('File not found');
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `certificate-${cert.verification_code}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (err) {
      alert(t('certificates', 'downloadFailed'));
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 overflow-hidden flex flex-col">
      {/* Gold gradient header */}
      <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-8 flex items-center justify-center">
        <div className="h-20 w-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
          <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-base font-bold text-slate-900 line-clamp-2 min-h-[2.5rem]">
          {cert.course_title || `Course #${cert.course_id}`}
        </h3>
        <div className="mt-3 space-y-1 text-sm text-slate-500">
          <p>
            {t('certificates', 'issued')}{' '}
            <span className="text-slate-700">
              {new Date(cert.issued_at).toLocaleDateString('en-US', {
                month: 'long', day: 'numeric', year: 'numeric',
              })}
            </span>
          </p>
          <p className="font-mono text-xs text-slate-400 truncate" title={cert.verification_code}>
            {t('certificates', 'id')} {cert.verification_code}
          </p>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-200">
          {cert.pdf_url ? (
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors disabled:opacity-60"
            >
              {downloading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {t('certificates', 'downloading')}
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {t('certificates', 'downloadPdf')}
                </>
              )}
            </button>
          ) : (
            <div className="flex items-center justify-center gap-2 py-2 text-xs text-amber-600">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {t('certificates', 'generating')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CertificatesPage() {
  const { user } = useAppSelector((s) => s.auth);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // polling: if any cert has no pdf_url yet, keep polling
  const [polling, setPolling] = useState(false);
  const { t } = useTranslation();

  const fetchCerts = useCallback(async () => {
    try {
      const { data } = await apiClient.get('/me/certificates');
      setCertificates(data);
      // If any cert is still pending PDF, start/continue polling
      const hasPending = data.some((c: Certificate) => !c.pdf_url);
      setPolling(hasPending);
      return data;
    } catch (err) {
      console.error('Failed to fetch certificates', err);
      return [];
    }
  }, []);

  // Initial load
  useEffect(() => {
    if (!user || user.role === 'teacher') {
      setIsLoading(false);
      return;
    }
    fetchCerts().finally(() => setIsLoading(false));
  }, [user, fetchCerts]);

  // Polling loop — check every 3s if any cert is still being generated
  useEffect(() => {
    if (!polling) return;
    const interval = setInterval(async () => {
      const data = await fetchCerts();
      if (!data.some((c: Certificate) => !c.pdf_url)) {
        clearInterval(interval);
        setPolling(false);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [polling, fetchCerts]);

  if (user?.role === 'teacher') {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('nav', 'certificates')}</h1>
        </header>
        <div className="text-center py-20 bg-white rounded-2xl ring-1 ring-slate-200">
          <div className="text-6xl mb-4">🏅</div>
          <h2 className="text-xl font-bold text-slate-800">{t('certificates', 'certsForStudents')}</h2>
          <p className="mt-2 text-slate-500 max-w-sm mx-auto">
            {t('certificates', 'certsForStudentsDesc')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('certificates', 'title') || t('nav', 'certificates')}</h1>
          <p className="mt-1 text-sm text-slate-600">
            {t('certificates', 'downloadEarned')}
          </p>
        </div>
        {polling && (
          <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg ring-1 ring-amber-200">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {t('certificates', 'generatingPlural')}
          </div>
        )}
      </header>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-slate-200 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : certificates.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500">
          <div className="text-5xl mb-4">📜</div>
          <p className="font-medium text-base">{t('certificates', 'noCerts')}</p>
          <p className="text-sm mt-1">{t('certificates', 'complete')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <CertificateCard key={cert.id} cert={cert} />
          ))}
        </div>
      )}
    </div>
  );
}