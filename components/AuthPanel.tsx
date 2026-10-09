'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import GoogleAuthButton from './GoogleAuthButton';
import {
  Mail,
  Phone,
  User,
  MapPin,
  KeyRound,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Globe,
} from 'lucide-react';

const LOCATIONS = [
  'Harare CBD',
  'Harare - Borrowdale',
  'Harare - Avondale',
  'Harare - Mbare / Machipisa',
  'Bulawayo CBD',
  'Bulawayo - Hillside',
  'Mutare',
  'Masvingo',
  'Gweru',
  'Chiredzi / Triangle',
  'Kwekwe',
  'Chinhoyi',
  'Bindura',
  'Marondera',
  'Victoria Falls',
  'Beitbridge',
  'Zvishavane',
  'Kadoma',
  'Gwanda',
  'Chipinge',
];

type Feedback = { type: 'error' | 'success'; message: string } | null;

const inputCls =
  'w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-lowveld-950/90 border border-slate-300 dark:border-lowveld-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors';
const primaryBtnCls =
  'w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed';

interface AuthPanelProps {
  /** Path to return to after OAuth / magic-link redirects */
  redirectPath?: string;
  onDone?: () => void;
}

export default function AuthPanel({ redirectPath, onDone }: AuthPanelProps) {
  const { user, needsProfile, sendEmailOtp, verifyEmailOtp, saveProfile } = useAuth();

  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+263 ');
  const [locationArea, setLocationArea] = useState('Harare CBD');

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setFeedback(null);
    const res = await sendEmailOtp(email, redirectPath);
    setBusy(false);
    if (res.success) {
      setStep('code');
      setFeedback({ type: 'success', message: res.message || 'Code sent.' });
    } else {
      setFeedback({ type: 'error', message: res.message || 'Could not send code.' });
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setFeedback(null);
    const res = await verifyEmailOtp(email, code);
    setBusy(false);
    if (!res.success) {
      setFeedback({ type: 'error', message: res.message || 'Verification failed.' });
    }
    // On success, AuthContext picks up the session; the profile step (or onDone) follows.
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setFeedback(null);
    const res = await saveProfile({ fullName: fullName || user?.fullName || '', phoneNumber, locationArea });
    setBusy(false);
    if (res.success) {
      setFeedback({ type: 'success', message: res.message || 'Saved.' });
      onDone?.();
    } else {
      setFeedback({ type: 'error', message: res.message || 'Could not save profile.' });
    }
  };

  const FeedbackBox = feedback && (
    <div
      className={`mb-5 p-3.5 rounded-2xl text-xs flex items-start gap-3 border ${
        feedback.type === 'error'
          ? 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300'
          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
      }`}
    >
      {feedback.type === 'error' ? (
        <AlertTriangle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
      ) : (
        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />
      )}
      <span className="font-medium leading-relaxed">{feedback.message}</span>
    </div>
  );

  const Header = ({ title, subtitle }: { title: React.ReactNode; subtitle: string }) => (
    <div className="text-center mb-6">
      <div className="inline-flex items-center justify-center p-2 px-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs mb-2 gap-1.5">
        <Globe className="w-3.5 h-3.5" />
        <span>Zimbabwe Trade &amp; Barter Network</span>
      </div>
      <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">{title}</h2>
      <p className="text-xs text-slate-600 dark:text-gray-400 mt-1">{subtitle}</p>
    </div>
  );

  // STEP 3: Signed in but profile incomplete
  if (needsProfile) {
    return (
      <div>
        <Header
          title={<>Complete your <span className="text-emerald-600 dark:text-emerald-400">profile</span></>}
          subtitle={`Signed in as ${user?.email}. Buyers will contact you on this WhatsApp number.`}
        />
        {FeedbackBox}
        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label htmlFor="profile-name" className="block text-slate-700 dark:text-gray-300 font-semibold mb-1">
              Full Name / Business Name *
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <input
                id="profile-name"
                type="text"
                required
                minLength={2}
                placeholder="e.g. Tendai Moyo Traders"
                value={fullName || user?.fullName || ''}
                onChange={(e) => setFullName(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>
          <div>
            <label htmlFor="profile-phone" className="block text-slate-700 dark:text-gray-300 font-semibold mb-1">
              WhatsApp Phone Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3 w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <input
                id="profile-phone"
                type="tel"
                required
                placeholder="+263 77 123 4567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className={`${inputCls} font-mono`}
              />
            </div>
          </div>
          <div>
            <label htmlFor="profile-location" className="block text-slate-700 dark:text-gray-300 font-semibold mb-1">
              Primary Trading Hub *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <select
                id="profile-location"
                value={locationArea}
                onChange={(e) => setLocationArea(e.target.value)}
                className={inputCls}
              >
                {LOCATIONS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>
          <button id="profile-save-btn" type="submit" disabled={busy} className={primaryBtnCls}>
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>Save &amp; Start Trading</span>
          </button>
        </form>
      </div>
    );
  }

  // Already fully signed in
  if (user) {
    return (
      <div className="text-center py-6">
        <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
        <p className="font-bold text-slate-900 dark:text-white">Signed in as {user.fullName}</p>
        <p className="text-xs text-slate-500 dark:text-gray-400">{user.email}</p>
      </div>
    );
  }

  return (
    <div>
      <Header
        title={<>Zim<span className="text-emerald-600 dark:text-emerald-400">Barter</span> Portal</>}
        subtitle="Sign in or create an account — no password needed"
      />

      <div className="mb-5">
        <GoogleAuthButton redirectPath={redirectPath} />
      </div>

      <div className="relative flex items-center justify-center mb-5">
        <div className="grow border-t border-slate-200 dark:border-lowveld-800" />
        <span className="shrink-0 px-3 text-[10px] font-black tracking-wider text-slate-400 dark:text-gray-500 uppercase">
          Or continue with email
        </span>
        <div className="grow border-t border-slate-200 dark:border-lowveld-800" />
      </div>

      {FeedbackBox}

      {step === 'email' ? (
        <form onSubmit={handleSendCode} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label htmlFor="auth-email" className="block text-slate-700 dark:text-gray-300 font-semibold mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <input
                id="auth-email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>
          <button id="auth-send-code-btn" type="submit" disabled={busy} className={primaryBtnCls}>
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
            <span>Email me a sign-in code</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label htmlFor="auth-code" className="block text-slate-700 dark:text-gray-300 font-semibold mb-1">
              Code sent to {email}
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <input
                id="auth-code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                pattern="\d{6,10}"
                maxLength={10}
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                className={`${inputCls} font-mono tracking-[0.4em] text-center`}
                autoFocus
              />
            </div>
            <p className="mt-1.5 text-[11px] text-slate-500 dark:text-gray-400">
              You can also just tap the link in the email.
            </p>
          </div>
          <button id="auth-verify-btn" type="submit" disabled={busy} className={primaryBtnCls}>
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
            <span>Verify &amp; Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => { setStep('email'); setCode(''); setFeedback(null); }}
            className="w-full text-xs text-slate-500 dark:text-gray-400 hover:text-emerald-600 flex items-center justify-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Use a different email
          </button>
        </form>
      )}
    </div>
  );
}
