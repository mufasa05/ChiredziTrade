'use client';

import React, { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import HeroSection from '@/components/HeroSection';
import CategoryPills from '@/components/CategoryPills';
import ListingGrid from '@/components/ListingGrid';
import MarketplaceSidebar from '@/components/MarketplaceSidebar';
import ServiceProviderCatalog from '@/components/ServiceProviderCatalog';
import BarterProposalModal from '@/components/BarterProposalModal';
import BuyCashModal from '@/components/BuyCashModal';
import { Listing, SectorCategory, TradeCurrency } from '@/lib/types';
import Link from 'next/link';
import { ArrowUpDown, Grid, List, Sparkles, Wrench, ShoppingBag, MapPin, ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function HomePage() {
  const { t } = useLanguage();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  // Main Page View Mode:
  // 'home': Exact match to screenshot (Hero + Categories + Promo Banner, fitting without scroll)
  // 'marketplace': Screen 2 of design specification (Explore Marketplace + Filter tabs + 4-col listing grid + right sidebar)
  // 'catalog': Service Providers & Artisans Catalog with rate cards & WhatsApp generator
  const [activeView, setActiveView] = useState<'home' | 'marketplace' | 'catalog'>('home');

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SectorCategory | 'all'>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('All Zimbabwe');
  const [selectedCurrency, setSelectedCurrency] = useState<TradeCurrency | 'all'>('all');
  const [tradeFilter, setTradeFilter] = useState<'all' | 'for_sale' | 'for_trade' | 'services' | 'catalog' | 'rooms' | 'jobs'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'price_low' | 'price_high'>('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Favorites
  const [favoritedIds, setFavoritedIds] = useState<Set<string>>(new Set());

  // Modals
  const [activeBarterListing, setActiveBarterListing] = useState<Listing | null>(null);
  const [activeBuyListing, setActiveBuyListing] = useState<Listing | null>(null);

  // Load saved favorites
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('zimbarter_favorites');
        if (saved) {
          setFavoritedIds(new Set(JSON.parse(saved)));
        }
      } catch (e) {
        console.warn('Failed to load favorites:', e);
      }
    }
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

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedLocation && selectedLocation !== 'all' && selectedLocation !== 'All Zimbabwe') {
        params.append('location', selectedLocation);
      }
      if (selectedCurrency !== 'all') params.append('currency', selectedCurrency);
      if (searchTerm.trim()) params.append('search', searchTerm.trim());
      if (tradeFilter === 'for_trade') params.append('barterOnly', 'true');

      const res = await fetch(`/api/listings?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        let items: Listing[] = data.listings || [];

        // Apply secondary in-memory filters for trade tabs
        if (tradeFilter === 'for_sale') {
          items = items.filter((l) => l.currency !== 'BARTER' && l.listingType !== 'for_trade');
        } else if (tradeFilter === 'for_trade') {
          items = items.filter((l) => l.currency === 'BARTER' || l.openToBarter || l.listingType === 'for_trade');
        } else if (tradeFilter === 'services') {
          items = items.filter(
            (l) =>
              l.listingType === 'services' ||
              l.conditionGrade === 'Service Showcase' ||
              l.category === 'industrial_services' ||
              l.category === 'general_services'
          );
        } else if (tradeFilter === 'rooms') {
          items = items.filter((l) => l.category === 'properties' || l.listingType === 'for_rent');
        } else if (tradeFilter === 'jobs') {
          items = items.filter((l) => l.category === 'jobs');
        }

        // Sorting
        if (sortBy === 'price_low') {
          items.sort((a, b) => (a.price || 0) - (b.price || 0));
        } else if (sortBy === 'price_high') {
          items.sort((a, b) => (b.price || 0) - (a.price || 0));
        }

        setListings(items);
      }
    } catch (err) {
      console.error('Failed to fetch listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [selectedCategory, selectedLocation, selectedCurrency, searchTerm, tradeFilter, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedLocation('All Zimbabwe');
    setSelectedCurrency('all');
    setSearchTerm('');
    setTradeFilter('all');
    setSortBy('recent');
  };

  const tradeTabs = [
    { id: 'all', label: 'All' },
    { id: 'for_sale', label: 'For Sale' },
    { id: 'for_trade', label: 'For Trade' },
    { id: 'services', label: 'Services' },
    { id: 'catalog', label: 'Service Providers Catalog' },
    { id: 'rooms', label: 'Rooms & Stays' },
    { id: 'jobs', label: 'Jobs' },
  ];

  // Handle sidebar navigation selection
  const handleSelectNav = (item: string) => {
    if (item === 'Home') {
      setActiveView('home');
    } else if (item === 'Marketplace') {
      setActiveView('marketplace');
    } else if (item === 'Categories') {
      setActiveView('home');
      const el = document.getElementById('categories');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AppShell
      activeNav={activeView === 'home' ? 'Home' : activeView === 'marketplace' ? 'Marketplace' : ''}
      onSelectNav={handleSelectNav}
      searchTerm={searchTerm}
      onSearchChange={(val) => {
        setSearchTerm(val);
        if (val.trim()) {
          setActiveView('marketplace');
        }
      }}
      selectedLocation={selectedLocation}
      onSelectLocation={setSelectedLocation}
      favoritesCount={favoritedIds.size}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4 w-full space-y-4">
        {/* Top View Selector Bar */}
        <div className="flex items-center justify-between border-b border-[#E2E8E4] dark:border-[#0e4337] pb-2">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => { setActiveView('home'); setTradeFilter('all'); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeView === 'home'
                  ? 'bg-[#059669] text-white shadow-sm'
                  : 'bg-white dark:bg-[#0c1813] text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-[#12241d] border border-[#E2E8E4] dark:border-[#0e4337]'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => { setActiveView('marketplace'); setTradeFilter('all'); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                activeView === 'marketplace'
                  ? 'bg-[#059669] text-white shadow-sm'
                  : 'bg-white dark:bg-[#0c1813] text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-[#12241d] border border-[#E2E8E4] dark:border-[#0e4337]'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Explore Marketplace</span>
            </button>
            <button
              onClick={() => { setActiveView('catalog'); setTradeFilter('catalog'); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeView === 'catalog' || tradeFilter === 'catalog'
                  ? 'bg-amber-600 dark:bg-amber-500 text-white shadow-sm'
                  : 'bg-white dark:bg-[#0c1813] text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-[#12241d] border border-[#E2E8E4] dark:border-[#0e4337]'
              }`}
            >
              <Wrench className="w-3.5 h-3.5 text-amber-500 dark:text-amber-300" />
              <span>Service Providers Catalog</span>
            </button>
          </div>

          <span className="text-[11px] text-slate-500 dark:text-gray-400 hidden sm:flex sm:items-center sm:gap-1">
            <MapPin className="w-3 h-3 text-emerald-600" />
            <span>{selectedLocation === 'all' ? 'All Zimbabwe' : selectedLocation} • Active Market</span>
          </span>
        </div>

        {/* =========================================================================
            VIEW 1: HOME PAGE (EXACT SCREENSHOT MATCH)
            Hero banner with Zimbabwean farmer, search, 4 pills, tags, floating trust cards,
            and Category Tiles row + Promo banner. Fits comfortably without scrolling!
            ========================================================================= */}
        {activeView === 'home' && (
          <div className="space-y-4">
            <HeroSection
              searchTerm={searchTerm}
              onSearchChange={(val) => {
                setSearchTerm(val);
                setActiveView('marketplace');
              }}
              onSelectListingType={(type) => {
                if (type === 'for_sale') {
                  setTradeFilter('for_sale');
                  setActiveView('marketplace');
                } else if (type === 'for_trade') {
                  setTradeFilter('for_trade');
                  setActiveView('marketplace');
                } else if (type === 'trade_top_up') {
                  setTradeFilter('for_trade');
                  setActiveView('marketplace');
                } else if (type === 'services') {
                  setActiveView('catalog');
                }
              }}
              onQuickPrompt={(prompt) => {
                setSearchTerm(prompt);
                setActiveView('marketplace');
              }}
            />

            {/* Category Row + Promo Banner */}
            <div id="categories">
              <CategoryPills
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) => {
                  if (cat === 'industrial_services') {
                    setActiveView('catalog');
                  } else {
                    setSelectedCategory(cat);
                    setActiveView('marketplace');
                  }
                }}
              />
            </div>

            {/* Dedicated Marketplace Access Gateway */}
            <div className="pt-2 border-t border-slate-200 dark:border-[#0e4337]">
              <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white via-emerald-50/40 to-slate-50 dark:from-[#051c16] dark:via-[#07241d] dark:to-[#031510] border border-slate-200/90 dark:border-emerald-500/20 p-5 sm:p-8 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 text-[11px] font-bold uppercase tracking-wider">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Verified Trade Network • 1,200+ Active Listings</span>
                    </div>
                    <h3 className="font-display font-black text-xl sm:text-2xl text-slate-900 dark:text-white tracking-tight">
                      Ready to Explore Live Listings &amp; Barter Swaps?
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 leading-relaxed">
                      Access verified livestock, agricultural produce, industrial equipment, building materials, and certified artisan services across all 10 provinces.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => setActiveView('marketplace')}
                      className="px-5 py-3 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all hover:scale-[1.01]"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Explore Marketplace</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <Link
                      href="/barter-network"
                      className="px-4 py-3 rounded-xl bg-white dark:bg-[#0b2820] hover:bg-slate-100 dark:hover:bg-[#0f352b] text-slate-800 dark:text-emerald-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-200 dark:border-emerald-500/30 transition-all"
                    >
                      <RefreshCw className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Barter Hub</span>
                    </Link>
                  </div>
                </div>

                {/* Trust Pillar Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 mt-6 border-t border-slate-200/80 dark:border-[#0e4337]">
                  <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-gray-300">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                      01
                    </div>
                    <div>
                      <span className="font-bold block text-slate-900 dark:text-white">Escrow Protection</span>
                      <span className="text-[11px] text-slate-500 dark:text-gray-400">Funds held until mutual physical inspection</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-gray-300">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                      02
                    </div>
                    <div>
                      <span className="font-bold block text-slate-900 dark:text-white">Verified Traders</span>
                      <span className="text-[11px] text-slate-500 dark:text-gray-400">KYC vetted farmers, ranchers &amp; registered artisans</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-gray-300">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                      03
                    </div>
                    <div>
                      <span className="font-bold block text-slate-900 dark:text-white">Multi-Currency Trade</span>
                      <span className="text-[11px] text-slate-500 dark:text-gray-400">Seamless USD cash, ZWG, EcoCash &amp; pure barter</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            VIEW 2: MARKETPLACE VIEW (SCREEN 2 MATCH)
            Direct access to marketplace: 4-column listing grid + right sidebar.
            Accessible directly from top bar, hero buttons, categories, or sidebar!
            ========================================================================= */}
        {activeView === 'marketplace' && (
          <div className="space-y-4 pt-1">
            {/* Header & Filter Tabs */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
              <div>
                <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
                  Explore Marketplace
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 mt-1">
                  Discover amazing products and services from people across Zimbabwe.
                </p>
              </div>

              {/* Sort & View Mode Controls */}
              <div className="flex items-center gap-2 self-start md:self-auto">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#0c1813] border border-[#E2E8E4] dark:border-[#0e4337] text-xs font-semibold text-slate-700 dark:text-gray-300 shadow-sm">
                  <ArrowUpDown className="w-3.5 h-3.5 text-[#059669]" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent focus:outline-none cursor-pointer text-xs"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-white dark:bg-[#0c1813] border border-[#E2E8E4] dark:border-[#0e4337] rounded-xl p-1 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-[#059669] text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
                    }`}
                    aria-label="Grid view"
                  >
                    <Grid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === 'list'
                        ? 'bg-[#059669] text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
                    }`}
                    aria-label="List view"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Trade Filter Tabs: All, For Sale, For Trade, Services, Service Providers Catalog, Rooms & Stays, Jobs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {tradeTabs.map((tab) => {
                const active = tradeFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      if (tab.id === 'catalog') {
                        setActiveView('catalog');
                        setTradeFilter('catalog');
                      } else {
                        setTradeFilter(tab.id as any);
                      }
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 ${
                      active
                        ? 'bg-[#059669] text-white shadow-md'
                        : 'bg-white dark:bg-[#0c1813] text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-[#12241d] border border-[#E2E8E4] dark:border-[#0e4337]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Main Marketplace Layout: 4 columns of cards + Right-Hand Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2 items-start">
              {/* Product Grid (9 cols on large screen) */}
              <div className="lg:col-span-9">
                <ListingGrid
                  listings={listings}
                  loading={loading}
                  viewMode={viewMode}
                  favoritedIds={favoritedIds}
                  onToggleFavorite={handleToggleFavorite}
                  onProposeBarter={(item) => setActiveBarterListing(item)}
                  onBuyCash={(item) => setActiveBuyListing(item)}
                  onResetFilters={handleResetFilters}
                />
              </div>

              {/* Right Sidebar: Popular Categories & Trade Without Limits Banner (3 cols) */}
              <div className="lg:col-span-3">
                <MarketplaceSidebar
                  selectedCategory={selectedCategory}
                  onSelectCategory={(cat) => {
                    setSelectedCategory(cat);
                    if (cat === 'industrial_services') {
                      setActiveView('catalog');
                    }
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            VIEW 3: SERVICE PROVIDERS & ARTISANS CATALOG
            Dedicated catalog with rate cards, verified badges, and WhatsApp generator
            ========================================================================= */}
        {activeView === 'catalog' && (
          <ServiceProviderCatalog />
        )}
      </div>

      {/* Modals */}
      {activeBarterListing && (
        <BarterProposalModal
          isOpen={!!activeBarterListing}
          listing={activeBarterListing}
          onClose={() => {
            setActiveBarterListing(null);
            fetchListings();
          }}
        />
      )}

      {activeBuyListing && (
        <BuyCashModal
          isOpen={!!activeBuyListing}
          listing={activeBuyListing}
          onClose={() => {
            setActiveBuyListing(null);
            fetchListings();
          }}
        />
      )}
    </AppShell>
  );
}
