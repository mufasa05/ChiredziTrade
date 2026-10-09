'use client';

import React from 'react';
import { Listing } from '@/lib/types';
import ListingCard from './ListingCard';
import { Store, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ListingGridProps {
  listings: Listing[];
  loading?: boolean;
  onProposeBarter: (listing: Listing) => void;
  onBuyCash?: (listing: Listing) => void;
  onResetFilters: () => void;
}

export default function ListingGrid({
  listings,
  loading,
  onProposeBarter,
  onBuyCash,
  onResetFilters,
}: ListingGridProps) {
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-96 rounded-2xl bg-white dark:bg-lowveld-950/60 border border-slate-200 dark:border-lowveld-900 animate-pulse flex flex-col justify-between p-4 shadow-sm">
            <div className="h-48 rounded-xl bg-slate-200 dark:bg-lowveld-900/60" />
            <div className="space-y-2 mt-4">
              <div className="h-4 rounded bg-slate-200 dark:bg-lowveld-900/80 w-3/4" />
              <div className="h-3 rounded bg-slate-100 dark:bg-lowveld-900/50 w-full" />
            </div>
            <div className="h-9 rounded-xl bg-slate-200 dark:bg-lowveld-900/80 mt-4" />
          </div>
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="py-16 text-center glass-panel rounded-3xl p-8 max-w-lg mx-auto border border-slate-200 dark:border-lowveld-800 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-lowveld-700/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto mb-4 border border-emerald-500/30 shadow-md">
          <Store className="w-8 h-8" />
        </div>
        <h3 className="font-display font-black text-xl text-slate-900 dark:text-white mb-2">
          Ready for Your First Zimbabwe Trade Offer
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400 mb-6 max-w-sm mx-auto leading-relaxed">
          Be the first to post livestock, farm produce, building materials, solar hardware, or artisan services in your area.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="/post"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-lowveld-600 hover:from-emerald-400 hover:to-lowveld-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all inline-flex items-center justify-center gap-2"
          >
            <span>+ Post a Trade Listing</span>
          </a>
          <button
            onClick={onResetFilters}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-200 dark:bg-lowveld-900 hover:bg-slate-300 dark:hover:bg-lowveld-800 text-slate-700 dark:text-gray-300 font-semibold text-xs sm:text-sm border border-slate-300 dark:border-lowveld-700 transition-all inline-flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400">
          {t.showingListings} <span className="text-emerald-600 dark:text-emerald-400 font-bold">{listings.length}</span> {t.activeTradeOffers}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {listings.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            onProposeBarter={onProposeBarter}
            onBuyCash={onBuyCash}
          />
        ))}
      </div>
    </div>
  );
}
