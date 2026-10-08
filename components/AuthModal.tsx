'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Lock,
  LogIn,
  UserPlus,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Globe,
} from 'lucide-react';
import GoogleAuthButton from './GoogleAuthButton';

export default function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalPrompt,
    attemptSignIn,
    registerUser,
    signInWithGoogle,
    authModalTab,
    setAuthModalTab,
  } = useAuth();

  const { language } = useLanguage();

  // Alert/Feedback state
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success' | 'warning' | 'info'; message: string } | null>(null);

  // Sign In State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up State
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+263 ');
  const [email, setEmail] = useState('');
  const [locationArea, setLocationArea] = useState('Harare CBD');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  if (!isAuthModalOpen) return null;

  // Handle Sign In Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!loginIdentifier.trim()) {
      setFeedback({ type: 'error', message: 'Please enter your phone number or email address.' });
      return;
    }

    const result = attemptSignIn(loginIdentifier);

    if (!result.success) {
      // User is NOT registered!
      setFeedback({
        type: 'warning',
        message: result.message || 'Account not found. You must create an account first.',
      });

      // Auto-prefill Sign Up fields with their entered identifier & switch tab to Create Account
      const isEmailInput = loginIdentifier.includes('@');
      if (isEmailInput) {
        setEmail(loginIdentifier);
      } else {
        setPhoneNumber(loginIdentifier.startsWith('+') ? loginIdentifier : `+263 ${loginIdentifier}`);
      }

      setTimeout(() => {
        setAuthModalTab('signup');
      }, 1200);
    } else {
      setFeedback({
        type: 'success',
        message: result.message || 'Signed in successfully!',
      });
      setTimeout(() => {
        closeAuthModal();
      }, 800);
    }
  };

  // Handle Sign Up Submit
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!fullName.trim()) {
      setFeedback({ type: 'error', message: 'Please enter your Full Name or Business Name.' });
      return;
    }

    if (!phoneNumber.trim() || phoneNumber.replace(/\D/g, '').length < 6) {
      setFeedback({ type: 'error', message: 'Please enter a valid WhatsApp phone number.' });
      return;
    }

    const result = registerUser({
      fullName,
      phoneNumber,
      email,
      locationArea,
    });

    if (!result.success) {
      setFeedback({
        type: 'info',
        message: result.message || 'An account with these details already exists. Switching to Sign In...',
      });

      setLoginIdentifier(email || phoneNumber);
      setTimeout(() => {
        setAuthModalTab('login');
      }, 1500);
    } else {
      setFeedback({
        type: 'success',
        message: result.message || 'Account created successfully! Welcome to ZimBarter.',
      });
      setTimeout(() => {
        closeAuthModal();
      }, 800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#0d1612] border border-slate-200 dark:border-emerald-500/30 p-6 sm:p-8 shadow-2xl overflow-hidden text-slate-900 dark:text-gray-100 transition-all">

        {/* Ambient Top Glow Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-500 rounded-b-full"></div>

        {/* Close Modal Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-lowveld-900/80 hover:bg-slate-200 dark:hover:bg-lowveld-800 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          title="Close Auth Window"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Action Prompt Banner if opened via gated feature */}
        {authModalPrompt && (
          <div className="mb-5 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-2.5 shadow-xs">
            <ShieldCheck className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400" />
            <span className="font-medium">{authModalPrompt}</span>
          </div>
        )}

        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-2 px-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs mb-2 gap-1.5">
            <Globe className="w-3.5 h-3.5" />
            <span>Zimbabwe Trade & Barter Network</span>
          </div>

          <h3 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
            Zim<span className="text-emerald-600 dark:text-emerald-400">Barter</span> Portal
          </h3>
          <p className="text-xs text-slate-600 dark:text-gray-400 mt-1">
            Access secure trading, cash orders & barter swaps across Zimbabwe
          </p>
        </div>

        {/* Real Google SSO Provider Button */}
        <div className="mb-5">
          <GoogleAuthButton onSuccess={() => closeAuthModal()} />
        </div>

        {/* Divider line */}
        <div className="relative flex items-center justify-center mb-5">
          <div className="grow border-t border-slate-200 dark:border-lowveld-800"></div>
          <span className="shrink-0 px-3 text-[10px] font-black tracking-wider text-slate-400 dark:text-gray-500 uppercase">
            Or use email / WhatsApp phone
          </span>
          <div className="grow border-t border-slate-200 dark:border-lowveld-800"></div>
        </div>

        {/* Dual Tab Switcher: Sign In | Create Account */}
        <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-lowveld-950/90 border border-slate-200 dark:border-lowveld-800 mb-5">
          <button
            type="button"
            onClick={() => {
              setAuthModalTab('login');
              setFeedback(null);
            }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              authModalTab === 'login'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthModalTab('signup');
              setFeedback(null);
            }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all relative ${
              authModalTab === 'signup'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Account</span>
            <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black uppercase tracking-wider">
              New
            </span>
          </button>
        </div>

        {/* Dynamic Alert Feedback Notice */}
        {feedback && (
          <div
            className={`mb-5 p-3.5 rounded-2xl text-xs flex items-start gap-3 animate-fade-in border ${
              feedback.type === 'error'
                ? 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300'
                : feedback.type === 'warning'
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-900 dark:text-amber-200'
                : feedback.type === 'info'
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-800 dark:text-blue-300'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
            }`}
          >
            {feedback.type === 'error' && <AlertTriangle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />}
            {feedback.type === 'warning' && <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />}
            {feedback.type === 'info' && <Sparkles className="w-4 h-4 shrink-0 text-blue-500 mt-0.5" />}
            {feedback.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />}
            <span className="font-medium leading-relaxed">{feedback.message}</span>
          </div>
        )}

        {/* SIGN IN TAB CONTENT */}
        {authModalTab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block text-slate-700 dark:text-gray-300 font-semibold mb-1">
                WhatsApp Phone Number OR Email Address *
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <input
                  type="text"
                  required
                  placeholder="+263 783 237 918 OR trader@domain.co.zw"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-lowveld-950/90 border border-slate-300 dark:border-lowveld-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-slate-700 dark:text-gray-300 font-semibold">
                  Account Password / Security PIN <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-lowveld-950/90 border border-slate-300 dark:border-lowveld-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-gray-200"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 dark:text-gray-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-lowveld-800 bg-slate-100 dark:bg-lowveld-950"
                />
                <span>Remember me on this browser</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 mt-2 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.99]"
            >
              <LogIn className="w-4 h-4 text-white" />
              <span>Sign In to ZimBarter</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* CREATE ACCOUNT TAB CONTENT */
          <form onSubmit={handleSignUpSubmit} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block text-slate-700 dark:text-gray-300 font-semibold mb-1">
                Full Name / Business Name *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Sekuru Chauke Livestock & Grain"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-lowveld-950/90 border border-slate-300 dark:border-lowveld-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-gray-300 font-semibold mb-1">
                WhatsApp Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <input
                  type="tel"
                  required
                  placeholder="+263 783 237 918"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-lowveld-950/90 border border-slate-300 dark:border-lowveld-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-emerald-500 font-mono transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-gray-300 font-semibold mb-1">
                Email Address <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <input
                  type="email"
                  placeholder="trader@zimbarter.co.zw"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-lowveld-950/90 border border-slate-300 dark:border-lowveld-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-gray-300 font-semibold mb-1">
                Primary Trading Hub in Zimbabwe *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <select
                  value={locationArea}
                  onChange={(e) => setLocationArea(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-lowveld-950/90 border border-slate-300 dark:border-lowveld-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="Harare CBD">Harare CBD</option>
                  <option value="Harare - Borrowdale">Harare - Borrowdale</option>
                  <option value="Bulawayo CBD">Bulawayo CBD</option>
                  <option value="Mutare">Mutare</option>
                  <option value="Masvingo">Masvingo</option>
                  <option value="Gweru">Gweru</option>
                  <option value="Chiredzi / Triangle">Chiredzi / Triangle</option>
                  <option value="Kwekwe">Kwekwe</option>
                  <option value="Chinhoyi">Chinhoyi</option>
                  <option value="Bindura">Bindura</option>
                  <option value="Marondera">Marondera</option>
                  <option value="Victoria Falls">Victoria Falls</option>
                  <option value="Beitbridge">Beitbridge</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 mt-2 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.99]"
            >
              <UserPlus className="w-4 h-4 text-white" />
              <span>Create Account & Start Trading</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Admin Console Access Banner */}
        <div className="mt-6 p-4 rounded-2xl bg-purple-500/10 dark:bg-purple-950/40 border border-purple-500/30 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Platform Administrator?</p>
              <p className="text-[11px] text-slate-500 dark:text-gray-400">Manage listings, users & platform activity</p>
            </div>
          </div>
          <a
            href="/admin"
            onClick={closeAuthModal}
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all shrink-0 flex items-center gap-1.5"
          >
            <span>Admin Console</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Guest Disclaimer */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={closeAuthModal}
            className="text-xs text-slate-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-300 underline underline-offset-4 transition-colors"
          >
            Continue as Guest (Browse Marketplace Only)
          </button>
        </div>

      </div>
    </div>
  );
}
