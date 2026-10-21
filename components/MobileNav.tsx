'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Plus, RefreshCw, MessageCircle, User } from 'lucide-react';

interface MobileNavProps {
  onOpenMessages?: () => void;
}

export default function MobileNav({ onOpenMessages }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-[#062A22] border-t border-slate-200 dark:border-[#0e4337] px-2 py-1.5 flex items-center justify-around shadow-2xl transition-colors duration-200">
      {/* Home */}
      <Link
        href="/"
        className={`flex flex-col items-center gap-0.5 px-2.5 py-1 text-[10px] font-semibold transition-colors ${
          pathname === '/' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <Home className="w-4 h-4" />
        <span>Home</span>
      </Link>

      {/* Explore */}
      <Link
        href="/#marketplace"
        className="flex flex-col items-center gap-0.5 px-2.5 py-1 text-[10px] font-semibold text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        <ShoppingBag className="w-4 h-4" />
        <span>Explore</span>
      </Link>

      {/* Center + Create Listing Button */}
      <Link
        href="/post"
        className="relative -top-3 w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-500 to-[#F5C542] text-white flex items-center justify-center shadow-lg shadow-emerald-950/40 hover:scale-105 transition-transform"
        aria-label="Create Listing"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </Link>

      {/* Barter */}
      <Link
        href="/barter-network"
        className={`flex flex-col items-center gap-0.5 px-2.5 py-1 text-[10px] font-semibold transition-colors ${
          pathname === '/barter-network' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <RefreshCw className="w-4 h-4" />
        <span>Barter</span>
      </Link>

      {/* Messages / Profile */}
      <button
        onClick={onOpenMessages}
        className="flex flex-col items-center gap-0.5 px-2.5 py-1 text-[10px] font-semibold text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition-colors relative"
      >
        <MessageCircle className="w-4 h-4" />
        <span>Messages</span>
        <span className="absolute top-0 right-2 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
      </button>

      <Link
        href="/dashboard"
        className={`flex flex-col items-center gap-0.5 px-2.5 py-1 text-[10px] font-semibold transition-colors ${
          pathname === '/dashboard' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <User className="w-4 h-4" />
        <span>Profile</span>
      </Link>
    </div>
  );
}
