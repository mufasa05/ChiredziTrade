'use client';

import React, { useState } from 'react';
import {
  Search,
  ArrowRight,
  RefreshCw,
  ShoppingBag,
  Coins,
  Wrench,
  Users,
  Store,
  Sprout,
  Sparkles
} from 'lucide-react';

interface HeroSectionProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  onSelectListingType?: (type: string) => void;
  onQuickPrompt?: (prompt: string) => void;
}

export default function HeroSection({
  searchTerm,
  onSearchChange,
  onSelectListingType,
  onQuickPrompt,
}: HeroSectionProps) {
  const [localInput, setLocalInput] = useState(searchTerm);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(localInput);
  };

  const handlePromptClick = (tag: string) => {
    setLocalInput(tag);
    onSearchChange(tag);
    if (onQuickPrompt) onQuickPrompt(tag);
  };

  const filterPills = [
    { id: 'for_sale', label: 'Buy & Sell', icon: ShoppingBag },
    { id: 'for_trade', label: 'Swap Goods', icon: RefreshCw },
    { id: 'trade_top_up', label: 'Top Up', icon: Coins },
    { id: 'services', label: 'Trade Services', icon: Users },
  ];

  const popularTags = [
    { label: 'Maize' },
    { label: 'Phones' },
    { label: 'Rooms' },
    { label: 'Services' },
    { label: 'Vehicles' },
    { label: 'Electronics' },
    { label: 'Jobs' },
  ];

  return (
    <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#062A22] text-white shadow-xl mb-5">
      {/* Background Hero Image with Younger Zimbabwean Trader & Vibrant Landscape */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/young-trader-hero.jpg"
          alt="Young Zimbabwean Entrepreneur on ZimBarter"
          className="w-full h-full object-cover object-[center_right] filter brightness-[0.98]"
        />
        {/* Soft Left Gradient Overlay for crisp text legibility while keeping young trader and landscape bright */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#041d18]/95 via-[#062A22]/80 via-45% to-transparent" />
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-6 flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Left Column: Heading, Subtitle, Pills, Search */}
        <div className="w-full lg:max-w-xl space-y-3">
          <div className="space-y-0.5">
            <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-[32px] text-white tracking-tight leading-[1.15]">
              Trade More.{' '}
              <span className="text-[#4ade80]">Get More.</span>
            </h1>
            <p className="text-xs sm:text-[13px] text-gray-200/90 max-w-lg font-normal leading-relaxed pt-0.5">
              Zimbabwe&apos;s trusted platform to <strong className="text-white font-semibold">buy, sell, swap and trade goods & services</strong> — with money or anything.
            </p>
          </div>

          {/* 4 Quick Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            {filterPills.map((pill) => {
              const Icon = pill.icon;
              return (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => onSelectListingType && onSelectListingType(pill.id)}
                  className="px-2.5 py-1 rounded-full bg-[#031d17]/85 hover:bg-[#0a3a30] border border-[#0e4337] text-white text-[11px] font-semibold flex items-center gap-1.5 transition-all shadow-sm hover:scale-[1.02]"
                >
                  <Icon className="w-3 h-3 text-[#F5C542]" />
                  <span>{pill.label}</span>
                </button>
              );
            })}
          </div>

          {/* Embedded Compact Hero Search Bar */}
          <form onSubmit={handleSearchSubmit} className="pt-0.5">
            <div className="relative flex items-center max-w-md bg-white rounded-full p-1 shadow-xl border border-white/20">
              <Search className="w-4 h-4 text-gray-400 ml-3 shrink-0" />
              <input
                type="text"
                value={localInput}
                onChange={(e) => setLocalInput(e.target.value)}
                placeholder="What are you looking for?"
                className="w-full py-2 px-2.5 bg-transparent text-xs text-gray-900 placeholder-gray-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-full bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs transition-all shadow-md shrink-0 flex items-center gap-1"
              >
                <span>Search</span>
              </button>
            </div>
          </form>

          {/* Popular Search Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-xs">
            {popularTags.map((t) => (
              <button
                key={t.label}
                type="button"
                onClick={() => handlePromptClick(t.label)}
                className="px-2 py-0.5 rounded-md bg-[#031d17]/75 hover:bg-[#0a3a30] text-gray-300 hover:text-white border border-[#0e4337]/80 text-[10px] sm:text-[11px] font-medium transition-colors"
              >
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Floating Trust Cards & Slogan (Visible on Desktop) */}
        <div className="hidden lg:flex flex-col items-end gap-2.5 shrink-0">
          <div className="text-right mb-1 relative">
            <span className="font-display italic font-semibold text-xs text-[#F5C542] drop-shadow-md block">
              Local Trade • Stronger Communities
            </span>
            <span className="font-display italic font-bold text-sm text-white drop-shadow-md block">
              A Brighter Zimbabwe
            </span>
            {/* Zimbabwe National Color Stripe */}
            <div className="h-0.5 w-28 ml-auto bg-gradient-to-r from-emerald-500 via-[#F5C542] via-red-500 to-amber-400 rounded-full mt-1 opacity-90 shadow-sm" />
          </div>

          <div className="w-56 space-y-1.5">
            <div className="p-2 px-3 rounded-xl bg-[#062A22]/85 backdrop-blur-md border border-[#0e4337] flex items-center gap-2.5 shadow-md">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <Users className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-bold text-white tracking-tight">Join a growing community</span>
            </div>

            <div className="p-2 px-3 rounded-xl bg-[#062A22]/85 backdrop-blur-md border border-[#0e4337] flex items-center gap-2.5 shadow-md">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <Store className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-bold text-white tracking-tight">Support local businesses</span>
            </div>

            <div className="p-2 px-3 rounded-xl bg-[#062A22]/85 backdrop-blur-md border border-[#0e4337] flex items-center gap-2.5 shadow-md">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <Sprout className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-bold text-white tracking-tight">Build a stronger Zimbabwe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
