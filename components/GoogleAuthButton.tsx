'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight } from 'lucide-react';

interface GoogleAuthButtonProps {
  onSuccess?: () => void;
  className?: string;
}

function parseGoogleJwt(token: string): {
  email?: string;
  name?: string;
  picture?: string;
  sub?: string;
} | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

declare global {
  interface Window {
    google?: any;
  }
}

export default function GoogleAuthButton({ onSuccess, className = '' }: GoogleAuthButtonProps) {
  const { signInWithGoogle } = useAuth();
  const googleBtnRef = useRef<HTMLDivElement>(null);
  const [googleClientReady, setGoogleClientReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showInlineEmail, setShowInlineEmail] = useState(false);
  const [customEmail, setCustomEmail] = useState('');

  const rawClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
  const clientId =
    rawClientId && !rawClientId.includes('your_google_oauth')
      ? rawClientId.trim()
      : '958601671484-rroigsbk2memmmbihn6o9kfldqu8smu7.apps.googleusercontent.com';

  useEffect(() => {
    const existingScript = document.getElementById('google-gsi-client');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'google-gsi-client';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => initGoogleIdentity();
      document.body.appendChild(script);
    } else if (window.google?.accounts?.id) {
      initGoogleIdentity();
    }

    function initGoogleIdentity() {
      if (!window.google?.accounts?.id || !clientId || clientId.includes('your_google_oauth')) {
        return;
      }

      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: { credential: string }) => {
            if (response.credential) {
              const decoded = parseGoogleJwt(response.credential);
              if (decoded && decoded.email) {
                signInWithGoogle({
                  email: decoded.email,
                  name: decoded.name || decoded.email.split('@')[0],
                  avatarUrl: decoded.picture,
                });
                if (onSuccess) onSuccess();
              }
            }
          },
        });

        if (googleBtnRef.current) {
          window.google.accounts.id.renderButton(googleBtnRef.current, {
            theme: 'outline',
            size: 'large',
            type: 'standard',
            shape: 'pill',
            text: 'continue_with',
            logo_alignment: 'left',
            width: googleBtnRef.current.clientWidth || 320,
          });
        }

        setGoogleClientReady(true);
      } catch (err) {
        console.warn('Google GSI notice:', err);
      }
    }
  }, [clientId]);

  const handleButtonClick = () => {
    // If real Google Client ID is configured and GSI ready, trigger prompt
    if (clientId && !clientId.includes('your_google_oauth') && window.google?.accounts?.id) {
      try {
        setLoading(true);
        window.google.accounts.id.prompt((notification: any) => {
          setLoading(false);
        });
        return;
      } catch (e) {
        setLoading(false);
      }
    }

    // Toggle clean inline input right below the button (no popup, no modal stacking)
    setShowInlineEmail((prev) => !prev);
  };

  const handleManualGoogleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim() || !customEmail.includes('@')) {
      alert('Please enter a valid Google account email address.');
      return;
    }

    const email = customEmail.trim().toLowerCase();
    const name = email.split('@')[0].replace(/[._]/g, ' ');

    signInWithGoogle({
      email,
      name,
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
    });

    setShowInlineEmail(false);
    if (onSuccess) onSuccess();
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Official GSI rendered button if clientId is valid */}
      {clientId && !clientId.includes('your_google_oauth') && (
        <div ref={googleBtnRef} className="w-full flex justify-center mb-1" />
      )}

      {/* Clean Google OAuth Button */}
      {(!clientId || clientId.includes('your_google_oauth') || !googleClientReady) && (
        <button
          type="button"
          onClick={handleButtonClick}
          disabled={loading}
          className="w-full py-3 px-4 rounded-2xl bg-white dark:bg-[#15231c] hover:bg-slate-50 dark:hover:bg-[#1a2d24] text-slate-800 dark:text-gray-100 border border-slate-300 dark:border-emerald-500/30 font-bold text-xs sm:text-sm flex items-center justify-center gap-3 shadow-xs hover:shadow-md transition-all active:scale-[0.99]"
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{loading ? 'Connecting...' : 'Continue with Google'}</span>
        </button>
      )}

      {/* Clean Inline Input - NEVER a modal! Strictly inline within the flow */}
      {showInlineEmail && (
        <form
          onSubmit={handleManualGoogleAuth}
          className="mt-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-lowveld-950/90 border border-slate-200 dark:border-emerald-500/30 space-y-2 animate-fade-in"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-700 dark:text-emerald-400">
              Enter Google Account Email
            </span>
            <button
              type="button"
              onClick={() => setShowInlineEmail(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-gray-200 text-xs px-1"
            >
              ✕
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="email"
              required
              placeholder="name@gmail.com"
              value={customEmail}
              onChange={(e) => setCustomEmail(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-lowveld-900 border border-slate-300 dark:border-lowveld-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              autoFocus
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all shrink-0 flex items-center gap-1"
            >
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
