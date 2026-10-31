'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
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
  ShieldCheck,
  Zap,
  Receipt,
  MessageCircle,
  Clock,
  Wallet,
  Settings,
  Tag
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { Language } from '@/lib/i18n';
import { 
  AppNotification, 
  subscribeToNotifications, 
  markAllNotificationsAsRead, 
  markNotificationAsRead 
} from '@/lib/notifications';

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
  selectedLocation = 'All Zimbabwe',
  onSelectLocation,
}: TopBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout, openAuthModal, signInAsDemo } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const [localSearch, setLocalSearch] = useState(searchTerm);
  const [locationOpen, setLocationOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const locRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Subscribe to real live notifications
  useEffect(() => {
    const unsubscribe = subscribeToNotifications((list) => {
      setNotifications(list);
    });
    return () => unsubscribe();
  }, []);

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
    const query = localSearch.trim();
    if (onSearchChange && (pathname === '/' || pathname === '/marketplace')) {
      onSearchChange(query);
    } else {
      router.push(`/marketplace?search=${encodeURIComponent(query)}`);
    }
  };

  const unreadNotifsCount = notifications.filter((n) => n.unread).length;
  const displayName = user?.fullName || 'Guest Trader';

  return (
    <header className="h-16 bg-white dark:bg-[#062A22] text-slate-800 dark:text-white border-b border-slate-200 dark:border-[#0e4337] px-3 sm:px-6 flex items-center justify-between gap-3 sticky top-0 z-40 shadow-sm select-none transition-colors duration-200">
      {/* Mobile Menu & Logo */}
      <div className="flex items-center gap-2 lg:hidden">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-600 dark:text-emerald-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#0a3a30] transition-colors"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Link href="/" className="flex items-center gap-1.5 font-display font-black text-base text-slate-900 dark:text-white">
          <span>Zim</span>
          <span className="text-emerald-600 dark:text-[#F5C542]">Barter</span>
        </Link>
      </div>

      {/* Global Search Input */}
      <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl mx-2 sm:mx-4">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 dark:text-emerald-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => {
              setLocalSearch(e.target.value);
              if (onSearchChange) onSearchChange(e.target.value);
            }}
            placeholder="Search for goods, services, or people..."
            className="w-full h-10 pl-10 pr-4 rounded-full bg-slate-100 dark:bg-[#031d17]/80 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-emerald-400/60 border border-slate-200 dark:border-[#0e4337] focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all"
          />
        </div>
      </form>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Location Dropdown */}
        <div className="relative hidden md:block" ref={locRef}>
          <button
            onClick={() => setLocationOpen(!locationOpen)}
            className="h-9 px-3 rounded-full bg-slate-100 dark:bg-[#031d17]/80 hover:bg-slate-200 dark:hover:bg-[#0a3a30] border border-slate-200 dark:border-[#0e4337] text-xs font-semibold text-slate-700 dark:text-emerald-100 flex items-center gap-1.5 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{selectedLocation === 'all' ? 'All Zimbabwe' : (selectedLocation || 'All Zimbabwe')}</span>
            <ChevronDown className="w-3 h-3 text-slate-400 dark:text-emerald-400/80" />
          </button>

          {locationOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-[#062A22] border border-slate-200 dark:border-[#0e4337] shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
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
                      : 'text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-[#0a3a30]'
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
            className="h-9 px-2.5 rounded-full bg-slate-100 dark:bg-[#031d17]/80 hover:bg-slate-200 dark:hover:bg-[#0a3a30] border border-slate-200 dark:border-[#0e4337] text-xs font-semibold text-slate-700 dark:text-emerald-100 flex items-center gap-1.5 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>ZW / {language.toUpperCase()}</span>
            <ChevronDown className="w-3 h-3 text-slate-400 dark:text-emerald-400/80" />
          </button>

          {langOpen && (
            <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-white dark:bg-[#062A22] border border-slate-200 dark:border-[#0e4337] shadow-2xl py-1.5 z-50">
              <button
                onClick={() => { setLanguage('en'); setLangOpen(false); }}
                className="w-full text-left px-3.5 py-1.5 text-xs text-slate-700 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-[#0a3a30] flex items-center justify-between"
              >
                <span>English</span>
                <span className="text-[10px] font-mono text-slate-400 font-bold">EN</span>
              </button>
              <button
                onClick={() => { setLanguage('sn'); setLangOpen(false); }}
                className="w-full text-left px-3.5 py-1.5 text-xs text-slate-700 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-[#0a3a30] flex items-center justify-between"
              >
                <span>chiShona</span>
                <span className="text-[10px] font-mono text-slate-400 font-bold">SN</span>
              </button>
              <button
                onClick={() => { setLanguage('nd'); setLangOpen(false); }}
                className="w-full text-left px-3.5 py-1.5 text-xs text-slate-700 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-[#0a3a30] flex items-center justify-between"
              >
                <span>isiNdebele</span>
                <span className="text-[10px] font-mono text-slate-400 font-bold">ND</span>
              </button>
              <button
                onClick={() => { setLanguage('ts'); setLangOpen(false); }}
                className="w-full text-left px-3.5 py-1.5 text-xs text-slate-700 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-[#0a3a30] flex items-center justify-between"
              >
                <span>Shangani</span>
                <span className="text-[10px] font-mono text-slate-400 font-bold">TS</span>
              </button>
            </div>
          )}
        </div>

        {/* Theme Switcher Toggle (Dark / Light) */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full bg-slate-100 dark:bg-[#031d17]/80 hover:bg-slate-200 dark:hover:bg-[#0a3a30] border border-slate-200 dark:border-[#0e4337] flex items-center justify-center text-slate-700 dark:text-emerald-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-[#F5C542]" />
          ) : (
            <Moon className="w-4 h-4 text-emerald-600 dark:text-emerald-300" />
          )}
        </button>

        {/* Notifications Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative w-9 h-9 rounded-full bg-slate-100 dark:bg-[#031d17]/80 hover:bg-slate-200 dark:hover:bg-[#0a3a30] border border-slate-200 dark:border-[#0e4337] flex items-center justify-center text-slate-700 dark:text-emerald-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center shadow-md animate-pulse">
                {unreadNotifsCount > 9 ? '9+' : unreadNotifsCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#062A22] border border-slate-200 dark:border-[#0e4337] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 dark:border-[#0e4337]">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">Live Notifications</span>
                  {unreadNotifsCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-500/10 text-red-600 dark:text-red-300 border border-red-500/30 font-bold">
                      {unreadNotifsCount} new
                    </span>
                  )}
                </div>
                {unreadNotifsCount > 0 && (
                  <button
                    onClick={() => markAllNotificationsAsRead()}
                    className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold cursor-pointer hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-[#0e4337]/50">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500 dark:text-emerald-300/70">
                    <Bell className="w-6 h-6 mx-auto mb-2 text-slate-400 dark:text-emerald-500/40" />
                    <p className="font-medium text-slate-800 dark:text-white">No notifications yet</p>
                    <p className="text-[11px] text-slate-400 dark:text-gray-400 mt-0.5">Activity on your postings and orders will appear here.</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationAsRead(n.id);
                        if (n.link) {
                          setNotifOpen(false);
                          window.location.href = n.link;
                        }
                      }}
                      className={`p-3 hover:bg-slate-50 dark:hover:bg-[#0a3a30] rounded-xl transition-colors cursor-pointer ${
                        n.unread ? 'bg-emerald-50/60 dark:bg-[#031d17]/50' : 'opacity-85'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 dark:border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400">
                          {n.type === 'order' ? (
                            <ShoppingBag className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          ) : n.type === 'proposal' ? (
                            <RefreshCw className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                          ) : n.type === 'whatsapp_inquiry' ? (
                            <MessageCircle className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{n.title}</span>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400/80 shrink-0 font-mono">{n.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-gray-300 mt-0.5 leading-snug">{n.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full bg-slate-100 dark:bg-[#031d17]/90 hover:bg-slate-200 dark:hover:bg-[#0a3a30] border border-slate-200 dark:border-[#0e4337] transition-all cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white font-black text-xs flex items-center justify-center border border-emerald-300/40">
              {isAuthenticated && user ? user.fullName.charAt(0) : <User className="w-3.5 h-3.5" />}
            </div>
            <div className="hidden md:flex flex-col text-left leading-tight">
              <span className="text-xs font-bold text-slate-800 dark:text-white line-clamp-1 max-w-[120px]">
                {isAuthenticated && user ? user.fullName : 'Guest Trader'}
              </span>
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                {isAuthenticated ? (
                  <>
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500 dark:text-emerald-400" />
                    Verified User
                  </>
                ) : (
                  'Tap to Sign In'
                )}
              </span>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 dark:text-emerald-400/80 hidden sm:block" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#062A22] border border-slate-200 dark:border-[#0e4337] shadow-2xl py-2 z-50">
              {isAuthenticated && user ? (
                /* Authenticated User Menu */
                <>
                  <div className="px-4 py-2.5 border-b border-slate-200 dark:border-[#0e4337]">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{user.fullName}</p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                      {user.phoneNumber || '+263 77 123 4567'}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-2.5 h-2.5 text-emerald-500" />
                      <span>{user.locationArea}</span>
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/my-listings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-[#0a3a30]"
                    >
                      <Tag className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>My Listings &amp; Inventory</span>
                    </Link>
                    <Link
                      href="/messages"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-[#0a3a30]"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Trade Messages</span>
                    </Link>
                    <Link
                      href="/wallet"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-amber-600 dark:text-amber-300 hover:bg-slate-100 dark:hover:bg-[#0a3a30] font-semibold"
                    >
                      <Wallet className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                      <span>Wallet, Escrow &amp; Receipts</span>
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-[#0a3a30]"
                    >
                      <Settings className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Account Settings &amp; KYC</span>
                    </Link>
                    <button
                      onClick={() => {
                        toggleTheme();
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-4 py-2 text-xs text-slate-700 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-[#0a3a30] cursor-pointer"
                    >
                      <span className="flex items-center gap-2.5">
                        {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-500" />}
                        <span>Theme: {theme === 'dark' ? 'Dark' : 'Light'}</span>
                      </span>
                    </button>
                  </div>

                  <div className="pt-1 border-t border-slate-200 dark:border-[#0e4337]">
                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              ) : (
                /* Guest User Menu with 1-Tap Quick Demo & Standard Sign-In */
                <>
                  <div className="px-4 py-2.5 border-b border-slate-200 dark:border-[#0e4337]">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Guest Trader</p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400">
                      Sign in to manage listings, swap barter &amp; buy products
                    </p>
                  </div>

                  <div className="p-2 space-y-1.5">
                    {/* 1-Tap Quick Demo Access Button */}
                    <button
                      onClick={() => {
                        signInAsDemo();
                        setUserMenuOpen(false);
                      }}
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span>1-Tap Demo: Prince A. Shumba</span>
                    </button>

                    {/* Standard Sign In */}
                    <button
                      onClick={() => {
                        openAuthModal('Sign in or register with email or Google.');
                        setUserMenuOpen(false);
                      }}
                      className="w-full py-2.5 px-3 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Sign In with Email / Google</span>
                    </button>
                  </div>

                  <div className="py-1 border-t border-slate-200 dark:border-[#0e4337]">
                    <button
                      onClick={() => {
                        signInAsDemo();
                        setUserMenuOpen(false);
                        router.push('/my-listings');
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-[#0a3a30] cursor-pointer"
                    >
                      <Tag className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>My Listings &amp; Inventory</span>
                    </button>
                    <button
                      onClick={() => {
                        signInAsDemo();
                        setUserMenuOpen(false);
                        router.push('/wallet');
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-amber-600 dark:text-amber-300 hover:bg-slate-100 dark:hover:bg-[#0a3a30] font-semibold cursor-pointer"
                    >
                      <Wallet className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                      <span>Wallet, Escrow &amp; Receipts</span>
                    </button>
                    <button
                      onClick={() => {
                        toggleTheme();
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-4 py-2 text-xs text-slate-700 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-[#0a3a30] cursor-pointer"
                    >
                      <span className="flex items-center gap-2.5">
                        {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-500" />}
                        <span>Theme: {theme === 'dark' ? 'Dark' : 'Light'}</span>
                      </span>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
