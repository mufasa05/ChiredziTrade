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
    <div className="relative w-full rounded-3xl overflow-hidden bg-[#062A22] text-white shadow-2xl mb-6">
      {/* Background Hero Image with Zimbabwean Landscape & Farmer */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-banner.jpg"
          alt="ZimBarter Trading in Zimbabwe"
          className="w-full h-full object-cover object-center lg:object-right filter brightness-[0.98]"
        />
        {/* Soft Left Gradient Overlay for Text Legibility while keeping Farmer & Landscape bright */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#041d18]/95 via-[#062A22]/75 via-45% to-transparent" />
      </div>

      <div className="relative z-10 px-5 sm:px-8 lg:px-12 py-8 sm:py-10 lg:py-12 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left Column: Heading, Subtitle, Pills, Search */}
        <div className="w-full lg:max-w-2xl space-y-4">
          <div className="space-y-1">
            <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-[1.1]">
              Trade More.{' '}
              <span className="block text-[#4ade80]">Get More.</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-200/90 max-w-xl font-normal leading-relaxed pt-1">
              ZimBarter is Zimbabwe&apos;s trusted platform to <strong className="text-white font-semibold">buy, sell, swap and trade goods and services</strong> — with money or anything.
            </p>
          </div>

          {/* 4 Quick Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {filterPills.map((pill) => {
              const Icon = pill.icon;
              return (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => onSelectListingType && onSelectListingType(pill.id)}
                  className="px-3 py-1.5 rounded-full bg-[#031d17]/80 hover:bg-[#0a3a30] border border-[#0e4337] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm hover:scale-[1.02]"
                >
                  <Icon className="w-3.5 h-3.5 text-[#F5C542]" />
                  <span>{pill.label}</span>
                </button>
              );
            })}
          </div>

          {/* Embedded Hero Search Bar */}
          <form onSubmit={handleSearchSubmit} className="pt-2">
            <div className="relative flex items-center max-w-lg bg-white rounded-full p-1 shadow-2xl border border-white/20">
              <Search className="w-4 h-4 text-gray-400 ml-3.5 shrink-0" />
              <input
                type="text"
                value={localInput}
                onChange={(e) => setLocalInput(e.target.value)}
                placeholder="What are you looking for?"
                className="w-full py-2.5 px-3 bg-transparent text-xs sm:text-sm text-gray-900 placeholder-gray-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-full bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs sm:text-sm transition-all shadow-md shrink-0 flex items-center gap-1"
              >
                <span>Search</span>
              </button>
            </div>
          </form>

          {/* Popular Search Chips */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-1 text-xs">
            {popularTags.map((t) => (
              <button
                key={t.label}
                type="button"
                onClick={() => handlePromptClick(t.label)}
                className="px-2.5 py-1 rounded-lg bg-[#031d17]/70 hover:bg-[#0a3a30] text-gray-300 hover:text-white border border-[#0e4337]/80 text-[11px] font-medium transition-colors"
              >
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Floating Trust Cards & Slogan (Visible on Desktop) */}
        <div className="hidden lg:flex flex-col items-end gap-3 shrink-0">
          <div className="text-right mb-2 relative">
            <span className="font-display italic font-semibold text-sm text-[#F5C542] drop-shadow-md block">
              Local Trade • Stronger Communities
            </span>
            <span className="font-display italic font-bold text-base text-white drop-shadow-md block">
              A Brighter Zimbabwe
            </span>
            {/* Zimbabwe National Color Stripe */}
            <div className="h-1 w-32 ml-auto bg-gradient-to-r from-emerald-500 via-[#F5C542] via-red-500 to-amber-400 rounded-full mt-1 opacity-90 shadow-sm" />
          </div>

          <div className="w-64 space-y-2">
            <div className="p-2.5 px-3.5 rounded-2xl bg-[#062A22]/85 backdrop-blur-md border border-[#0e4337] flex items-center gap-3 shadow-lg transform hover:-translate-x-1 transition-transform">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-white tracking-tight">Join a growing community</span>
            </div>

            <div className="p-2.5 px-3.5 rounded-2xl bg-[#062A22]/85 backdrop-blur-md border border-[#0e4337] flex items-center gap-3 shadow-lg transform hover:-translate-x-1 transition-transform">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <Store className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-white tracking-tight">Support local businesses</span>
            </div>

            <div className="p-2.5 px-3.5 rounded-2xl bg-[#062A22]/85 backdrop-blur-md border border-[#0e4337] flex items-center gap-3 shadow-lg transform hover:-translate-x-1 transition-transform">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <Sprout className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-white tracking-tight">Build a stronger Zimbabwe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
