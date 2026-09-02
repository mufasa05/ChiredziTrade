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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl glass-panel border border-emerald-500/40 p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 rounded-full bg-lowveld-900/80 hover:bg-lowveld-800 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Action Prompt Banner if gated */}
        {authModalPrompt && (
          <div className="mb-4 p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 shrink-0 text-amber-400" />
            <span>{authModalPrompt}</span>
          </div>
        )}

        {/* Title */}
        <div className="text-center mb-6">
          <h3 className="font-display font-black text-2xl text-white tracking-wide">
            Chiredzi<span className="text-emerald-400">Trade</span> Account
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Connect with outgrowers, ranchers & artisans across the Lowveld
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex p-1 rounded-2xl bg-lowveld-950/90 border border-lowveld-800 mb-6">
          <button
            type="button"
            onClick={() => setTab('signup')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              tab === 'signup'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-950'
                : 'text-gray-400 hover:text-white'
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
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-950'
                : 'text-gray-400 hover:text-white'
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
              <label className="block text-gray-300 font-semibold mb-1">
                Full Name / Business Name *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-emerald-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Sekuru Chauke Livestock"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-lowveld-950/90 border border-lowveld-800 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">
                WhatsApp Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 w-4 h-4 text-emerald-400" />
                <input
                  type="tel"
                  required
                  placeholder="+263 77..."
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-lowveld-950/90 border border-lowveld-800 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">
                Email Address <span className="text-gray-500 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-emerald-400" />
                <input
                  type="email"
                  placeholder="trader@chiredzitrade.co.zw"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-lowveld-950/90 border border-lowveld-800 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">
                Primary Trading Location Hub in Chiredzi *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-emerald-400" />
                <select
                  value={locationArea}
                  onChange={(e) => setLocationArea(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-lowveld-950/90 border border-lowveld-800 text-white focus:outline-none focus:border-emerald-400"
                >
                  <option value="Tshovani">Tshovani Township</option>
                  <option value="Chiredzi Light Industry">Chiredzi Light Industrial Area</option>
                  <option value="Triangle Estate">Triangle Estate & Sugar Mill</option>
                  <option value="Hippo Valley">Hippo Valley Estate</option>
                  <option value="Mkwasine">Mkwasine Outgrower Blocks</option>
                  <option value="Buffalo Range">Buffalo Range / Airport</option>
                  <option value="Mwenezi">Mwenezi & Neshuro</option>
                  <option value="Malipati">Malipati Cattle Ranching</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 mt-2 rounded-xl bg-gradient-to-r from-emerald-500 to-lowveld-600 hover:from-emerald-400 hover:to-lowveld-500 text-white font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/80 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Account & Continue</span>
            </button>
          </form>
        ) : (
          /* SIGN IN FORM */
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block text-gray-300 font-semibold mb-1">
                Phone Number OR Email Address *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-emerald-400" />
                <input
                  type="text"
                  required
                  placeholder="+263 77... OR email@domain.com"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-lowveld-950/90 border border-lowveld-800 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed bg-lowveld-950/60 p-3 rounded-xl border border-lowveld-800">
              💡 Zero data friction: Enter your WhatsApp phone number or registered email to sign in. Your orders and barter deals will be associated with your account.
            </p>

            <button
              type="submit"
              className="w-full py-3.5 px-4 mt-2 rounded-xl bg-gradient-to-r from-emerald-500 to-lowveld-600 hover:from-emerald-400 hover:to-lowveld-500 text-white font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/80 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Account</span>
            </button>
          </form>
        )}

        {/* Guest Disclaimer */}
        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={closeAuthModal}
            className="text-xs text-gray-400 hover:text-emerald-300 underline underline-offset-4 transition-colors"
          >
            Continue as Guest (Browse & View Marketplace)
          </button>
        </div>
      </div>
    </div>
  );
}
