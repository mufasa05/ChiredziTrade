'use client';

import React, { useState } from 'react';
import { Search, Sparkles, MapPin, Zap, ArrowRight, RefreshCw, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface HeroSectionProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  onSelectCategory?: (cat: string) => void;
  onSelectLocation?: (loc: string) => void;
  onOpenWhatsApp?: () => void;
}

export default function HeroSection({
  searchTerm,
  onSearchChange,
  onSelectCategory,
  onSelectLocation,
  onOpenWhatsApp,
}: HeroSectionProps) {
  const { t } = useLanguage();
  const [localInput, setLocalInput] = useState(searchTerm);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(localInput);
  };

  const handleQuickPrompt = (prompt: string) => {
    setLocalInput(prompt);
    onSearchChange(prompt);
  };

  return (
    <div className="relative overflow-hidden pt-6 pb-6 sm:pt-8 sm:pb-8 border-b border-lowveld-800/30">
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Top Lowveld Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-semibold mb-3.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Lowveld Trade Network: Chiredzi • Triangle • Mkwasine</span>
          </div>

          {/* Trilingual Heading */}
          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15] mb-3">
            {t.heroTitle1}
            <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-amber-300 bg-clip-text text-transparent">
              {t.heroTitleHighlight}
            </span>
          </h1>

          <p className="text-sm sm:text-base text-gray-300 mb-6 max-w-2xl mx-auto font-normal leading-relaxed">
            {t.heroSubtitle}
          </p>

          {/* Search Input Bar */}
          <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto mb-3.5">
            <div className="relative flex items-center shadow-2xl rounded-2xl overflow-hidden glass-panel border border-emerald-500/30 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
              <div className="pl-4 sm:pl-5 text-gray-400">
                <Search className="w-5 h-5 text-emerald-400" />
              </div>
              <input
                type="text"
                value={localInput}
                onChange={(e) => setLocalInput(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full py-3.5 sm:py-4 pl-3 pr-28 sm:pr-36 bg-transparent text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-2 sm:right-2.5 px-4 sm:px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-lowveld-600 hover:from-emerald-400 hover:to-lowveld-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5"
              >
                <span>{t.searchBtn}</span>
                <ArrowRight className="w-3.5 h-3.5 hidden sm:inline" />
              </button>
            </div>
          </form>

          {/* Quick Prompts */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs text-gray-400">
            <span className="text-gray-400 font-medium">{t.quickFind}</span>
            <button
              type="button"
              onClick={() => handleQuickPrompt('Brahman Heifers')}
              className="px-2.5 py-1 rounded-lg bg-lowveld-900/60 hover:bg-lowveld-800 text-gray-300 hover:text-white border border-lowveld-700/50 transition-colors"
            >
              🐄 Cattle & Goats
            </button>
            <button
              type="button"
              onClick={() => handleQuickPrompt('Boutique')}
              className="px-2.5 py-1 rounded-lg bg-lowveld-900/60 hover:bg-lowveld-800 text-pink-300 hover:text-white border border-pink-500/30 transition-colors"
            >
              👗 Vasoni veHembe & Boutiques
            </button>
            <button
              type="button"
              onClick={() => handleQuickPrompt('Groceries')}
              className="px-2.5 py-1 rounded-lg bg-lowveld-900/60 hover:bg-lowveld-800 text-amber-300 hover:text-white border border-amber-500/30 transition-colors"
            >
              🍞 Groceries & Wholesale
            </button>
            <button
              type="button"
              onClick={() => handleQuickPrompt('Cement')}
              className="px-2.5 py-1 rounded-lg bg-lowveld-900/60 hover:bg-lowveld-800 text-orange-300 hover:text-white border border-orange-500/30 transition-colors"
            >
              🧱 Building & Hardware
            </button>
            <button
              type="button"
              onClick={() => handleQuickPrompt('Cane Haulage')}
              className="px-2.5 py-1 rounded-lg bg-lowveld-900/60 hover:bg-lowveld-800 text-gray-300 hover:text-white border border-lowveld-700/50 transition-colors"
            >
              🚛 Cane Haulage
            </button>
            <button
              type="button"
              onClick={() => handleQuickPrompt('Borehole pump repair')}
              className="px-2.5 py-1 rounded-lg bg-lowveld-900/60 hover:bg-lowveld-800 text-gray-300 hover:text-white border border-lowveld-700/50 transition-colors"
            >
              💧 Borehole Repair
            </button>
          </div>
        </div>

        {/* Feature Highlights Ticker */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5 mt-6 sm:mt-7 max-w-4xl mx-auto text-xs sm:text-sm">
          <div className="p-2.5 sm:p-3 rounded-xl glass-card flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400 shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white text-xs sm:text-sm">{t.directWhatsApp}</p>
              <p className="text-[10px] sm:text-[11px] text-gray-400">Zero data waste for buyers</p>
            </div>
          </div>

          <div className="p-2.5 sm:p-3 rounded-xl glass-card flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-400 shrink-0">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white text-xs sm:text-sm">{t.smartBarter}</p>
              <p className="text-[10px] sm:text-[11px] text-gray-400">Swap goods & trade cattle</p>
            </div>
          </div>

          <div className="p-2.5 sm:p-3 rounded-xl glass-card flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center text-blue-400 shrink-0">
              <span className="font-black text-xs">USD / ZAR</span>
            </div>
            <div>
              <p className="font-bold text-white text-xs sm:text-sm">{t.multiCurrency}</p>
              <p className="text-[10px] sm:text-[11px] text-gray-400">USD cash & SA Rand</p>
            </div>
          </div>

          <div className="p-2.5 sm:p-3 rounded-xl glass-card flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center text-purple-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white text-xs sm:text-sm">{t.verifiedArtisans}</p>
              <p className="text-[10px] sm:text-[11px] text-gray-400">Trusted Lowveld mechanics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
