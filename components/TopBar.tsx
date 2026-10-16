'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  MapPin,
  Globe,
  Bell,
  ChevronDown,
  Menu,
  X,
  Plus,
  CheckCircle2,
  RefreshCw,
  ShoppingBag,
  User,
  LogOut,
  LogIn,
  Sun,
  Moon,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { Language } from '@/lib/i18n';

interface TopBarProps {
  onToggleSidebar?: () => void;
  searchTerm?: string;
  onSearchChange?: (val: string) => void;
  selectedLocation?: string;
  onSelectLocation?: (loc: string) => void;
}

const CITIES = [
  'All Zimbabwe',
  'Harare',
  'Bulawayo',
  'Chiredzi',
  'Masvingo',
  'Mutare',
  'Gweru',
  'Kwekwe',
  'Victoria Falls',
  'Beitbridge',
];

export default function TopBar({
  onToggleSidebar,
  searchTerm = '',
  onSearchChange,
  selectedLocation = 'Harare',
  onSelectLocation,
}: TopBarProps) {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const [localSearch, setLocalSearch] = useState(searchTerm);
  const [locationOpen, setLocationOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const locRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Sync prop changes
  useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (locRef.current && !locRef.current.contains(e.target as Node)) setLocationOpen(false);
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchChange) onSearchChange(localSearch);
  };

  const notifications = [
    {
      id: 1,
      title: 'New Trade Offer Received',
      desc: 'Simba Chauke offered 2 bags of fertilizer for your Maize.',
      time: '10m ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Listing Verified',
      desc: 'Your listing "Fresh Maize" received the Verified Artisan badge.',
      time: '1h ago',
      unread: true,
    },
    {
      id: 3,
      title: 'Price Inquiry',
      desc: 'Blessing from Chiredzi asked about your broiler availability.',
      time: '3h ago',
      unread: true,
    },
    {
      id: 4,
      title: 'Smart Barter Match',
      desc: 'A new barter swap match was detected for your solar inverter.',
      time: '1d ago',
      unread: false,
    },
  ];

  const displayName = user?.fullName || 'Prince A. Shumba';
  const isVerified = user?.verifiedArtisan ?? true;

  return (
    <header className="h-16 bg-[#062A22] text-white border-b border-[#0e4337] px-3 sm:px-6 flex items-center justify-between gap-3 sticky top-0 z-40 shadow-sm select-none">
      {/* Mobile Menu & Logo */}
      <div className="flex items-center gap-2 lg:hidden">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-emerald-300 hover:text-white hover:bg-[#0a3a30] transition-colors"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Link href="/" className="flex items-center gap-1.5 font-display font-black text-base text-white">
          <span>Zim</span>
          <span className="text-[#F5C542]">Barter</span>
        </Link>
      </div>

      {/* Global Search Input */}
      <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl mx-2 sm:mx-4">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => {
              setLocalSearch(e.target.value);
              if (onSearchChange) onSearchChange(e.target.value);
            }}
            placeholder="Search for goods, services, or people..."
            className="w-full h-10 pl-10 pr-4 rounded-full bg-[#031d17]/80 text-xs sm:text-sm text-white placeholder-emerald-400/60 border border-[#0e4337] focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400/30 transition-all"
          />
        </div>
      </form>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Location Dropdown */}
        <div className="relative hidden md:block" ref={locRef}>
          <button
            onClick={() => setLocationOpen(!locationOpen)}
            className="h-9 px-3 rounded-full bg-[#031d17]/80 hover:bg-[#0a3a30] border border-[#0e4337] text-xs font-semibold text-emerald-100 flex items-center gap-1.5 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{selectedLocation || 'Harare'}</span>
            <ChevronDown className="w-3 h-3 text-emerald-400/80" />
          </button>

          {locationOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#062A22] border border-[#0e4337] shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                Select City / Region
              </div>
              {CITIES.map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    if (onSelectLocation) onSelectLocation(city === 'All Zimbabwe' ? 'all' : city);
                    setLocationOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-1.5 text-xs transition-colors flex items-center justify-between ${
                    (selectedLocation === city || (city === 'All Zimbabwe' && selectedLocation === 'all'))
                      ? 'bg-[#059669] text-white font-bold'
                      : 'text-gray-300 hover:bg-[#0a3a30] hover:text-white'
                  }`}
                >
                  <span>{city}</span>
                  {(selectedLocation === city || (city === 'All Zimbabwe' && selectedLocation === 'all')) && (
                    <CheckCircle2 className="w-3 h-3" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Language Selector */}
        <div className="relative hidden sm:block" ref={langRef}>
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="h-9 px-2.5 rounded-full bg-[#031d17]/80 hover:bg-[#0a3a30] border border-[#0e4337] text-xs font-semibold text-emerald-100 flex items-center gap-1.5 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>ZW / {language.toUpperCase()}</span>
            <ChevronDown className="w-3 h-3 text-emerald-400/80" />
          </button>

          {langOpen && (
            <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-[#062A22] border border-[#0e4337] shadow-2xl py-1.5 z-50">
              <button
                onClick={() => { setLanguage('en'); setLangOpen(false); }}
                className="w-full text-left px-3.5 py-1.5 text-xs text-gray-200 hover:bg-[#0a3a30] flex items-center gap-2"
              >
                <span>🇬🇧 English</span>
              </button>
              <button
                onClick={() => { setLanguage('sn'); setLangOpen(false); }}
                className="w-full text-left px-3.5 py-1.5 text-xs text-gray-200 hover:bg-[#0a3a30] flex items-center gap-2"
              >
                <span>🇿🇼 chiShona</span>
              </button>
              <button
                onClick={() => { setLanguage('nd'); setLangOpen(false); }}
                className="w-full text-left px-3.5 py-1.5 text-xs text-gray-200 hover:bg-[#0a3a30] flex items-center gap-2"
              >
                <span>🇿🇼 isiNdebele</span>
              </button>
              <button
                onClick={() => { setLanguage('ts'); setLangOpen(false); }}
                className="w-full text-left px-3.5 py-1.5 text-xs text-gray-200 hover:bg-[#0a3a30] flex items-center gap-2"
              >
                <span>🇿🇼 Shangani</span>
              </button>
            </div>
          )}
        </div>

        {/* Theme Switcher Toggle (Dark / Light) */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full bg-[#031d17]/80 hover:bg-[#0a3a30] border border-[#0e4337] flex items-center justify-center text-emerald-300 hover:text-white transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-[#F5C542]" />
          ) : (
            <Moon className="w-4 h-4 text-emerald-300" />
          )}
        </button>

        {/* Notifications Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative w-9 h-9 rounded-full bg-[#031d17]/80 hover:bg-[#0a3a30] border border-[#0e4337] flex items-center justify-center text-emerald-300 hover:text-white transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center shadow-md animate-pulse">
              4
            </span>
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#062A22] border border-[#0e4337] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between px-3 py-2 border-b border-[#0e4337]">
                <span className="font-bold text-xs text-white">Notifications</span>
                <span className="text-[10px] text-emerald-400 font-semibold cursor-pointer hover:underline">
                  Mark all read
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-[#0e4337]/50">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2.5 hover:bg-[#0a3a30] rounded-xl transition-colors cursor-pointer">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-white">{n.title}</span>
                      <span className="text-[10px] text-emerald-400/70">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-gray-300 mt-0.5 leading-snug">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full bg-[#031d17]/90 hover:bg-[#0a3a30] border border-[#0e4337] transition-all"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white font-black text-xs flex items-center justify-center border border-emerald-300/40">
              {displayName.charAt(0)}
            </div>
            <div className="hidden md:flex flex-col text-left leading-tight">
              <span className="text-xs font-bold text-white line-clamp-1 max-w-[110px]">
                {displayName}
              </span>
              <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-0.5">
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                Verified User
              </span>
            </div>
            <ChevronDown className="w-3 h-3 text-emerald-400/80 hidden sm:block" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#062A22] border border-[#0e4337] shadow-2xl py-2 z-50">
              <div className="px-4 py-2 border-b border-[#0e4337]">
                <p className="text-xs font-bold text-white">{displayName}</p>
                <p className="text-[10px] text-emerald-400 font-mono">
                  {user?.phoneNumber || '+263 77 123 4567'}
                </p>
              </div>

              <div className="py-1">
                <Link
                  href="/dashboard"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-200 hover:bg-[#0a3a30]"
                >
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <span>My Profile & Listings</span>
                </Link>
                <Link
                  href="/dashboard?tab=proposals"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-200 hover:bg-[#0a3a30]"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Barter Offers & Swaps</span>
                </Link>
                <Link
                  href="/dashboard?tab=orders"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-200 hover:bg-[#0a3a30]"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Wallet & Orders</span>
                </Link>
                <button
                  onClick={() => {
                    toggleTheme();
                    setUserMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-2 text-xs text-gray-200 hover:bg-[#0a3a30]"
                >
                  <span className="flex items-center gap-2.5">
                    {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
                    <span>Theme: {theme === 'dark' ? 'Dark' : 'Light'}</span>
                  </span>
                </button>
              </div>

              <div className="pt-1 border-t border-[#0e4337]">
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-400 hover:bg-red-950/40"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      openAuthModal('Sign in to access your ZimBarter trading account');
                      setUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-emerald-400 hover:bg-[#0a3a30]"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
