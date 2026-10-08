'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import CategoryPills from '@/components/CategoryPills';
import FilterBar from '@/components/FilterBar';
import ListingGrid from '@/components/ListingGrid';
import BarterProposalModal from '@/components/BarterProposalModal';
import BuyCashModal from '@/components/BuyCashModal';
import WhatsAppSimulatorModal from '@/components/WhatsAppSimulatorModal';
import { Listing, SectorCategory, TradeCurrency } from '@/lib/types';
import { Sparkles, MessageCircle } from 'lucide-react';
import { LanguageProvider, useLanguage } from '@/context/LanguageContext';

function MarketplaceContent() {
  const { t } = useLanguage();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SectorCategory | 'all'>('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedCurrency, setSelectedCurrency] = useState<TradeCurrency | 'all'>('all');
  const [barterOnly, setBarterOnly] = useState(false);
  const [harvestReady, setHarvestReady] = useState(false);

  // Modals
  const [activeBarterListing, setActiveBarterListing] = useState<Listing | null>(null);
  const [activeBuyListing, setActiveBuyListing] = useState<Listing | null>(null);
  const [whatsAppOpen, setWhatsAppOpen] = useState(false);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedLocation !== 'all') params.append('location', selectedLocation);
      if (selectedCurrency !== 'all') params.append('currency', selectedCurrency);
      if (searchTerm.trim()) params.append('search', searchTerm.trim());
      if (barterOnly) params.append('barterOnly', 'true');
      if (harvestReady) params.append('harvestReady', 'true');

      const res = await fetch(`/api/listings?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        let combined = data.listings || [];
        if (typeof window !== 'undefined') {
          try {
            const localStored = localStorage.getItem('zimbarter_live_listings');
            if (localStored) {
              const parsed = JSON.parse(localStored);
              if (Array.isArray(parsed) && parsed.length > 0) {
                const existingIds = new Set(combined.map((l: Listing) => l.id));
                const missing = parsed.filter((l: Listing) => !existingIds.has(l.id));
                combined = [...missing, ...combined];
              }
            }
          } catch (e) {
            console.warn('Local listings merge warning:', e);
          }
        }
        setListings(combined);
      }
    } catch (err) {
      console.error('Failed to fetch listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [selectedCategory, selectedLocation, selectedCurrency, searchTerm, barterOnly, harvestReady]);

  const hasActiveFilters = useMemo(() => {
    return (
      selectedCategory !== 'all' ||
      selectedLocation !== 'all' ||
      selectedCurrency !== 'all' ||
      searchTerm.trim().length > 0 ||
      barterOnly ||
      harvestReady
    );
  }, [selectedCategory, selectedLocation, selectedCurrency, searchTerm, barterOnly, harvestReady]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedLocation('all');
    setSelectedCurrency('all');
    setSearchTerm('');
    setBarterOnly(false);
    setHarvestReady(false);
  };

  return (
    <main className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070d09] text-slate-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar onOpenWhatsApp={() => setWhatsAppOpen(true)} />

      {/* Hero */}
      <HeroSection
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onOpenWhatsApp={() => setWhatsAppOpen(true)}
      />

      {/* Main Feed */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 pb-28 sm:pb-12 w-full flex-1">
        <div className="mb-3.5">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-display font-bold text-lg sm:text-xl text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Zimbabwe Core Sectors</span>
            </h2>
          </div>
          <CategoryPills
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        <FilterBar
          selectedLocation={selectedLocation}
          onSelectLocation={setSelectedLocation}
          selectedCurrency={selectedCurrency}
          onSelectCurrency={setSelectedCurrency}
          barterOnly={barterOnly}
          onToggleBarterOnly={setBarterOnly}
          harvestReady={harvestReady}
          onToggleHarvestReady={setHarvestReady}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
        />

        <ListingGrid
          listings={listings}
          loading={loading}
          onProposeBarter={(listing) => setActiveBarterListing(listing)}
          onBuyCash={(listing) => setActiveBuyListing(listing)}
          onResetFilters={handleResetFilters}
        />
      </div>

      {/* Cash Buy Order Modal */}
      <BuyCashModal
        listing={activeBuyListing}
        onClose={() => setActiveBuyListing(null)}
      />

      {/* Barter Proposal Modal */}
      <BarterProposalModal
        listing={activeBarterListing}
        onClose={() => setActiveBarterListing(null)}
      />
    </main>
  );
}

export default function HomePage() {
  return <MarketplaceContent />;
}
