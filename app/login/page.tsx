'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import GoogleAuthButton from '@/components/GoogleAuthButton';
import { useAuth } from '@/context/AuthContext';
import { 
  Lock, 
  Phone, 
  User, 
  Mail, 
  MapPin, 
  LogIn, 
  UserPlus, 
  ShieldCheck, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  Globe 
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { user, isAuthenticated, attemptSignIn, registerUser } = useAuth();
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success' | 'warning' | 'info'; message: string } | null>(null);

  // Login form state
  const [identifier, setIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+263 ');
  const [email, setEmail] = useState('');
  const [locationArea, setLocationArea] = useState('Harare CBD');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!identifier.trim()) {
      setFeedback({ type: 'error', message: 'Please enter your phone number or email address.' });
      return;
    }

    const result = attemptSignIn(identifier.trim());
    if (!result.success) {
      setFeedback({ type: 'warning', message: result.message || 'Account not found. Please create an account.' });
      setTimeout(() => setTab('signup'), 1200);
    } else {
      setFeedback({ type: 'success', message: 'Signed in successfully! Redirecting...' });
      setTimeout(() => router.push('/'), 800);
    }
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!fullName.trim() || !phoneNumber.trim()) {
      setFeedback({ type: 'error', message: 'Please enter your full name and WhatsApp phone number.' });
      return;
    }

    const result = registerUser({
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      email: email.trim(),
      locationArea,
    });

    if (result.success) {
      setFeedback({ type: 'success', message: 'Account created successfully! Welcome to ZimBarter.' });
      setTimeout(() => router.push('/'), 800);
    } else {
      setFeedback({ type: 'error', message: result.message || 'Registration failed.' });
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070d09] text-slate-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-lg bg-white dark:bg-[#0d1612] border border-slate-200 dark:border-emerald-500/30 p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          {/* Accent top stripe */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-500"></div>

          {/* Heading */}
          <div className="text-center mb-6 pt-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs mb-2">
              <Globe className="w-3.5 h-3.5" />
              <span>Zimbabwe Trade & Barter Network</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white">
              Zim<span className="text-emerald-600 dark:text-emerald-400">Barter</span> Portal
            </h1>
            <p className="text-xs text-slate-600 dark:text-gray-400 mt-1">
              Sign in to manage your listings, submit barter swaps, and make cash trade orders.
            </p>
          </div>

          {/* Real Google SSO Button */}
          <div className="mb-5">
            <GoogleAuthButton onSuccess={() => router.push('/')} />
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center mb-5">
            <div className="grow border-t border-slate-200 dark:border-lowveld-800"></div>
            <span className="shrink-0 px-3 text-[10px] font-black tracking-wider text-slate-400 dark:text-gray-500 uppercase">
              Or use Phone / Email
            </span>
            <div className="grow border-t border-slate-200 dark:border-lowveld-800"></div>
          </div>

          {/* Tab Switcher */}
          <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-lowveld-950/90 border border-slate-200 dark:border-lowveld-800 mb-5">
            <button
              type="button"
              onClick={() => { setTab('login'); setFeedback(null); }}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                tab === 'login'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => { setTab('signup'); setFeedback(null); }}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                tab === 'signup'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Account</span>
            </button>
          </div>

          {/* Feedback Notice */}
          {feedback && (
            <div
              className={`mb-5 p-3 rounded-xl text-xs flex items-center gap-2.5 border ${
                feedback.type === 'error'
                  ? 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400'
                  : feedback.type === 'warning'
                  ? 'bg-amber-500/15 border-amber-500/30 text-amber-800 dark:text-amber-200'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
              }`}
            >
              {feedback.type === 'error' || feedback.type === 'warning' ? (
                <AlertTriangle className="w-4 h-4 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              )}
              <span className="font-semibold">{feedback.message}</span>
            </div>
          )}

          {/* Tab 1: Sign In */}
          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-gray-300 mb-1">
                  WhatsApp Phone Number or Email *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <input
                    type="text"
                    required
                    placeholder="+263 783 237 918 OR trader@domain.co.zw"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-lowveld-950/90 border border-slate-300 dark:border-lowveld-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 mt-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In to ZimBarter</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* Tab 2: Create Account */
            <form onSubmit={handleSignUpSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-gray-300 mb-1">
                  Full Name / Business Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tendai Moyo Traders"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-lowveld-950/90 border border-slate-300 dark:border-lowveld-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-gray-300 mb-1">
                  WhatsApp Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <input
                    type="tel"
                    required
                    placeholder="+263 77 123 4567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-lowveld-950/90 border border-slate-300 dark:border-lowveld-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-gray-300 mb-1">
                  Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <input
                    type="email"
                    placeholder="trader@zimbarter.co.zw"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-lowveld-950/90 border border-slate-300 dark:border-lowveld-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-gray-300 mb-1">
                  Primary Trading Location *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <select
                    value={locationArea}
                    onChange={(e) => setLocationArea(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-lowveld-950/90 border border-slate-300 dark:border-lowveld-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Harare CBD">Harare CBD</option>
                    <option value="Harare - Borrowdale">Harare - Borrowdale</option>
                    <option value="Bulawayo CBD">Bulawayo CBD</option>
                    <option value="Mutare">Mutare</option>
                    <option value="Masvingo">Masvingo</option>
                    <option value="Gweru">Gweru</option>
                    <option value="Chiredzi / Triangle">Chiredzi / Triangle</option>
                    <option value="Kwekwe">Kwekwe</option>
                    <option value="Victoria Falls">Victoria Falls</option>
                    <option value="Beitbridge">Beitbridge</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 mt-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Account & Start Trading</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* ADMIN CONSOLE ENTRY BUTTON (PUT ON SIGN IN PAGE AS REQUESTED) */}
          <div className="mt-8 p-4 rounded-2xl bg-purple-500/10 dark:bg-purple-950/40 border border-purple-500/30 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/30">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Platform Administrator?</p>
                <p className="text-[11px] text-slate-500 dark:text-gray-400">Manage listings, moderation & users</p>
              </div>
            </div>
            <Link
              href="/admin"
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all shrink-0 flex items-center gap-1.5"
            >
              <span>Admin Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Back Link */}
          <div className="mt-4 text-center">
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
