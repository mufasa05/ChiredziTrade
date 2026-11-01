'use client';

import React, { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import AuthGate from '@/components/AuthGate';
import ListingGrid from '@/components/ListingGrid';
import BarterProposalModal from '@/components/BarterProposalModal';
import BuyCashModal from '@/components/BuyCashModal';
import { Listing } from '@/lib/types';
import {
  Heart,
  Bookmark,
  Search,
  Sparkles,
  ShoppingBag,
  RefreshCw,
  ArrowRight,
  Trash2,
  Filter
} from 'lucide-react';
import Link from 'next/link';

export default function FavouritesPage() {
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [favoritedIds, setFavoritedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'barter' | 'cash'>('all');

  // Modals
  const [activeBarterListing, setActiveBarterListing] = useState<Listing | null>(null);
  const [activeBuyListing, setActiveBuyListing] = useState<Listing | null>(null);

  // Load favorites & listings
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        let savedIds = new Set<string>();
        if (typeof window !== 'undefined') {
          const saved = localStorage.getItem('zimbarter_favorites');
          if (saved) {
            try {
              savedIds = new Set(JSON.parse(saved));
            } catch (e) {
              console.error('Error parsing favorites:', e);
            }
          }
        }
        setFavoritedIds(savedIds);

        const res = await fetch('/api/listings');
        const data = await res.json();
        if (data.success && Array.isArray(data.listings)) {
          setAllListings(data.listings);
        }
      } catch (err) {
        console.error('Failed to load listings for favorites:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleToggleFavorite = (listing: Listing) => {
    setFavoritedIds((prev) => {
      const next = new Set(prev);
      if (next.has(listing.id)) {
        next.delete(listing.id);
      } else {
        next.add(listing.id);
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('zimbarter_favorites', JSON.stringify(Array.from(next)));
      }
      return next;
    });
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to remove all saved listings?')) {
      setFavoritedIds(new Set());
      if (typeof window !== 'undefined') {
        localStorage.removeItem('zimbarter_favorites');
      }
    }
  };

  // Filter listings based on favorited IDs
  const savedListings = allListings.filter((item) => favoritedIds.has(item.id));

  const filteredListings = savedListings.filter((l) => {
    if (filterType === 'barter' && !l.openToBarter && l.currency !== 'BARTER') return false;
    if (filterType === 'cash' && l.currency === 'BARTER') return false;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      return (
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.locationArea.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Recommended items when empty
  const recommendedItems = allListings.slice(0, 4);

  return (
    <AppShell activeNav="Favourites">
      <AuthGate
        featureName="Favourites & Saved Trades"
        description="Saved watchlists and bookmarked listings are tied to your personal trader account. Sign in to track items and receive price drop alerts."
        icon={Heart}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#062A22] p-6 rounded-3xl border border-slate-200 dark:border-[#0e4337] shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#059669] mb-1">
              <Heart className="w-4 h-4 fill-emerald-500 text-emerald-500" />
              <span>SAVED TRADES & WATCHLIST</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Favourites
            </h1>
            <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
              Track bookmarked livestock, machinery, produce, and trade opportunities in one place.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {savedListings.length > 0 && (
              <button
                onClick={handleClearAll}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-950/70 border border-rose-200 dark:border-rose-900/50 rounded-xl transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear Watchlist
              </button>
            )}
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#059669] hover:bg-[#047857] text-white text-sm font-semibold rounded-2xl shadow-sm transition"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Marketplace</span>
            </Link>
          </div>
        </div>

        {/* Filter bar */}
        {savedListings.length > 0 && (
          <div className="bg-white dark:bg-[#062A22] p-4 rounded-2xl border border-slate-200 dark:border-[#0e4337] shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search saved items..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-[#0c1813] border border-slate-200 dark:border-[#0e4337] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-gray-200"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  filterType === 'all'
                    ? 'bg-[#059669] text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-[#0c1813] text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-[#0e4337]'
                }`}
              >
                All Saved ({savedListings.length})
              </button>
              <button
                onClick={() => setFilterType('barter')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  filterType === 'barter'
                    ? 'bg-[#059669] text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-[#0c1813] text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-[#0e4337]'
                }`}
              >
                Barter Eligible
              </button>
              <button
                onClick={() => setFilterType('cash')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  filterType === 'cash'
                    ? 'bg-[#059669] text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-[#0c1813] text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-[#0e4337]'
                }`}
              >
                Cash Only
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <ListingGrid
            listings={[]}
            loading={true}
            onProposeBarter={() => {}}
            onResetFilters={() => {}}
          />
        ) : savedListings.length === 0 ? (
          /* High-standard empty state */
          <div className="bg-white dark:bg-[#062A22] rounded-3xl border border-slate-200 dark:border-[#0e4337] p-8 md:p-14 text-center max-w-3xl mx-auto shadow-sm space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/40 text-[#059669] mx-auto flex items-center justify-center shadow-inner">
              <Bookmark className="w-8 h-8 stroke-[1.75]" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Your watchlist is currently empty
              </h2>
              <p className="text-sm text-slate-500 dark:text-gray-400">
                Bookmark items while browsing to monitor price adjustments, barter offers, and inventory updates.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/marketplace"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#059669] hover:bg-[#047857] text-white text-sm font-semibold rounded-2xl shadow-sm transition"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Explore Marketplace</span>
              </Link>
              <Link
                href="/barter-network"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-[#0c1813] hover:bg-slate-200 dark:hover:bg-[#0e4337] text-slate-700 dark:text-gray-200 text-sm font-semibold rounded-2xl border border-slate-200 dark:border-[#0e4337] transition"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Barter Network</span>
              </Link>
            </div>

            {/* Featured Recommendations */}
            {recommendedItems.length > 0 && (
              <div className="pt-8 border-t border-slate-100 dark:border-[#0e4337] text-left">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Recommended for You
                    </h3>
                  </div>
                  <Link
                    href="/marketplace"
                    className="text-xs font-semibold text-[#059669] hover:underline flex items-center gap-1"
                  >
                    View all <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {recommendedItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-50 dark:bg-[#0c1813] border border-slate-200 dark:border-[#0e4337] rounded-2xl p-3 flex flex-col justify-between group hover:border-emerald-500/40 transition"
                    >
                      <div>
                        {item.imageUrls && item.imageUrls[0] ? (
                          <img
                            src={item.imageUrls[0]}
                            alt={item.title}
                            className="w-full h-32 object-cover rounded-xl mb-2.5"
                          />
                        ) : (
                          <div className="w-full h-32 bg-slate-200 dark:bg-[#062A22] rounded-xl mb-2.5 flex items-center justify-center text-slate-400 text-xs">
                            No image
                          </div>
                        )}
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                          {item.locationArea}
                        </p>
                      </div>

                      <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-200 dark:border-[#0e4337]/60">
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          {item.currency === 'BARTER'
                            ? 'Barter Swap'
                            : `${item.currency} $${item.price || 0}`}
                        </span>
                        <button
                          onClick={() => handleToggleFavorite(item)}
                          className="p-1.5 rounded-lg bg-white dark:bg-[#062A22] border border-slate-200 dark:border-[#0e4337] text-slate-600 dark:text-gray-300 hover:text-emerald-500 transition"
                          title="Save to watchlist"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <ListingGrid
            listings={filteredListings}
            loading={false}
            onProposeBarter={(listing) => setActiveBarterListing(listing)}
            onBuyCash={(listing) => setActiveBuyListing(listing)}
            onResetFilters={() => {
              setSearch('');
              setFilterType('all');
            }}
            favoritedIds={favoritedIds}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
      </div>

      {/* Barter Proposal Modal */}
      {activeBarterListing && (
        <BarterProposalModal
          listing={activeBarterListing}
          isOpen={!!activeBarterListing}
          onClose={() => setActiveBarterListing(null)}
        />
      )}

      {/* Buy Cash Modal */}
      {activeBuyListing && (
        <BuyCashModal
          listing={activeBuyListing}
          isOpen={!!activeBuyListing}
          onClose={() => setActiveBuyListing(null)}
        />
      )}
    </AuthGate>
  </AppShell>
);
}
