'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AuthPanel from './AuthPanel';
import { X, ShieldCheck } from 'lucide-react';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalPrompt, needsProfile } = useAuth();
  const pathname = usePathname();

  if (!isAuthModalOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Sign in to ZimBarter"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#0d1612] border border-slate-200 dark:border-emerald-500/30 p-6 sm:p-8 shadow-2xl overflow-hidden text-slate-900 dark:text-gray-100 transition-all">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-500 rounded-b-full" />

        {!needsProfile && (
          <button
            id="auth-modal-close"
            onClick={closeAuthModal}
            className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-lowveld-900/80 hover:bg-slate-200 dark:hover:bg-lowveld-800 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            aria-label="Close sign-in window"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {authModalPrompt && !needsProfile && (
          <div className="mb-5 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400" />
            <span className="font-medium">{authModalPrompt}</span>
          </div>
        )}

        <AuthPanel redirectPath={pathname || '/'} onDone={closeAuthModal} />

        {!needsProfile && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={closeAuthModal}
              className="text-xs text-slate-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-300 underline underline-offset-4 transition-colors"
            >
              Continue as Guest (Browse Marketplace Only)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
