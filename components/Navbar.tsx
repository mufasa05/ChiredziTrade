'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Tractor, 
  MessageCircle, 
  PlusCircle, 
  RefreshCw, 
  Globe,
  ChevronDown
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Language } from '@/lib/i18n';
import { LogIn, LogOut, UserCheck } from 'lucide-react';

interface NavbarProps {
  onOpenWhatsApp?: () => void;
}

export default function Navbar({ onOpenWhatsApp }: NavbarProps) {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'sn', label: 'chiShona', flag: '🇿🇼' },
    { code: 'nd', label: 'isiNdebele', flag: '🇿🇼' },
    { code: 'ts', label: 'Xhangane (Shangani)', flag: '🇿🇼' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-lowveld-800/60 bg-[#070d09]/95 backdrop-blur-md shadow-xl">
      {/* Micro Ticker */}
      <div className="hidden sm:flex items-center justify-between px-4 sm:px-8 py-1 bg-lowveld-950/80 border-b border-lowveld-900/50 text-[11px] text-gray-300">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {t.liveMarket}
          </span>
          <span className="text-gray-400">📍 Chiredzi • Hippo Valley • Triangle • Mkwasine • Mwenezi</span>
        </div>
        <div className="flex items-center gap-4 font-mono text-gray-300">
          <span>💵 {t.multiCurrencyHeader}</span>
          <span className="text-emerald-400/80">Sugarcane Harvest Season Active 🚜</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-lowveld-700 flex items-center justify-center text-white shadow-lg shadow-emerald-900/40 group-hover:scale-105 transition-transform">
            <Tractor className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-extrabold text-xl sm:text-2xl tracking-tight text-white">
                Chiredzi<span className="text-emerald-400">Trade</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                PWA
              </span>
            </div>
            <p className="text-[10px] text-gray-400 tracking-wide font-medium hidden sm:block">
              {t.brandSubtitle}
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              pathname === '/' 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                : 'text-gray-300 hover:text-white hover:bg-lowveld-900/50'
            }`}
          >
            {t.marketplace}
          </Link>
          <Link
            href="/barter-network"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              pathname === '/barter-network'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-gray-300 hover:text-white hover:bg-lowveld-900/50'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.smartBarterHub}</span>
          </Link>
          <Link
            href="/whatsapp-bot"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              pathname === '/whatsapp-bot'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-gray-300 hover:text-white hover:bg-lowveld-900/50'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.whatsAppEngine}</span>
          </Link>
        </nav>

        {/* Right Actions & Language Switcher */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Quadrilingual Language Selector (EN, SN, ND, TS) */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl bg-lowveld-950/80 hover:bg-lowveld-900 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{languages.find((l) => l.code === language)?.flag}</span>
              <span className="uppercase text-[11px]">{language}</span>
              <ChevronDown className="w-3 h-3 opacity-70 shrink-0" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-2xl glass-panel border border-emerald-500/40 p-1.5 shadow-2xl z-50 animate-fade-in">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      language === lang.code
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'text-gray-300 hover:bg-lowveld-900 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </span>
                    {language === lang.code && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* WhatsApp Simulator Launch Button */}
          <button
            onClick={onOpenWhatsApp}
            className="flex items-center justify-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#005c4b]/80 hover:bg-[#005c4b] text-emerald-100 border border-emerald-500/30 transition-all hover:scale-[1.02] shadow-sm shadow-emerald-950"
            title="Open WhatsApp Simulator"
          >
            <MessageCircle className="w-4 h-4 text-emerald-300 animate-pulse shrink-0" />
            <span className="hidden md:inline">{t.tryWhatsAppBot}</span>
          </button>

          {/* USER AUTH ACCOUNT CONTROL */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-200 text-xs font-bold transition-all"
              >
                <div className="w-6 h-6 sm:w-5 sm:h-5 rounded-full bg-emerald-500 text-white text-[11px] font-black flex items-center justify-center shrink-0">
                  {user.fullName.charAt(0)}
                </div>
                <span className="hidden sm:inline max-w-[80px] md:max-w-[100px] truncate">{user.fullName}</span>
                <ChevronDown className="w-3 h-3 opacity-70 hidden sm:inline" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 sm:w-52 rounded-2xl glass-panel border border-emerald-500/40 p-2 shadow-2xl z-50 animate-fade-in text-xs">
                  <div className="px-3 py-2 border-b border-lowveld-800 text-gray-300">
                    <p className="font-bold text-white truncate">{user.fullName}</p>
                    <p className="text-[10px] text-emerald-400 font-mono mt-0.5 pr-1">{user.phoneNumber}</p>
                    <p className="text-[10px] text-gray-400">📍 {user.locationArea}</p>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 mt-1 rounded-xl text-red-400 hover:bg-red-500/10 font-bold transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => openAuthModal()}
              className="flex items-center justify-center gap-1 px-2 py-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-lowveld-950 hover:bg-lowveld-900 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all"
              title="Sign In / Register"
            >
              <LogIn className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}

          {/* Post Listing CTA */}
          <button
            onClick={() => {
              if (!isAuthenticated) {
                openAuthModal('Please sign in or create an account to post a listing.');
              } else {
                window.location.href = '/post';
              }
            }}
            className="flex items-center justify-center gap-1 p-2 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-500 to-lowveld-600 hover:from-emerald-400 hover:to-lowveld-500 text-white shadow-lg shadow-emerald-900/30 transition-all hover:scale-[1.02]"
            title="Post a Listing"
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            <span className="hidden md:inline">{t.postListing}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
