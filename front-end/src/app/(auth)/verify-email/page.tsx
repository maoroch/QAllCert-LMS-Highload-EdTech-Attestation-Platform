'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '../../../components/ui/button';
import apiClient from '../../../lib/api/client';

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const urlToken = searchParams.get('token');
  const email = searchParams.get('email');
  
  const [token, setToken] = useState(urlToken || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // Handle automatic verification if token is present in URL on mount
  useEffect(() => {
    if (urlToken) {
      handleVerify(urlToken);
    }
  }, [urlToken]);

  const handleVerify = async (tokenToVerify: string) => {
    if (!tokenToVerify) {
      setError('Verification token is missing');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await apiClient.post('/auth/verify-email', { token: tokenToVerify.trim() });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Verification failed. The code may be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerify(token);
  };

  return (
    <div className="w-full max-w-md space-y-8 z-10 relative bg-white/60 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/20 text-center">
      {loading ? (
        <div className="space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <h2 className="text-xl font-semibold text-slate-700">Verifying your email...</h2>
        </div>
      ) : success ? (
        <div className="space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600 text-3xl font-bold">✓</div>
          <h2 className="text-2xl font-bold text-slate-900">Email Verified!</h2>
          <p className="text-sm text-slate-500">
            Thank you for verifying your email address. You can now access all features.
          </p>
          <Button
            type="button"
            className="w-full"
            size="lg"
            onClick={() => router.push('/login')}
          >
            Sign In
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mx-auto text-indigo-600 text-3xl font-bold">✉</div>
          <h2 className="text-2xl font-bold text-slate-900">Verify Your Email</h2>
          <p className="text-sm text-slate-600">
            {email 
              ? `We sent a 6-digit verification code to ${email}. Please check your inbox and spam folder.`
              : 'Please enter the 6-digit verification code sent to your email.'
            }
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                id="token"
                name="token"
                type="text"
                required
                placeholder="Enter 6-digit code"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full px-4 py-3 text-center text-lg font-bold tracking-widest border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/80"
              />
            </div>
            
            {error && (
              <p className="text-sm text-red-600 font-medium">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={!token}
            >
              Verify Code
            </Button>
          </form>

          <div className="text-sm pt-2">
            <button
              onClick={() => router.push('/login')}
              className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[120px] pointer-events-none" />

      <Suspense fallback={
        <div className="w-full max-w-md p-8 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/20 text-center text-slate-500">
          Loading...
        </div>
      }>
        <VerifyEmailForm />
      </Suspense>
    </div>
  );
}
