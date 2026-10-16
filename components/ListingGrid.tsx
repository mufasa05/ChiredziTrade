'use client';

import React from 'react';
import { Listing } from '@/lib/types';
import ListingCard from './ListingCard';
import { Store, RefreshCw, Plus } from 'lucide-react';
import Link from 'next/link';

interface ListingGridProps {
  listings: Listing[];
  loading?: boolean;
  viewMode?: 'grid' | 'list';
  onProposeBarter: (listing: Listing) => void;
  onBuyCash?: (listing: Listing) => void;
  onResetFilters: () => void;
  favoritedIds?: Set<string>;
  onToggleFavorite?: (listing: Listing) => void;
}

export default function ListingGrid({
  listings,
  loading,
  viewMode = 'grid',
  onProposeBarter,
  onBuyCash,
  onResetFilters,
  favoritedIds = new Set(),
  onToggleFavorite,
}: ListingGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="rounded-2xl bg-white dark:bg-[#0c1813] border border-[#E2E8E4] dark:border-[#0e4337] overflow-hidden p-3 space-y-3 animate-pulse shadow-sm"
          >
            <div className="aspect-[4/3] rounded-xl bg-slate-200 dark:bg-[#062A22]" />
            <div className="h-4 rounded bg-slate-200 dark:bg-[#062A22] w-3/4" />
            <div className="h-4 rounded bg-slate-100 dark:bg-[#062A22]/60 w-1/2" />
            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="h-8 rounded-xl bg-slate-200 dark:bg-[#062A22]" />
              <div className="h-8 rounded-xl bg-slate-200 dark:bg-[#062A22]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="py-16 text-center bg-white dark:bg-[#0c1813] rounded-3xl p-8 max-w-lg mx-auto border border-[#E2E8E4] dark:border-[#0e4337] shadow-lg">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-[#059669] mx-auto mb-3.5 border border-emerald-500/30 shadow-md">
          <Store className="w-7 h-7" />
        </div>
        <h3 className="font-display font-black text-lg sm:text-xl text-slate-900 dark:text-white mb-2">
          No Listings Found In This Filter
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400 mb-6 max-w-sm mx-auto leading-relaxed">
          Be the first to list agricultural produce, electronics, accommodation, or services for cash or barter.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
          <Link
            href="/post"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs sm:text-sm shadow-md transition-all inline-flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Post a Listing</span>
          </Link>
          <button
            onClick={onResetFilters}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#062A22] hover:bg-slate-200 dark:hover:bg-[#0a3a30] text-slate-700 dark:text-gray-300 font-semibold text-xs sm:text-sm border border-[#E2E8E4] dark:border-[#0e4337] transition-all inline-flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      {/* Header matching reference picture */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-slate-600 dark:text-gray-300 px-0.5 font-medium">
        <p>
          Showing <span className="font-bold text-emerald-600 dark:text-[#10b981]">{listings.length}</span> active trade offers across Zimbabwe
        </p>
      </div>

      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4'
            : 'grid grid-cols-1 gap-3'
        }
      >
        {listings.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            isFavorited={favoritedIds.has(listing.id)}
            onToggleFavorite={onToggleFavorite}
            onProposeBarter={onProposeBarter}
            onBuyCash={onBuyCash}
          />
        ))}
      </div>
    </div>
  );
}
