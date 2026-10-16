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
  Plus
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

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
  const { user } = useAuth();

  // If activeNav is provided, prioritize it; otherwise fallback to pathname
  const currentActive = activeNav || (pathname === '/marketplace' ? 'Marketplace' : pathname === '/' ? 'Home' : '');

  const navItems = [
    {
      id: 'Home',
      label: 'Home',
      href: '/',
      icon: Home,
      isActive: currentActive === 'Home',
    },
    {
      id: 'Marketplace',
      label: 'Marketplace',
      href: '/marketplace',
      icon: ShoppingBag,
      isActive: currentActive === 'Marketplace',
    },
    {
      id: 'Barter Hub',
      label: 'Barter Hub',
      href: '/barter-network',
      icon: RefreshCw,
      isActive: currentActive === 'Barter Hub' || pathname === '/barter-network',
    },
    {
      id: 'My Listings',
      label: 'My Listings',
      href: '/dashboard',
      icon: Tag,
      isActive: currentActive === 'My Listings' || pathname === '/dashboard',
    },
    {
      id: 'Messages',
      label: 'Messages',
      href: '#messages',
      icon: MessageCircle,
      badge: '3',
      badgeColor: 'bg-red-500',
      onClick: onOpenMessages,
      isActive: false,
    },
    {
      id: 'Wallet & Trades',
      label: 'Wallet & Trades',
      href: '/dashboard?tab=orders',
      icon: Wallet,
      isActive: false,
    },
    {
      id: 'Favourites',
      label: 'Favourites',
      href: '#favourites',
      icon: Heart,
      badge: favoritesCount > 0 ? String(favoritesCount) : undefined,
      badgeColor: 'bg-amber-500',
      onClick: onOpenFavorites,
      isActive: false,
    },
    {
      id: 'Settings',
      label: 'Settings',
      href: '/dashboard?tab=profile',
      icon: Settings,
      isActive: false,
    },
  ];

  const handleItemClick = (e: React.MouseEvent, item: typeof navItems[0]) => {
    if (item.onClick) {
      e.preventDefault();
      item.onClick();
      return;
    }
    if (onSelectNav) {
      e.preventDefault();
      onSelectNav(item.id);
    }
  };

  const isMarketplace = currentActive === 'Marketplace';

  return (
    <aside className="w-60 shrink-0 bg-[#062A22] text-white min-h-screen flex flex-col justify-between border-r border-[#0e4337] select-none">
      {/* Top Brand Logo */}
      <div>
        <div className="h-16 px-5 flex items-center gap-3 border-b border-[#0e4337]/60">
          <Link href="/" onClick={(e) => { if (onSelectNav) { e.preventDefault(); onSelectNav('Home'); } }} className="flex items-center gap-2.5 group">
            {/* Swirl Green & Gold Emblem matching screenshot */}
            <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-[#F5C542] p-0.5 shadow-md flex items-center justify-center group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full bg-[#062A22] flex items-center justify-center">
                <RefreshCw className="w-4 h-4 text-[#F5C542] animate-spin" style={{ animationDuration: '12s' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1 leading-none">
                <span className="font-display font-black text-lg tracking-tight text-white">
                  Zim<span className="text-[#F5C542]">Barter</span>
                </span>
              </div>
              <p className="text-[10px] text-emerald-400/90 font-medium tracking-wide">
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
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleItemClick(e, item)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-150 ${
                  active
                    ? 'bg-[#059669] text-white shadow-md'
                    : 'text-gray-300 hover:text-white hover:bg-[#0a3a30]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-emerald-400'}`} />
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
              </a>
            );
          })}
        </nav>
      </div>

      {/* Bottom Heritage Badge (Switches text between Home and Marketplace as in screenshot) */}
      <div className="p-3">
        <div className="p-3 rounded-2xl bg-[#031d17]/90 border border-[#0e4337] relative overflow-hidden group">
          <div className="flex items-center gap-2.5 relative z-10">
            <span className="text-xl shrink-0" role="img" aria-label="Zimbabwe Flag">
              🇿🇼
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-white tracking-tight leading-tight">
                {isMarketplace ? 'Together We Trade' : 'Proudly Zimbabwean'}
              </p>
              <p className="text-[10px] text-emerald-400/80 font-medium">
                {isMarketplace ? 'Together We Grow' : 'Built for Africa'}
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
