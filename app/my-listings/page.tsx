'use client';

import React, { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import { Listing } from '@/lib/types';
import {
  Tag,
  PlusCircle,
  Eye,
  CheckCircle2,
  Clock,
  MoreVertical,
  Edit3,
  Trash2,
  RefreshCw,
  ShoppingBag,
  Share2,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

export default function MyListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'sold' | 'barter'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/listings');
        const data = await res.json();
        if (data.success) {
          // Show user's listings (Prince A. Shumba demo + any user created)
          setListings(data.listings || []);
        }
      } catch (err) {
        console.error('Failed to load listings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'sold' : 'active';
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: nextStatus as any } : l))
    );
  };

  const filteredListings = listings.filter((l) => {
    if (filter === 'active' && l.status !== 'active') return false;
    if (filter === 'sold' && l.status !== 'sold') return false;
    if (filter === 'barter' && !l.openToBarter && l.currency !== 'BARTER') return false;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      return (
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        (l.barterTerms || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const activeCount = listings.filter((l) => l.status === 'active').length;
  const soldCount = listings.filter((l) => l.status === 'sold').length;
  const barterCount = listings.filter((l) => l.openToBarter || l.currency === 'BARTER').length;

  return (
    <AppShell activeNav="My Listings">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#062A22] p-6 rounded-3xl border border-slate-200 dark:border-[#0e4337] shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#059669] mb-1">
              <Tag className="w-4 h-4" />
              <span>Seller Inventory Management</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white">
              My Listings
            </h1>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
              Manage your active marketplace products, bilateral barter offerings, stock availability, and status.
            </p>
          </div>

          <Link
            href="/post"
            className="px-5 py-3 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md hover:scale-105 transition-all shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Listing</span>
          </Link>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0c1813] border border-slate-200 dark:border-[#0e4337]">
            <span className="text-xs font-semibold text-slate-500 dark:text-gray-400">Total Items</span>
            <p className="font-display font-black text-2xl text-slate-900 dark:text-white mt-1">
              {listings.length}
            </p>
            <span className="text-[10px] text-slate-400">Cataloged in store</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#0c1813] border border-slate-200 dark:border-[#0e4337]">
            <span className="text-xs font-semibold text-slate-500 dark:text-gray-400">Active Online</span>
            <p className="font-display font-black text-2xl text-emerald-600 dark:text-emerald-400 mt-1">
              {activeCount}
            </p>
            <span className="text-[10px] text-emerald-600">Available to buyers</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#0c1813] border border-slate-200 dark:border-[#0e4337]">
            <span className="text-xs font-semibold text-slate-500 dark:text-gray-400">Completed &amp; Sold</span>
            <p className="font-display font-black text-2xl text-purple-600 dark:text-purple-400 mt-1">
              {soldCount}
            </p>
            <span className="text-[10px] text-purple-600">Closed transactions</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#0c1813] border border-slate-200 dark:border-[#0e4337]">
            <span className="text-xs font-semibold text-slate-500 dark:text-gray-400">Open to Barter</span>
            <p className="font-display font-black text-2xl text-amber-600 dark:text-amber-400 mt-1">
              {barterCount}
            </p>
            <span className="text-[10px] text-amber-600">Bilateral swaps</span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-3 bg-white dark:bg-[#0c1813] rounded-2xl border border-slate-200 dark:border-[#0e4337] flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {(['all', 'active', 'sold', 'barter'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                  filter === tab
                    ? 'bg-[#059669] text-white shadow-sm'
                    : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#0a3a30]'
                }`}
              >
                {tab === 'all' ? `All (${listings.length})` : tab === 'active' ? `Active (${activeCount})` : tab === 'sold' ? `Sold (${soldCount})` : `Barter (${barterCount})`}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Search my listings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-50 dark:bg-[#041d18] border border-slate-200 dark:border-[#0e4337] text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 max-w-xs"
          />
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-[#059669] mx-auto mb-2" />
            <p className="text-xs text-slate-500 dark:text-gray-400">Loading your inventory...</p>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-[#0c1813] rounded-3xl border border-slate-200 dark:border-[#0e4337] p-8">
            <Tag className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-40" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">No Listings Found</h3>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
              You haven't listed any items under this filter yet. Create a listing to reach buyers across Zimbabwe.
            </p>
            <Link
              href="/post"
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#059669] text-white text-xs font-bold shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post an Item</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredListings.map((item) => {
              const isActive = item.status === 'active';

              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-[#0c1813] rounded-3xl border border-slate-200 dark:border-[#0e4337] overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all"
                >
                  <div>
                    {/* Image Header */}
                    <div className="relative h-44 w-full bg-slate-100 dark:bg-[#041d18] overflow-hidden">
                      <img
                        src={item.imageUrls[0] || 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800&auto=format&fit=crop&q=80'}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            isActive
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-800/90 text-gray-200'
                          }`}
                        >
                          {isActive ? 'Active Online' : 'Sold / Inactive'}
                        </span>
                        {item.openToBarter && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/90 text-slate-950">
                            Barter Open
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-gray-400">
                        <span>{item.locationArea}</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {item.currency === 'BARTER' ? 'Barter Only' : `${item.currency} $${item.price || 0}`}
                        </span>
                      </div>

                      <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1">
                        {item.title}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-gray-400 line-clamp-2">
                        {item.description}
                      </p>

                      {item.barterTerms && (
                        <div className="p-2 rounded-xl bg-amber-50/60 dark:bg-[#041d18] border border-amber-200/60 dark:border-[#0e4337] text-[11px] text-amber-800 dark:text-[#F5C542]">
                          <b>Barter Terms:</b> {item.barterTerms}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-4 pt-2 border-t border-slate-100 dark:border-[#0e4337]/50 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleToggleStatus(item.id, item.status)}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-slate-100 dark:bg-[#041d18] hover:bg-slate-200 text-slate-700 dark:text-gray-300'
                          : 'bg-[#059669] hover:bg-[#047857] text-white'
                      }`}
                    >
                      {isActive ? 'Mark as Sold' : 'Re-activate'}
                    </button>

                    <Link
                      href={`/listing/${item.id}`}
                      className="p-2 rounded-xl border border-slate-200 dark:border-[#0e4337] text-slate-600 dark:text-gray-400 hover:text-[#059669] hover:border-[#059669] transition-colors"
                      title="View Public Page"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}

