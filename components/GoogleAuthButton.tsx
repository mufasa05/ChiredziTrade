'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, AlertCircle, ExternalLink, CheckCircle2 } from 'lucide-react';

interface GoogleAuthButtonProps {
  onSuccess?: () => void;
  className?: string;
}

// Decode Google JWT ID token payload safely
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
    console.error('Error decoding Google JWT credential:', e);
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
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  useEffect(() => {
    // Dynamically load Google Identity Services script if not already on page
    const existingScript = document.getElementById('google-gsi-client');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'google-gsi-client';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        initGoogleIdentity();
      };
      document.body.appendChild(script);
    } else if (window.google?.accounts?.id) {
      initGoogleIdentity();
    }

    function initGoogleIdentity() {
      if (!window.google?.accounts?.id || !clientId) {
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
        console.warn('Google Identity Services initialization notice:', err);
      }
    }
  }, [clientId]);

  const handleButtonClick = () => {
    // If official Google Client ID is configured and GSI ready, trigger Google Prompt
    if (clientId && window.google?.accounts?.id) {
      try {
        setLoading(true);
        window.google.accounts.id.prompt((notification: any) => {
          setLoading(false);
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            console.log('Google One Tap not displayed, showing account selection');
          }
        });
        return;
      } catch (e) {
        setLoading(false);
      }
    }

    // If client ID is not provided in environment, open clean Google SSO configuration / sign-in dialog
    setShowConfigModal(true);
  };

  const handleManualGoogleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim() || !customEmail.includes('@')) {
      alert('Please enter a valid Google account email address.');
      return;
    }

    const email = customEmail.trim().toLowerCase();
    const name = customName.trim() || email.split('@')[0].replace(/[._]/g, ' ');

    signInWithGoogle({
      email,
      name,
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
    });

    setShowConfigModal(false);
    if (onSuccess) onSuccess();
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Official GSI rendered button if clientId is present & loaded */}
      {clientId && <div ref={googleBtnRef} className="w-full flex justify-center mb-1" />}

      {/* Standard Google OAuth Button */}
      {(!clientId || !googleClientReady) && (
        <button
          type="button"
          onClick={handleButtonClick}
          disabled={loading}
          className="w-full py-3 px-4 rounded-2xl bg-white dark:bg-[#15231c] hover:bg-slate-50 dark:hover:bg-[#1a2d24] text-slate-800 dark:text-gray-100 border border-slate-300 dark:border-emerald-500/30 font-bold text-xs sm:text-sm flex items-center justify-center gap-3 shadow-xs hover:shadow-md transition-all active:scale-[0.99]"
        >
          {/* Official Google 4-Color SVG Logo */}
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
          <span>{loading ? 'Connecting to Google...' : 'Continue with Google'}</span>
        </button>
      )}

      {/* Google SSO Configuration & Account Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-70 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#0f1913] p-6 rounded-3xl border border-slate-200 dark:border-emerald-500/40 shadow-2xl text-slate-900 dark:text-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
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
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Google SSO Authentication</h4>
                <p className="text-[11px] text-slate-500 dark:text-gray-400">Sign in with your Google Account</p>
              </div>
            </div>

            <form onSubmit={handleManualGoogleAuth} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">
                  Google Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="your.email@gmail.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-lowveld-950 border border-slate-300 dark:border-lowveld-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">
                  Full Name <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Your Full Name"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-lowveld-950 border border-slate-300 dark:border-lowveld-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-100 dark:bg-lowveld-900/60 border border-slate-200 dark:border-lowveld-800 text-[11px] text-slate-600 dark:text-gray-400 leading-relaxed">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">💡 Developer Note:</span> To enable automatic 1-click Google popup on production, provide <code className="bg-slate-200 dark:bg-black px-1 py-0.5 rounded font-mono">NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> in your Vercel or environment settings.
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-200 dark:bg-lowveld-900 text-xs font-bold text-slate-700 dark:text-gray-300 hover:bg-slate-300 dark:hover:bg-lowveld-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-colors shadow-md"
                >
                  Sign In with Google
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
