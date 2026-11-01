import React from 'react';
import Link from 'next/link';
import { Store, ShieldCheck, Heart } from 'lucide-react';
import Logo from '@/components/Logo';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-[#0e4337] bg-white dark:bg-[#062A22] text-slate-600 dark:text-emerald-100/70 text-xs transition-colors duration-300 mt-6 sm:mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
          {/* Left: Brand & Founder Credential */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 text-center md:text-left">
            <Logo withLink={true} size="sm" />

            <span className="text-slate-300 dark:text-emerald-800/80 hidden sm:inline">•</span>

            <span className="text-[11px] text-slate-500 dark:text-emerald-200/60 flex items-center gap-1">
              <span>Engineered by</span>
              <strong className="text-slate-700 dark:text-white font-semibold">Prince A. Shumba</strong>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 font-bold">ZW</span>
            </span>

            <span className="text-slate-300 dark:text-emerald-800/80 hidden md:inline">•</span>

            <span className="text-[10px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Verified Trade Network
            </span>
          </div>

          {/* Right: Compact Links & Copyright */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px]">
            <Link href="/barter-network" className="hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors font-medium">
              Barter Hub
            </Link>
            <Link href="/marketplace" className="hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors font-medium">
              Marketplace
            </Link>
            <Link href="/admin" className="hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors font-medium">
              Admin
            </Link>
            <Link href="/privacy" className="hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors">
              Terms
            </Link>
            <span className="text-slate-400 dark:text-emerald-300/40">
              © {new Date().getFullYear()} ZimBarter
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
