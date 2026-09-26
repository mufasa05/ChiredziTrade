'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { X, User, Phone, Mail, MapPin, Lock, LogIn, UserPlus, ShieldCheck } from 'lucide-react';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalPrompt, login } = useAuth();
  const { language } = useLanguage();
  const [tab, setTab] = useState<'login' | 'signup'>('signup');

  // Sign In Form state
  const [loginIdentifier, setLoginIdentifier] = useState('');

  // Sign Up Form state
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+263 ');
  const [email, setEmail] = useState('');
  const [locationArea, setLocationArea] = useState('Tshovani');

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim()) return;

    // Detect if phone or email
    const isEmail = loginIdentifier.includes('@');
    const nameFromId = isEmail
      ? loginIdentifier.split('@')[0].replace('.', ' ')
      : `Trader ${loginIdentifier.slice(-4)}`;

    login({
      fullName: nameFromId,
      phoneNumber: isEmail ? '+263772000000' : loginIdentifier,
      email: isEmail ? loginIdentifier : '',
      locationArea: 'Tshovani',
    });
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phoneNumber.trim()) return;

    login({
      fullName,
      phoneNumber,
      email,
      locationArea,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-[#0f1913] border border-slate-200 dark:border-emerald-500/40 p-6 sm:p-8 shadow-2xl overflow-hidden text-slate-900 dark:text-gray-100 transition-colors duration-300">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-lowveld-900/80 hover:bg-slate-200 dark:hover:bg-lowveld-800 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Action Prompt Banner if gated */}
        {authModalPrompt && (
          <div className="mb-4 p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>{authModalPrompt}</span>
          </div>
        )}

        {/* Title */}
        <div className="text-center mb-6">
          <h3 className="font-display font-black text-2xl text-slate-900 dark:text-white tracking-wide">
            Zim<span className="text-emerald-600 dark:text-emerald-400">Barter</span> Account
          </h3>
          <p className="text-xs text-slate-600 dark:text-gray-400 mt-1">
            Connect with traders, farmers, wholesalers & artisans across Zimbabwe
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-lowveld-950/90 border border-slate-200 dark:border-lowveld-800 mb-6">
          <button
            type="button"
            onClick={() => setTab('signup')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              tab === 'signup'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Account</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('login')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              tab === 'login'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>
        </div>

        {/* SIGN UP FORM */}
        {tab === 'signup' ? (
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
                  placeholder="e.g. Sekuru Chauke Livestock"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-lowveld-950/90 border border-slate-300 dark:border-lowveld-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-emerald-500"
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
                  placeholder="+263 77..."
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-lowveld-950/90 border border-slate-300 dark:border-lowveld-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-gray-300 font-semibold mb-1">
                Email Address <span className="text-slate-400 dark:text-gray-500 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <input
                  type="email"
                  placeholder="trader@chiredzitrade.co.zw"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-lowveld-950/90 border border-slate-300 dark:border-lowveld-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-gray-300 font-semibold mb-1">
                Primary Trading Location Hub in Zimbabwe *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <select
                  value={locationArea}
                  onChange={(e) => setLocationArea(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-lowveld-950/90 border border-slate-300 dark:border-lowveld-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
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
              className="w-full py-3.5 px-4 mt-2 rounded-xl bg-gradient-to-r from-emerald-500 to-lowveld-600 hover:from-emerald-400 hover:to-lowveld-500 text-white font-black flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <UserPlus className="w-4 h-4 text-white" />
              <span>Create Account & Continue</span>
            </button>
          </form>
        ) : (
          /* SIGN IN FORM */
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block text-slate-700 dark:text-gray-300 font-semibold mb-1">
                Phone Number OR Email Address *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <input
                  type="text"
                  required
                  placeholder="+263 77... OR email@domain.com"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-lowveld-950/90 border border-slate-300 dark:border-lowveld-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed bg-slate-100 dark:bg-lowveld-950/60 p-3 rounded-xl border border-slate-200 dark:border-lowveld-800">
              💡 Zero data friction: Enter your WhatsApp phone number or registered email to sign in. Your orders and barter deals will be associated with your account.
            </p>

            <button
              type="submit"
              className="w-full py-3.5 px-4 mt-2 rounded-xl bg-gradient-to-r from-emerald-500 to-lowveld-600 hover:from-emerald-400 hover:to-lowveld-500 text-white font-black flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <LogIn className="w-4 h-4 text-white" />
              <span>Sign In to Account</span>
            </button>
          </form>
        )}

        {/* Guest Disclaimer */}
        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={closeAuthModal}
            className="text-xs text-slate-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-300 underline underline-offset-4 transition-colors"
          >
            Continue as Guest (Browse & View Marketplace)
          </button>
        </div>
      </div>
    </div>
  );
}
