'use client';

import React, { useState, useEffect, useMemo } from 'react';
import AppShell from '@/components/AppShell';
import BarterProposalModal from '@/components/BarterProposalModal';
import { Listing, BarterProposal, BarterMatch } from '@/lib/types';
import {
  RefreshCw,
  MapPin,
  CheckCircle2,
  Inbox,
  Send,
  SlidersHorizontal,
  Clock,
  ShieldCheck,
  PlusCircle,
  XCircle,
  MessageSquare,
  Search,
  Sparkles,
  ArrowRightLeft,
  Check,
  Phone,
  FileCheck,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatBarterResponseUrl } from '@/lib/whatsapp-messages';
import Link from 'next/link';

interface IncomingTradeItem {
  id: string;
  listingId?: string;
  listingTitle: string;
  proposerName: string;
  proposerLocation: string;
  proposerPhone: string;
  offeredItem: string;
  offeredDescription?: string;
  cashTopUp?: string;
  status: 'pending' | 'accepted' | 'declined';
  date: string;
}

const DEFAULT_INCOMING: IncomingTradeItem[] = [
  {
    id: 'prop-1',
    listingId: 'zim-broiler-01',
    listingTitle: 'Broiler farming (Metra Poultry)',
    proposerName: 'Simba Chauke',
    proposerLocation: 'Triangle Estate',
    proposerPhone: '+263783237918',
    offeredItem: '2 Bags of Compound D Fertilizer + 50kg Maize Grain',
    offeredDescription: 'Unopened sealed bags from Windmill, stored dry.',
    cashTopUp: 'US$ 10.00',
    status: 'pending',
    date: '2 hours ago',
  },
  {
    id: 'prop-2',
    listingId: 'zim-solar-03',
    listingTitle: 'Solar Inverter & Lithium Battery (5kVA)',
    proposerName: 'Tinashe Musarurwa',
    proposerLocation: 'Harare CBD',
    proposerPhone: '+263783237918',
    offeredItem: 'Solar Submersible Borehole Inverter Pump (1.5HP) + 2 Solar Panels',
    offeredDescription: 'Brand new in crate with MPPT controller and DC cables.',
    cashTopUp: 'US$ 450.00',
    status: 'pending',
    date: '5 hours ago',
  },
  {
    id: 'prop-3',
    listingId: 'zim-broiler-01',
    listingTitle: 'Broiler farming (Metra Poultry)',
    proposerName: 'Farai Ncube',
    proposerLocation: 'Masvingo',
    proposerPhone: '+263783237918',
    offeredItem: '3 Boer Goat Does (Young breeding stock, vaccinated)',
    offeredDescription: 'Ear-tagged, dipping records available from veterinary department.',
    cashTopUp: '',
    status: 'pending',
    date: 'Yesterday',
  },
];

const DEFAULT_SENT: BarterProposal[] = [
  {
    id: 'sent-demo-1',
    listingId: 'zim-solar-03',
    listingTitle: 'Solar Inverter & Lithium Battery (5kVA)',
    sellerName: 'Prince A. Shumba',
    sellerPhone: '+263783237918',
    proposerName: 'Lowveld Rancher',
    proposerPhone: '+263783237918',
    proposerLocation: 'Triangle Estate',
    offeredItemTitle: '4 Brahman Cross Heifers (Polled, 18 months)',
    offeredDescription: 'Healthy grass-fed stock with veterinary clearance and brand certificates.',
    cashTopUp: '+$200 USD',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600 * 1000 * 6).toISOString(),
  },
];

export default function BarterHubPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [activeTab, setActiveTab] = useState<'discover' | 'matchmaker' | 'incoming' | 'sent' | 'active'>('discover');
  const [activeModalListing, setActiveModalListing] = useState<Listing | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  // Matchmaker state
  const [selectedMatchListingId, setSelectedMatchListingId] = useState<string>('');
  const [matchResults, setMatchResults] = useState<BarterMatch[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(false);

  // Proposals & Active Trades state
  const [incomingOffers, setIncomingOffers] = useState<IncomingTradeItem[]>(DEFAULT_INCOMING);
  const [sentOffers, setSentOffers] = useState<BarterProposal[]>(DEFAULT_SENT);
  const [completedTradeIds, setCompletedTradeIds] = useState<string[]>([]);

  // Load barter listings
  useEffect(() => {
    const fetchBarterListings = async () => {
      setLoadingListings(true);
      try {
        const res = await fetch('/api/listings?barterOnly=true');
        const data = await res.json();
        if (data.success && data.listings) {
          setListings(data.listings);
          if (data.listings.length > 0) {
            setSelectedMatchListingId(data.listings[0].id);
          }
        }
      } catch (e) {
        console.error('Failed to load barter listings:', e);
      } finally {
        setLoadingListings(false);
      }
    };
    fetchBarterListings();
  }, []);

  // Load sent proposals from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedSent = localStorage.getItem('zimbarter_sent_proposals');
        if (storedSent) {
          const parsed = JSON.parse(storedSent);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSentOffers(parsed);
          }
        }
        const storedCompleted = localStorage.getItem('zimbarter_completed_trades');
        if (storedCompleted) {
          setCompletedTradeIds(JSON.parse(storedCompleted));
        }
      } catch (e) {
        console.warn('Failed to load sent proposals:', e);
      }
    }
  }, []);

  // Run matchmaker when target listing changes
  useEffect(() => {
    if (!selectedMatchListingId) return;

    const fetchMatches = async () => {
      setLoadingMatches(true);
      try {
        const res = await fetch(`/api/barter/match?listingId=${encodeURIComponent(selectedMatchListingId)}`);
        const data = await res.json();
        if (data.success) {
          setMatchResults(data.matches || []);
        } else {
          setMatchResults([]);
        }
      } catch (err) {
        console.error('Error fetching barter matches:', err);
        setMatchResults([]);
      } finally {
        setLoadingMatches(false);
      }
    };

    fetchMatches();
  }, [selectedMatchListingId]);

  // Filtered barter listings
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (selectedLocation !== 'all' && !item.locationArea.toLowerCase().includes(selectedLocation.toLowerCase())) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = item.title.toLowerCase().includes(q);
        const inDesc = item.description.toLowerCase().includes(q);
        const inTerms = (item.barterTerms || '').toLowerCase().includes(q);
        const inTags = (item.imageTags || []).some((t) => t.toLowerCase().includes(q));
        if (!inTitle && !inDesc && !inTerms && !inTags) return false;
      }
      return true;
    });
  }, [listings, selectedCategory, selectedLocation, searchQuery]);

  // Derived counts
  const pendingIncomingCount = incomingOffers.filter((o) => o.status === 'pending').length;
  const acceptedIncomingTrades = incomingOffers.filter((o) => o.status === 'accepted');
  const acceptedSentTrades = sentOffers.filter((o) => o.status === 'accepted');
  const activeTradesCount = acceptedIncomingTrades.length + acceptedSentTrades.length;

  const handleAcceptOffer = async (id: string) => {
    setIncomingOffers((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: 'accepted' } : o))
    );

    // Call API to persist
    try {
      await fetch('/api/barter/propose', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposalId: id, status: 'accepted' }),
      });
    } catch (e) {
      console.warn('Failed to update proposal status on server:', e);
    }

    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  };

  const handleDeclineOffer = async (id: string) => {
    setIncomingOffers((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: 'declined' } : o))
    );

    try {
      await fetch('/api/barter/propose', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposalId: id, status: 'declined' }),
      });
    } catch (e) {
      console.warn('Failed to update proposal status on server:', e);
    }
  };

  const handleMarkTradeComplete = (tradeId: string) => {
    const updated = [...completedTradeIds, tradeId];
    setCompletedTradeIds(updated);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('zimbarter_completed_trades', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
    }
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
  };

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 w-full space-y-6">
        {/* Hub Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#062A22] via-[#041d18] to-[#0a3a30] text-white p-6 sm:p-8 rounded-3xl border border-[#0e4337] shadow-xl">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-[#F5C542] text-xs font-bold border border-amber-500/30">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '10s' }} />
              <span>Zimbabwe Bilateral Barter &amp; Swap Engine</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight">
              Trade Goods &amp; Services Without Limits
            </h1>
            <p className="text-xs sm:text-sm text-gray-200/90 leading-relaxed">
              Swap livestock, agricultural produce, solar equipment, machinery, and artisan services with optional cash top-ups. Overcome cash liquidity shortages across Zimbabwe.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('matchmaker')}
              className="px-4 py-3 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>AI Matchmaker</span>
            </button>
            <Link
              href="/post"
              className="px-5 py-3 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950/40 flex items-center gap-2 transition-all hover:scale-105 shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post a Barter Item</span>
            </Link>
          </div>
        </div>

        {/* 4 Summary Dashboard Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Incoming Offers */}
          <div
            onClick={() => setActiveTab('incoming')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'incoming'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-[#059669] ring-2 ring-[#059669]/20'
                : 'bg-white dark:bg-[#0c1813] border-[#E2E8E4] dark:border-[#0e4337] hover:border-emerald-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-gray-400">Incoming Offers</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-[#059669] flex items-center justify-center">
                <Inbox className="w-4 h-4" />
              </div>
            </div>
            <p className="font-display font-black text-2xl text-slate-900 dark:text-white mt-2">
              {incomingOffers.length}
            </p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
              {pendingIncomingCount} pending your review
            </p>
          </div>

          {/* Card 2: Offers Sent */}
          <div
            onClick={() => setActiveTab('sent')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'sent'
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/20'
                : 'bg-white dark:bg-[#0c1813] border-[#E2E8E4] dark:border-[#0e4337] hover:border-amber-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-gray-400">Offers Sent</span>
              <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-600 flex items-center justify-center">
                <Send className="w-4 h-4" />
              </div>
            </div>
            <p className="font-display font-black text-2xl text-slate-900 dark:text-white mt-2">
              {sentOffers.length}
            </p>
            <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
              Your trade proposals
            </p>
          </div>

          {/* Card 3: Smart Matchmaker */}
          <div
            onClick={() => setActiveTab('matchmaker')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'matchmaker'
                ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/20'
                : 'bg-white dark:bg-[#0c1813] border-[#E2E8E4] dark:border-[#0e4337] hover:border-blue-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-gray-400">Smart Matchmaker</span>
              <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <p className="font-display font-black text-2xl text-slate-900 dark:text-white mt-2">
              {matchResults.length || 'AI'}
            </p>
            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold mt-0.5">
              Cross-sector barter pairings
            </p>
          </div>

          {/* Card 4: Active Trades */}
          <div
            onClick={() => setActiveTab('active')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'active'
                ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500 ring-2 ring-purple-500/20'
                : 'bg-white dark:bg-[#0c1813] border-[#E2E8E4] dark:border-[#0e4337] hover:border-purple-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-gray-400">Active Trades</span>
              <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/60 text-purple-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="font-display font-black text-2xl text-slate-900 dark:text-white mt-2">
              {activeTradesCount}
            </p>
            <p className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold mt-0.5">
              Arranging exchange / handover
            </p>
          </div>
        </div>

        {/* Section Tabs Navigation Bar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#E2E8E4] dark:border-[#0e4337] pb-3">
          <button
            onClick={() => setActiveTab('discover')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'discover'
                ? 'bg-[#059669] text-white shadow-sm'
                : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-[#0c1813]'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Discover Barter Opportunities ({listings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('matchmaker')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'matchmaker'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-[#0c1813]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Smart Matchmaker</span>
          </button>

          <button
            onClick={() => setActiveTab('incoming')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'incoming'
                ? 'bg-[#059669] text-white shadow-sm'
                : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-[#0c1813]'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Incoming Proposals</span>
            {pendingIncomingCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px]">
                {pendingIncomingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('sent')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'sent'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-[#0c1813]'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Offers Sent ({sentOffers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'active'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-[#0c1813]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Active Trades ({activeTradesCount})</span>
          </button>
        </div>

        {/* TAB 1: DISCOVER BARTER OPPORTUNITIES */}
        {activeTab === 'discover' && (
          <div className="space-y-5">
            {/* Filter & Search Toolbar */}
            <div className="bg-white dark:bg-[#0c1813] rounded-2xl border border-[#E2E8E4] dark:border-[#0e4337] p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between shadow-sm">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 dark:text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search barter items (e.g. goats, solar inverter, maize, borehole, cattle)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-[#041d18] border border-slate-200 dark:border-[#0e4337] text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#041d18] border border-slate-200 dark:border-[#0e4337] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="all">All Sectors</option>
                  <option value="livestock_agric">Livestock &amp; Agriculture</option>
                  <option value="electronics">Solar, Power &amp; Electronics</option>
                  <option value="grocery_wholesale">Grocery Wholesale &amp; Produce</option>
                  <option value="building_construction">Building &amp; Hardware</option>
                  <option value="transport_logistics">Transport &amp; Machinery</option>
                  <option value="industrial_services">Industrial &amp; Artisan</option>
                </select>

                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#041d18] border border-slate-200 dark:border-[#0e4337] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="all">All Zimbabwe</option>
                  <option value="Chiredzi">Chiredzi / Lowveld</option>
                  <option value="Triangle">Triangle Estate</option>
                  <option value="Masvingo">Masvingo</option>
                  <option value="Harare">Harare CBD</option>
                  <option value="Bulawayo">Bulawayo</option>
                  <option value="Mutare">Mutare</option>
                </select>

                {(searchQuery || selectedCategory !== 'all' || selectedLocation !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setSelectedLocation('all');
                    }}
                    className="p-2 rounded-xl text-slate-500 dark:text-gray-400 hover:text-red-500 transition-colors"
                    title="Clear filters"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {loadingListings ? (
              <div className="text-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin text-[#059669] mx-auto mb-2" />
                <p className="text-xs text-slate-500 dark:text-gray-400">Loading verified barter listings...</p>
              </div>
            ) : filteredListings.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-[#0c1813] rounded-3xl border border-[#E2E8E4] dark:border-[#0e4337] p-8">
                <RefreshCw className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-50" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">No Barter Listings Match</h3>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
                  Try clearing your search filters or be the first to list a new barter opportunity.
                </p>
                <Link
                  href="/post"
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#059669] text-white text-xs font-bold"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Post Item Now</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredListings.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-[#0c1813] rounded-3xl border border-[#E2E8E4] dark:border-[#0e4337] p-5 flex flex-col justify-between hover:shadow-xl transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#031d17] text-slate-700 dark:text-gray-300 text-xs font-medium flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#059669]" />
                          <span>{item.locationArea}</span>
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-[#d97706] dark:text-[#F5C542]">
                          Open to Barter
                        </span>
                      </div>

                      <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2 line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-[#041d18] border border-amber-200/60 dark:border-[#0e4337] space-y-1.5 mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 block">
                          Seller Willing to Swap For:
                        </span>
                        <p className="text-xs font-bold text-amber-800 dark:text-[#F5C542]">
                          {item.barterTerms || 'Any reasonable trade, farm produce, livestock, or cash top-up'}
                        </p>
                      </div>

                      {item.imageTags && item.imageTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {item.imageTags.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#0a2720] text-slate-600 dark:text-gray-400 text-[10px]"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-[#0e4337]/50">
                      <button
                        onClick={() => setActiveModalListing(item)}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Make Barter Proposal</span>
                      </button>
                      <a
                        href={`https://wa.me/${(item.user?.phoneNumber || '+263783237918').replace(/\D/g, '')}?text=${encodeURIComponent(
                          `Hi ${item.user?.fullName}, I saw your barter listing "${item.title}" on ZimBarter. I have a trade offer.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl border border-slate-200 dark:border-[#0e4337] text-slate-700 dark:text-gray-300 hover:text-[#059669] hover:border-[#059669] transition-colors"
                        title="Direct WhatsApp Negotiation"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SMART BARTER MATCHMAKER */}
        {activeTab === 'matchmaker' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#0c1813] rounded-3xl border border-[#E2E8E4] dark:border-[#0e4337] p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <span>AI Bilateral Barter Matchmaker</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                    Calculates cross-sector synergies and mutual keyword overlap between what you offer and what other Zimbabwean traders are seeking.
                  </p>
                </div>

                {listings.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-600 dark:text-gray-300 shrink-0">
                      Match Against:
                    </span>
                    <select
                      value={selectedMatchListingId}
                      onChange={(e) => setSelectedMatchListingId(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#041d18] border border-slate-200 dark:border-[#0e4337] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 max-w-[240px]"
                    >
                      {listings.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {loadingMatches ? (
                <div className="text-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 dark:text-gray-400">
                    Evaluating Zimbabwean sector synergies and barter terms...
                  </p>
                </div>
              ) : matchResults.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-200 dark:border-[#0e4337] rounded-2xl p-6">
                  <ArrowRightLeft className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-bold text-slate-800 dark:text-gray-200">
                    No High-Synergy Pairs Found Yet
                  </p>
                  <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
                    Try selecting a different item above or post additional trade terms to help the algorithm match terms.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {matchResults.map((match, i) => (
                    <div
                      key={i}
                      className="p-5 rounded-2xl bg-slate-50 dark:bg-[#041d18] border border-slate-200/80 dark:border-[#0e4337] space-y-3 hover:border-amber-500/50 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{match.matchScore}% Synergy Fit</span>
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-gray-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#059669]" />
                          <span>{match.matchedListing.locationArea}</span>
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-base text-slate-900 dark:text-white">
                          {match.matchedListing.title}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-gray-300 mt-1 line-clamp-2">
                          {match.matchedListing.description}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-white dark:bg-[#0c1813] border border-slate-200 dark:border-[#0e4337] text-xs space-y-1">
                        <p className="text-slate-500 dark:text-gray-400 text-[10px] font-bold uppercase">
                          Trade Overlap:
                        </p>
                        <p className="text-amber-700 dark:text-[#F5C542] font-semibold">
                          {match.offerWantedOverlap}
                        </p>
                        <p className="text-[11px] text-slate-600 dark:text-gray-400 italic mt-1">
                          {match.crossFitDescription}
                        </p>
                      </div>

                      <div className="pt-2 flex items-center gap-2">
                        <button
                          onClick={() => setActiveModalListing(match.matchedListing)}
                          className="flex-1 py-2 px-3 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Propose Swap to {match.matchedListing.user.fullName}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: INCOMING PROPOSALS */}
        {activeTab === 'incoming' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-[#0c1813] rounded-3xl border border-[#E2E8E4] dark:border-[#0e4337] p-5 shadow-sm">
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">
                Incoming Trade Offers
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 mb-5">
                Review proposed barter exchanges and cash adjustments from other verified Zimbabwean traders.
              </p>

              <div className="space-y-3">
                {incomingOffers.map((offer) => {
                  const counterUrl = formatBarterResponseUrl({
                    proposerPhone: offer.proposerPhone,
                    proposerName: offer.proposerName,
                    targetListingTitle: offer.listingTitle,
                    offeredItemTitle: offer.offeredItem,
                    sellerName: 'Prince A. Shumba',
                    status: 'counter',
                    notes: 'Can we adjust the quantity or cash top-up?',
                  });

                  return (
                    <div
                      key={offer.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-[#041d18] border border-[#E2E8E4] dark:border-[#0e4337] flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            Your listing: <strong className="text-[#059669]">{offer.listingTitle}</strong>
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-gray-500">• {offer.date}</span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-white dark:bg-[#0c1813] border border-slate-200 dark:border-[#0e4337] text-xs">
                          <p className="text-slate-800 dark:text-gray-200 font-semibold">
                            Proposed Trade: <span className="text-amber-600 dark:text-[#F5C542]">{offer.offeredItem}</span>
                          </p>
                          {offer.offeredDescription && (
                            <p className="text-slate-600 dark:text-gray-400 text-[11px] mt-0.5">
                              "{offer.offeredDescription}"
                            </p>
                          )}
                          {offer.cashTopUp && (
                            <p className="text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                              Cash Top-Up Included: {offer.cashTopUp}
                            </p>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-500 dark:text-gray-400 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
                          <span>Proposed by <b>{offer.proposerName}</b> ({offer.proposerLocation})</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                        {offer.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => handleAcceptOffer(offer.id)}
                              className="px-4 py-2 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold transition-all shadow-sm"
                            >
                              Accept Offer
                            </button>
                            <a
                              href={counterUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-2 rounded-xl border border-slate-300 dark:border-[#0e4337] text-slate-700 dark:text-gray-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-[#0a3a30] transition-colors"
                            >
                              Counteroffer
                            </a>
                            <button
                              onClick={() => handleDeclineOffer(offer.id)}
                              className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                              title="Decline"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        ) : offer.status === 'accepted' ? (
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Accepted — In Active Trades</span>
                            </span>
                            <button
                              onClick={() => setActiveTab('active')}
                              className="px-3 py-1.5 rounded-xl bg-[#059669] text-white text-xs font-bold"
                            >
                              View Handover
                            </button>
                          </div>
                        ) : (
                          <span className="px-3 py-1.5 rounded-xl bg-red-500/20 text-red-500 text-xs font-bold">
                            Declined
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: OFFERS SENT */}
        {activeTab === 'sent' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-[#0c1813] rounded-3xl border border-[#E2E8E4] dark:border-[#0e4337] p-5 shadow-sm">
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">
                Your Sent Barter Proposals
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 mb-5">
                Track status and follow up on barter offers you have extended to other sellers.
              </p>

              {sentOffers.length === 0 ? (
                <div className="text-center py-10">
                  <Send className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-bold text-slate-800 dark:text-gray-200">No Offers Sent Yet</p>
                  <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                    Explore active barter listings and click "Make Barter Proposal" to propose asset trades.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sentOffers.map((sent) => (
                    <div
                      key={sent.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-[#041d18] border border-[#E2E8E4] dark:border-[#0e4337] flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            Item Desired: <strong className="text-amber-600 dark:text-[#F5C542]">{sent.listingTitle || 'Target Listing'}</strong>
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-gray-500 font-mono">
                            • {new Date(sent.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-white dark:bg-[#0c1813] border border-slate-200 dark:border-[#0e4337] text-xs">
                          <p className="text-slate-800 dark:text-gray-200 font-semibold">
                            You Offered: <span className="text-[#059669]">{sent.offeredItemTitle}</span>
                          </p>
                          {sent.offeredDescription && (
                            <p className="text-slate-600 dark:text-gray-400 text-[11px] mt-0.5">
                              "{sent.offeredDescription}"
                            </p>
                          )}
                          {sent.cashTopUp && (
                            <p className="text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                              Cash Top-Up: {sent.cashTopUp}
                            </p>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-500 dark:text-gray-400">
                          Seller: <b>{sent.sellerName || 'Verified Trader'}</b>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                        <span
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                            sent.status === 'accepted'
                              ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                              : sent.status === 'declined'
                              ? 'bg-red-500/20 text-red-500'
                              : 'bg-amber-500/20 text-amber-600 dark:text-[#F5C542]'
                          }`}
                        >
                          {sent.status === 'accepted' ? 'Accepted' : sent.status === 'declined' ? 'Declined' : 'Pending Seller'}
                        </span>

                        <a
                          href={`https://wa.me/${(sent.sellerPhone || '+263783237918').replace(/\D/g, '')}?text=${encodeURIComponent(
                            `Hi, I submitted a barter offer for "${sent.listingTitle || 'your item'}" on ZimBarter. Following up on terms.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 rounded-xl bg-[#005c4b] hover:bg-[#00705b] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Follow Up</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: ACTIVE TRADES & HANDOVER */}
        {activeTab === 'active' && (
          <div className="space-y-5">
            <div className="bg-white dark:bg-[#0c1813] rounded-3xl border border-[#E2E8E4] dark:border-[#0e4337] p-5 shadow-sm space-y-4">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#059669]" />
                  <span>Agreed Barter Swaps Ready for Handover</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-gray-400">
                  Both parties have agreed to the barter swap terms. Settle delivery, physical verification, and cash adjustments at a verified trade hub.
                </p>
              </div>

              {/* Handover Guidelines Card */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-[#041d18] border border-emerald-500/30 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300">
                  <FileCheck className="w-4 h-4 text-[#059669]" />
                  <span>ZimBarter Handover &amp; Due Diligence Protocol</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-700 dark:text-gray-300 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-[#0c1813] border border-emerald-500/20">
                    <b className="text-slate-900 dark:text-white block mb-0.5">1. Livestock Clearance</b>
                    Inspect brand registrations, veterinary ear tags, and ZRP Anti-Stock Theft clearance forms before loading cattle or goats.
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-[#0c1813] border border-emerald-500/20">
                    <b className="text-slate-900 dark:text-white block mb-0.5">2. Equipment Testing</b>
                    Conduct on-site multimeter and load testing for inverters, solar pumps, generators, or machinery before exchange.
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-[#0c1813] border border-emerald-500/20">
                    <b className="text-slate-900 dark:text-white block mb-0.5">3. Cash Top-Up Handover</b>
                    Count and verify cash top-up (USD / ZAR / ZWG) directly at the agreed trade hub upon physical asset inspection.
                  </div>
                </div>
              </div>

              {/* Active Trades List */}
              <div className="space-y-4">
                {acceptedIncomingTrades.map((offer) => {
                  const isCompleted = completedTradeIds.includes(offer.id);
                  return (
                    <div
                      key={offer.id}
                      className="p-5 rounded-2xl bg-white dark:bg-[#07130e] border border-emerald-500/40 shadow-sm space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-[#0e4337] pb-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                            Exchange Reference: #{offer.id.toUpperCase()}
                          </span>
                          <h4 className="font-bold text-base text-slate-900 dark:text-white">
                            {offer.listingTitle} <span className="text-slate-400 dark:text-gray-500">⇄</span> {offer.offeredItem}
                          </h4>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            isCompleted
                              ? 'bg-emerald-500 text-white'
                              : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          {isCompleted ? 'Trade Completed' : 'Handover In Progress'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#041d18] border border-slate-200 dark:border-[#0e4337]">
                          <span className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase block">
                            Trading Partner:
                          </span>
                          <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                            {offer.proposerName}
                          </p>
                          <p className="text-slate-600 dark:text-gray-300 text-xs flex items-center gap-1 mt-1">
                            <MapPin className="w-3.5 h-3.5 text-[#059669]" />
                            <span>Agreed Hub: {offer.proposerLocation}</span>
                          </p>
                          <p className="text-slate-600 dark:text-gray-300 text-xs flex items-center gap-1 mt-0.5">
                            <Phone className="w-3.5 h-3.5 text-[#059669]" />
                            <span>{offer.proposerPhone}</span>
                          </p>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#041d18] border border-slate-200 dark:border-[#0e4337]">
                          <span className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase block">
                            Agreed Asset Settlement:
                          </span>
                          <p className="text-amber-700 dark:text-[#F5C542] font-bold text-xs mt-0.5">
                            • Incoming: {offer.offeredItem}
                          </p>
                          {offer.cashTopUp && (
                            <p className="text-emerald-600 dark:text-emerald-400 font-bold text-xs mt-0.5">
                              • Cash Top-Up: {offer.cashTopUp}
                            </p>
                          )}
                          <p className="text-slate-600 dark:text-gray-300 text-xs mt-1">
                            • Outgoing: {offer.listingTitle}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-[#0e4337]/50">
                        <a
                          href={`https://wa.me/${offer.proposerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                            `Hi ${offer.proposerName}, regarding our agreed trade for "${offer.listingTitle}" on ZimBarter: let's confirm the date, time, and physical handover location.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2.5 rounded-xl bg-[#005c4b] hover:bg-[#00705b] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-300" />
                          <span>Chat on WhatsApp ({offer.proposerPhone})</span>
                        </a>

                        {!isCompleted ? (
                          <button
                            onClick={() => handleMarkTradeComplete(offer.id)}
                            className="px-4 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Mark Trade Handover Completed</span>
                          </button>
                        ) : (
                          <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Handover Completed &amp; Verified</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {acceptedIncomingTrades.length === 0 && (
                  <div className="text-center py-10">
                    <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-bold text-slate-800 dark:text-gray-200">No Active Handover Trades</p>
                    <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                      Once you accept an incoming proposal or a seller accepts your sent offer, it will appear here with handover instructions.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Barter Proposal Modal */}
      <BarterProposalModal
        listing={activeModalListing}
        onClose={() => setActiveModalListing(null)}
      />
    </AppShell>
  );
}
