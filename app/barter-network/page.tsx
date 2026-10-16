'use client';

import React, { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import BarterProposalModal from '@/components/BarterProposalModal';
import BuyCashModal from '@/components/BuyCashModal';
import { Listing, BarterProposal } from '@/lib/types';
import {
  RefreshCw,
  ArrowRight,
  MapPin,
  CheckCircle2,
  Inbox,
  Send,
  SlidersHorizontal,
  Clock,
  ShieldCheck,
  ChevronRight,
  PlusCircle,
  XCircle,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function BarterHubPage() {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [activeTab, setActiveTab] = useState<'discover' | 'incoming' | 'sent' | 'active'>('discover');
  const [activeModalListing, setActiveModalListing] = useState<Listing | null>(null);

  // Sample incoming offers for demonstration
  const [incomingOffers, setIncomingOffers] = useState([
    {
      id: 'prop-1',
      listingTitle: 'Fresh Maize (10kg bag)',
      proposerName: 'Simba Chauke',
      proposerLocation: 'Triangle Estate',
      proposerPhone: '+263774567890',
      offeredItem: '2 Bags of Compound D Fertilizer',
      cashTopUp: 'US$ 10.00',
      status: 'pending',
      date: '2 hours ago',
    },
    {
      id: 'prop-2',
      listingTitle: 'Goats (3 females + 1 male)',
      proposerName: 'Tinashe Musarurwa',
      proposerLocation: 'Harare',
      proposerPhone: '+263773456789',
      offeredItem: 'Solar Submersible Inverter Pump (1.5HP)',
      cashTopUp: 'US$ 40.00',
      status: 'pending',
      date: '5 hours ago',
    },
    {
      id: 'prop-3',
      listingTitle: 'HP Laptop (Core i5)',
      proposerName: 'Farai Ncube',
      proposerLocation: 'Masvingo',
      proposerPhone: '+263775678901',
      offeredItem: 'Samsung Galaxy S22 (128GB, Pristine)',
      cashTopUp: 'US$ 50.00',
      status: 'pending',
      date: 'Yesterday',
    },
  ]);

  useEffect(() => {
    const fetchBarterListings = async () => {
      try {
        const res = await fetch('/api/listings?barterOnly=true');
        const data = await res.json();
        if (data.success) {
          setListings(data.listings || []);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchBarterListings();
  }, []);

  const handleAcceptOffer = (id: string) => {
    setIncomingOffers((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: 'accepted' } : o))
    );
  };

  const handleDeclineOffer = (id: string) => {
    setIncomingOffers((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: 'declined' } : o))
    );
  };

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 w-full space-y-6">
        {/* Hub Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#062A22] via-[#041d18] to-[#0a3a30] text-white p-6 sm:p-8 rounded-3xl border border-[#0e4337] shadow-xl">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-[#F5C542] text-xs font-bold border border-amber-500/30">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '10s' }} />
              <span>Zimbabwe Bilateral Barter Hub</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight">
              Barter Without Limits
            </h1>
            <p className="text-xs sm:text-sm text-gray-200/90 leading-relaxed">
              Exchange livestock, agricultural produce, electronics, or artisan labor with cash top-ups. Overcome cash liquidity shortages across Zimbabwe.
            </p>
          </div>

          <Link
            href="/post"
            className="self-start md:self-auto px-5 py-3 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950/40 flex items-center gap-2 transition-all hover:scale-105 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post a Barter Item</span>
          </Link>
        </div>

        {/* 4 Summary Dashboard Metrics Cards (Blueprint Section 6) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
            <p className="font-display font-black text-2xl text-slate-900 dark:text-white mt-2">3</p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
              Trade proposals received
            </p>
          </div>

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
            <p className="font-display font-black text-2xl text-slate-900 dark:text-white mt-2">5</p>
            <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
              Awaiting seller response
            </p>
          </div>

          <div
            onClick={() => setActiveTab('incoming')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'incoming'
                ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/20'
                : 'bg-white dark:bg-[#0c1813] border-[#E2E8E4] dark:border-[#0e4337] hover:border-blue-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-gray-400">Counteroffers</span>
              <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-600 flex items-center justify-center">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
            </div>
            <p className="font-display font-black text-2xl text-slate-900 dark:text-white mt-2">2</p>
            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold mt-0.5">
              Requires your decision
            </p>
          </div>

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
            <p className="font-display font-black text-2xl text-slate-900 dark:text-white mt-2">4</p>
            <p className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold mt-0.5">
              Arranging exchange / delivery
            </p>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E2E8E4] dark:border-[#0e4337] pb-3">
          <button
            onClick={() => setActiveTab('discover')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'discover'
                ? 'bg-[#059669] text-white shadow-sm'
                : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Discover Barter Opportunities ({listings.length})
          </button>
          <button
            onClick={() => setActiveTab('incoming')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'incoming'
                ? 'bg-[#059669] text-white shadow-sm'
                : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Incoming Proposals</span>
            <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px]">3</span>
          </button>
        </div>

        {/* Tab 1: Discover Barter Listings */}
        {activeTab === 'discover' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {listings.map((item) => (
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

                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#041d18] border border-slate-100 dark:border-[#0e4337] space-y-1.5 mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 block">
                        Seller Willing to Swap For:
                      </span>
                      <p className="text-xs font-bold text-amber-700 dark:text-[#F5C542]">
                        {item.barterTerms || 'Any reasonable trade, farm produce, or cash top-up'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-[#0e4337]/50">
                    <button
                      onClick={() => setActiveModalListing(item)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Make Barter Proposal</span>
                    </button>
                    <a
                      href={`https://wa.me/${(item.user?.phoneNumber || '+263771234567').replace(/\D/g, '')}?text=${encodeURIComponent(
                        `Hi ${item.user?.fullName}, I saw your barter listing "${item.title}" on ZimBarter. I have a trade offer.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-[#0e4337] text-slate-700 dark:text-gray-300 hover:text-[#059669] hover:border-[#059669] transition-colors"
                      title="Direct WhatsApp"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Incoming Proposals List */}
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
                {incomingOffers.map((offer) => (
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
                            href={`https://wa.me/${offer.proposerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                              `Hi ${offer.proposerName}, regarding your barter proposal for "${offer.listingTitle}": can we negotiate terms?`
                            )}`}
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
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Accepted — Arranging Exchange</span>
                        </span>
                      ) : (
                        <span className="px-3 py-1.5 rounded-xl bg-red-500/20 text-red-500 text-xs font-bold">
                          Declined
                        </span>
                      )}
                    </div>
                  </div>
                ))}
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
