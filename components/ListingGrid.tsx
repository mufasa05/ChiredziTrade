'use client';

import React from 'react';
import { Listing } from '@/lib/types';
import ListingCard from './ListingCard';
import { Tractor, RefreshCw } from 'lucide-react';
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
          <div key={i} className="h-96 rounded-2xl bg-lowveld-950/60 border border-lowveld-900 animate-pulse flex flex-col justify-between p-4">
            <div className="h-48 rounded-xl bg-lowveld-900/60" />
            <div className="space-y-2 mt-4">
              <div className="h-4 rounded bg-lowveld-900/80 w-3/4" />
              <div className="h-3 rounded bg-lowveld-900/50 w-full" />
            </div>
            <div className="h-9 rounded-xl bg-lowveld-900/80 mt-4" />
          </div>
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="py-16 text-center glass-panel rounded-3xl p-8 max-w-lg mx-auto border border-lowveld-800">
        <div className="w-16 h-16 rounded-2xl bg-lowveld-900/80 flex items-center justify-center text-emerald-400 mx-auto mb-4 border border-lowveld-700">
          <Tractor className="w-8 h-8" />
        </div>
        <h3 className="font-display font-bold text-xl text-white mb-2">
          No Lowveld Trade Matches Found
        </h3>
        <p className="text-sm text-gray-400 mb-6">
          Try loosening your sector, location, or search keywords. You can also post what you need directly on our WhatsApp bot.
        </p>
        <button
          onClick={onResetFilters}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all inline-flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Show All Listings</span>
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs sm:text-sm text-gray-400">
          {t.showingListings} <span className="text-emerald-400 font-bold">{listings.length}</span> {t.activeTradeOffers}
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
