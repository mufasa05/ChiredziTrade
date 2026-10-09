'use client';

import React, { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import AuthPanel from '@/components/AuthPanel';
import { useAuth } from '@/context/AuthContext';
import { AlertTriangle } from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, needsProfile, authLoading } = useAuth();
  const callbackError = searchParams.get('error');

  // Fully signed in with a complete profile → go to the marketplace
  useEffect(() => {
    if (!authLoading && user && !needsProfile) {
      router.replace('/');
    }
  }, [authLoading, user, needsProfile, router]);

  return (
    <main className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070d09] text-slate-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar />
      <h1 className="sr-only">Sign in to ZimBarter</h1>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-lg bg-white dark:bg-[#0d1612] border border-slate-200 dark:border-emerald-500/30 p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-500" />

          {callbackError && (
            <div className="mb-5 p-3 rounded-xl text-xs flex items-center justify-between gap-2.5 border bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span className="font-semibold">
                  {callbackError === 'auth_callback_failed'
                    ? 'Previous sign-in session expired. Please tap the button below to sign in.'
                    : decodeURIComponent(callbackError)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => router.replace('/login')}
                className="text-xs font-bold hover:underline opacity-80 hover:opacity-100"
              >
                Dismiss
              </button>
            </div>
          )}

          <AuthPanel redirectPath="/" onDone={() => router.replace('/')} />

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-xs text-slate-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors"
            >
              ← Return to Marketplace Feed
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
