'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  ShoppingBag,
  RefreshCw,
  LayoutGrid,
  Tag,
  MessageCircle,
  Wallet,
  Heart,
  Settings,
  Sparkles,
  ChevronRight,
  Store,
  Plus,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

interface SidebarProps {
  activeNav?: string;
  onSelectNav?: (item: string) => void;
  onOpenMessages?: () => void;
  onOpenFavorites?: () => void;
  favoritesCount?: number;
}

export default function Sidebar({
  activeNav,
  onSelectNav,
  onOpenMessages,
  onOpenFavorites,
  favoritesCount = 0,
}: SidebarProps) {
  const pathname = usePathname();
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { t } = useLanguage();

  // If activeNav is provided, prioritize it; otherwise fallback to pathname
  const currentActive = activeNav || (pathname === '/marketplace' ? 'Marketplace' : pathname === '/' ? 'Home' : '');

  const navItems = [
    {
      id: 'Home',
      label: t.navHome,
      href: '/',
      icon: Home,
      requiresAuth: false,
      isActive: currentActive === 'Home' || pathname === '/',
    },
    {
      id: 'Marketplace',
      label: t.navMarketplace,
      href: '/marketplace',
      icon: ShoppingBag,
      requiresAuth: false,
      isActive: currentActive === 'Marketplace' || pathname === '/marketplace',
    },
    {
      id: 'Barter Hub',
      label: t.navBarterHub,
      href: '/barter-network',
      icon: RefreshCw,
      requiresAuth: true,
      isActive: currentActive === 'Barter Hub' || pathname === '/barter-network',
    },
    {
      id: 'My Listings',
      label: t.navMyListings,
      href: '/my-listings',
      icon: Tag,
      requiresAuth: true,
      isActive: currentActive === 'My Listings' || pathname === '/my-listings' || pathname === '/dashboard',
    },
    {
      id: 'Messages',
      label: t.navMessages,
      href: '/messages',
      icon: MessageCircle,
      requiresAuth: true,
      onClick: onOpenMessages,
      isActive: currentActive === 'Messages' || pathname === '/messages',
    },
    {
      id: 'Wallet & Trades',
      label: t.navWallet,
      href: '/wallet',
      icon: Wallet,
      requiresAuth: true,
      isActive: currentActive === 'Wallet & Trades' || pathname === '/wallet',
    },
    {
      id: 'Favourites',
      label: t.navFavorites,
      href: '/favourites',
      icon: Heart,
      requiresAuth: true,
      badge: isAuthenticated && favoritesCount > 0 ? String(favoritesCount) : undefined,
      badgeColor: 'bg-amber-500',
      isActive: currentActive === 'Favourites' || pathname === '/favourites' || pathname === '/favorites',
    },
    {
      id: 'Settings',
      label: t.navSettings,
      href: '/settings',
      icon: Settings,
      requiresAuth: true,
      isActive: currentActive === 'Settings' || pathname === '/settings',
    },
  ];

  const handleItemClick = (e: React.MouseEvent, item: typeof navItems[0]) => {
    if (item.requiresAuth && !isAuthenticated) {
      e.preventDefault();
      openAuthModal(`Please sign in to access ${item.label}.`);
      return;
    }
    if (item.onClick) {
      e.preventDefault();
      item.onClick();
      return;
    }
    if (onSelectNav) {
      onSelectNav(item.id);
    }
  };

  const isMarketplace = currentActive === 'Marketplace';

  return (
    <aside className="w-60 shrink-0 bg-white dark:bg-[#062A22] text-slate-800 dark:text-white min-h-screen flex flex-col justify-between border-r border-slate-200 dark:border-[#0e4337] select-none transition-colors duration-200">
      {/* Top Brand Logo */}
      <div>
        <div className="h-16 px-5 flex items-center gap-3 border-b border-slate-200 dark:border-[#0e4337]/60">
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* Swirl Green & Gold Emblem matching screenshot */}
            <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-[#F5C542] p-0.5 shadow-md flex items-center justify-center group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full bg-white dark:bg-[#062A22] flex items-center justify-center">
                <RefreshCw className="w-4 h-4 text-emerald-600 dark:text-[#F5C542] animate-spin" style={{ animationDuration: '12s' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1 leading-none">
                <span className="font-display font-black text-lg tracking-tight text-slate-900 dark:text-white">
                  Zim<span className="text-emerald-600 dark:text-[#F5C542]">Barter</span>
                </span>
              </div>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400/90 font-medium tracking-wide">
                Trade • Swap • Grow
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.isActive;

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={(e) => handleItemClick(e, item)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-150 ${
                  active
                    ? 'bg-[#059669] text-white shadow-md'
                    : 'text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#0a3a30]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold text-white ${
                      item.badgeColor || 'bg-red-500'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Trust Badge */}
      <div className="p-3">
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#031d17]/90 border border-slate-200 dark:border-[#0e4337] relative overflow-hidden group">
          <div className="flex items-center gap-2.5 relative z-10">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-[#059669] dark:text-[#F5C542] flex items-center justify-center shrink-0 border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                {isMarketplace ? 'Verified Marketplace' : t.sovereignTradeNetwork}
              </p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                {t.protectedEscrowSwaps}
              </p>
            </div>
          </div>
          {/* Subtle gradient glow */}
          <div className="absolute -right-4 -bottom-4 w-14 h-14 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
        </div>
      </div>
    </aside>
  );
}
