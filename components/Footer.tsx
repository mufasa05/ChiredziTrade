import React from 'react';
import Link from 'next/link';
import { Tractor, MessageCircle, RefreshCw, ShieldCheck, User, Code, Info } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-lowveld-800/40 bg-slate-100 dark:bg-lowveld-950/90 text-slate-600 dark:text-gray-400 text-xs sm:text-sm mt-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
          {/* Col 1: Brand (4 cols) */}
          <div className="space-y-3 md:col-span-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-lowveld-700 flex items-center justify-center text-white shadow-md">
                <Tractor className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-extrabold text-lg text-slate-900 dark:text-white">
                Zim<span className="text-emerald-600 dark:text-emerald-400">Barter</span>
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-gray-300 leading-relaxed">
              Nationwide multi-currency and smart barter marketplace connecting farmers, cattle ranches, artisans, wholesalers, and businesses across Zimbabwe.
            </p>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-semibold pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Zimbabwean Artisan & Trade Network</span>
            </div>
          </div>

          {/* Col 2: About Platform Brief Info (4 cols) */}
          <div className="md:col-span-4">
            <h4 className="font-bold text-slate-900 dark:text-white mb-3 uppercase tracking-wider text-xs flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>About Platform</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-gray-300 leading-relaxed">
              Zim Barter was created to solve liquidity bottlenecks across Zimbabwe. By combining multi-currency cash transactions (USD, ZWG, ZAR) with intelligent bilateral barter matching algorithms, farmers, traders, and artisans can exchange goods, produce, and services directly via WhatsApp.
            </p>
          </div>

          {/* Col 3: Leadership & Team (4 cols) */}
          <div className="md:col-span-4">
            <h4 className="font-bold text-slate-900 dark:text-white mb-3 uppercase tracking-wider text-xs flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Leadership & Team</span>
            </h4>
            <div className="p-3.5 rounded-2xl bg-white dark:bg-lowveld-900/60 border border-slate-200 dark:border-lowveld-800 space-y-1.5 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-black text-xs flex items-center justify-center border border-emerald-500/30">
                  PS
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-xs">Prince A. Shumba</p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">Founder & Platform Engineer</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-gray-400 leading-relaxed pt-1">
                Pioneering hyper-localized trade technology, smart barter matching algorithms, and WhatsApp integration for Zimbabwean businesses and communities.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-200 dark:border-lowveld-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Zim Barter. Founded & Engineered by Prince A. Shumba.</p>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/barter-network" className="hover:text-amber-600 dark:hover:text-amber-300 transition-colors font-medium">
              Smart Barter Hub
            </Link>
            <span>•</span>
            <Link href="/admin" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-semibold flex items-center gap-1">
              <span>Admin Console</span>
            </Link>
            <span>•</span>
            <span>USD / ZWG / ZAR / Barter</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
