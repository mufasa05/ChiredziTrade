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
  ChevronDown,
  LogIn,
  LogOut,
  Menu,
  X,
  User,
  ShoppingBag,
  Sun,
  Moon
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Language } from '@/lib/i18n';

interface NavbarProps {
  onOpenWhatsApp?: () => void;
}

export default function Navbar({ onOpenWhatsApp }: NavbarProps) {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Logo (Responsive Compact for Mobile) */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-lowveld-700 flex items-center justify-center text-white shadow-lg shadow-emerald-900/40 group-hover:scale-105 transition-transform">
            <Tractor className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="flex items-center gap-1">
            <span className="font-display font-extrabold text-base sm:text-2xl tracking-tight text-white">
              Chiredzi<span className="text-emerald-400">Trade</span>
            </span>
            <span className="hidden sm:inline-block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              PWA
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
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

        {/* Desktop Right Actions */}
        <div className="hidden sm:flex items-center gap-2">
          {/* Theme Switcher Toggle (Dark / Light) */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-lowveld-950/80 hover:bg-lowveld-900 border border-emerald-500/30 text-emerald-300 transition-all"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-emerald-400" />
            )}
          </button>

          {/* Quadrilingual Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-lowveld-950/80 hover:bg-lowveld-900 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all"
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
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#005c4b]/80 hover:bg-[#005c4b] text-emerald-100 border border-emerald-500/30 transition-all shadow-sm shadow-emerald-950"
          >
            <MessageCircle className="w-4 h-4 text-emerald-300 animate-pulse shrink-0" />
            <span className="hidden md:inline">{t.tryWhatsAppBot}</span>
          </button>

          {/* USER AUTH ACCOUNT CONTROL */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-200 text-xs font-bold transition-all"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[11px] font-black flex items-center justify-center shrink-0">
                  {user.fullName.charAt(0)}
                </div>
                <span className="max-w-[90px] truncate">{user.fullName}</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl glass-panel border border-emerald-500/40 p-2 shadow-2xl z-50 animate-fade-in text-xs">
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-lowveld-950 hover:bg-lowveld-900 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all"
            >
              <LogIn className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Sign In</span>
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
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-lowveld-600 hover:from-emerald-400 hover:to-lowveld-500 text-white shadow-lg shadow-emerald-900/30 transition-all"
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            <span className="hidden md:inline">{t.postListing}</span>
          </button>
        </div>

        {/* MOBILE CONTROLS (Theme + Language Switcher + Quick Post + Drawer Toggle) */}
        <div className="flex sm:hidden items-center gap-1 shrink-0">
          {/* Theme Switcher Toggle (Mobile) */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-xl bg-lowveld-950 border border-emerald-500/30 text-emerald-300"
            title="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-emerald-400" />
            )}
          </button>

          {/* Quadrilingual Language Selector (Mobile Compact) */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-lowveld-950 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold"
            >
              <Globe className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>{languages.find((l) => l.code === language)?.flag}</span>
              <span className="uppercase">{language}</span>
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

          {/* Quick Post Button on Mobile */}
          <button
            onClick={() => {
              if (!isAuthenticated) {
                openAuthModal('Please sign in or create an account to post a listing.');
              } else {
                window.location.href = '/post';
              }
            }}
            className="p-1.5 rounded-xl bg-emerald-500 text-white font-bold shadow-md"
            title="Post a Listing"
          >
            <PlusCircle className="w-4 h-4" />
          </button>

          {/* Hamburger Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-xl bg-lowveld-900 border border-emerald-500/30 text-emerald-300"
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE SLIDE-DOWN DRAWER MENU */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-lowveld-800 bg-[#070d09] px-4 py-4 space-y-3 animate-fade-in shadow-2xl">
          {/* Pages */}
          <div className="space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                pathname === '/'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-gray-300 hover:bg-lowveld-900'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span>{t.marketplace}</span>
            </Link>

            <Link
              href="/barter-network"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                pathname === '/barter-network'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-gray-300 hover:bg-lowveld-900'
              }`}
            >
              <RefreshCw className="w-4 h-4 text-amber-400" />
              <span>{t.smartBarterHub}</span>
            </Link>

            <Link
              href="/whatsapp-bot"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                pathname === '/whatsapp-bot'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-gray-300 hover:bg-lowveld-900'
              }`}
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>{t.whatsAppEngine}</span>
            </Link>
          </div>

          <div className="pt-2 border-t border-lowveld-800 space-y-2">
            {/* WhatsApp Simulator Launch */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenWhatsApp) onOpenWhatsApp();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#005c4b] text-emerald-100 font-bold text-xs shadow-md"
            >
              <MessageCircle className="w-4 h-4 text-emerald-300" />
              <span>{t.tryWhatsAppBot}</span>
            </button>

            {/* Auth Account Button */}
            {isAuthenticated && user ? (
              <div className="p-3 rounded-xl bg-lowveld-950 border border-lowveld-800 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-white">{user.fullName}</p>
                  <p className="text-[10px] text-emerald-400 font-mono">{user.phoneNumber}</p>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-300 font-bold text-xs"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-lowveld-950 border border-emerald-500/30 text-emerald-300 font-bold text-xs"
              >
                <LogIn className="w-4 h-4 text-emerald-400" />
                <span>Sign In / Register</span>
              </button>
            )}

            {/* Post Listing CTA */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (!isAuthenticated) {
                  openAuthModal('Please sign in or create an account to post a listing.');
                } else {
                  window.location.href = '/post';
                }
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-lowveld-600 text-white font-black text-xs shadow-lg"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.postListing}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
