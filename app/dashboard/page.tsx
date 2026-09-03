'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import WhatsAppSimulatorModal from '@/components/WhatsAppSimulatorModal';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Listing, BarterProposal, TradeOrder } from '@/lib/types';
import {
  Package,
  RefreshCw,
  ShoppingBag,
  DollarSign,
  CheckCircle2,
  Archive,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  PlusCircle,
  Clock,
  MapPin,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface DashboardStats {
  totalListings: number;
  activeListings: number;
  soldListings: number;
  pendingProposals: number;
  totalOrders: number;
  totalOrderValue: number;
}

export default function DashboardPage() {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'listings' | 'proposals' | 'orders'>('listings');
  const [stats, setStats] = useState<DashboardStats>({
    totalListings: 0,
    activeListings: 0,
    soldListings: 0,
    pendingProposals: 0,
    totalOrders: 0,
    totalOrderValue: 0,
  });
  const [listings, setListings] = useState<Listing[]>([]);
  const [proposals, setProposals] = useState<BarterProposal[]>([]);
  const [orders, setOrders] = useState<TradeOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [whatsAppOpen, setWhatsAppOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setLoading(false);
      return;
    }

    fetchDashboardData();
  }, [isAuthenticated, user]);

  const fetchDashboardData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const query = user.phoneNumber
        ? `userId=${encodeURIComponent(user.id)}&phone=${encodeURIComponent(user.phoneNumber)}`
        : `userId=${encodeURIComponent(user.id)}`;
      const res = await fetch(`/api/dashboard?${query}`);
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setListings(data.listings);
        setProposals(data.proposals);
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (listingId: string, newStatus: Listing['status']) => {
    setUpdatingId(listingId);
    try {
      const res = await fetch('/api/dashboard', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setListings((prev) =>
          prev.map((l) => (l.id === listingId ? { ...l, status: newStatus } : l))
        );
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex flex-col bg-[#070d09]">
        <Navbar onOpenWhatsApp={() => setWhatsAppOpen(true)} />
        <div className="max-w-lg mx-auto px-4 py-24 text-center glass-panel rounded-3xl mt-12 border border-emerald-500/20">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 text-emerald-400">
            <Package className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Trader Dashboard</h2>
          <p className="text-sm text-gray-400 mb-6">
            Sign in to manage your active marketplace listings, review incoming barter proposals, and track cash buy orders.
          </p>
          <button
            onClick={() => openAuthModal('Sign in to view your seller dashboard and listings.')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-lowveld-600 text-white font-bold text-sm shadow-lg shadow-emerald-950 transition-all hover:scale-105"
          >
            Sign In to Account
          </button>
        </div>
        <WhatsAppSimulatorModal isOpen={whatsAppOpen} onClose={() => setWhatsAppOpen(false)} />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-[#070d09]">
      <Navbar onOpenWhatsApp={() => setWhatsAppOpen(true)} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full flex-1">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Lowveld Trader Portal</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-white">
              Seller Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Logged in as <span className="text-emerald-400 font-bold">{user?.fullName}</span> ({user?.phoneNumber}) · {user?.locationArea}
            </p>
          </div>

          <Link
            href="/post"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-lowveld-600 hover:from-emerald-400 hover:to-lowveld-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950 transition-all hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Listing</span>
          </Link>
        </div>

        {/* STATS STRIP */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 mb-8">
          <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-lowveld-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400 font-medium">My Listings</span>
              <Package className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xl sm:text-3xl font-black text-white font-display">
              {stats.totalListings}
            </p>
            <span className="text-[11px] text-emerald-400/90 font-medium">
              {stats.activeListings} currently active
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-lowveld-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400 font-medium">Barter Proposals</span>
              <RefreshCw className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-xl sm:text-3xl font-black text-amber-400 font-display">
              {stats.pendingProposals}
            </p>
            <span className="text-[11px] text-gray-400 font-medium">
              Asset swap offers
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-lowveld-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400 font-medium">Cash Orders</span>
              <ShoppingBag className="w-4 h-4 text-sky-400" />
            </div>
            <p className="text-xl sm:text-3xl font-black text-white font-display">
              {stats.totalOrders}
            </p>
            <span className="text-[11px] text-sky-400/90 font-medium">
              COD Handover orders
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-lowveld-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400 font-medium">Order Value</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xl sm:text-3xl font-black text-emerald-400 font-display">
              ${stats.totalOrderValue.toLocaleString()}
            </p>
            <span className="text-[11px] text-gray-400 font-medium">
              Gross sales interest
            </span>
          </div>
        </div>

        {/* TABS CONTROLLER */}
        <div className="flex items-center gap-2 border-b border-lowveld-800/80 mb-6 pb-2">
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
              activeTab === 'listings'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Listings ({listings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('proposals')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
              activeTab === 'proposals'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Barter Proposals ({proposals.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Cash Orders ({orders.length})</span>
          </button>
        </div>

        {/* TAB 1: MY LISTINGS */}
        {activeTab === 'listings' && (
          <div>
            {loading ? (
              <div className="py-16 text-center">
                <div className="w-10 h-10 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin mx-auto mb-3" />
                <p className="text-xs text-gray-400">Loading your listings...</p>
              </div>
            ) : listings.length === 0 ? (
              <div className="p-12 text-center glass-panel rounded-3xl border border-lowveld-800/80">
                <Package className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white mb-1">No Listings Posted Yet</h3>
                <p className="text-xs text-gray-400 mb-6">
                  List your livestock, agricultural harvest, metalwork fabrication, or transport services.
                </p>
                <Link
                  href="/post"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md inline-flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create Your First Listing</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {listings.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 rounded-2xl glass-panel border border-lowveld-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-emerald-500/40"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.imageUrls[0] || 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800'}
                        alt={item.title}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover bg-lowveld-950 border border-lowveld-800"
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              item.status === 'active'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : item.status === 'sold'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : 'bg-gray-500/20 text-gray-300 border border-gray-500/40'
                            }`}
                          >
                            {item.status}
                          </span>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {item.locationArea}
                          </span>
                        </div>
                        <h4 className="font-display font-bold text-sm sm:text-base text-white">
                          {item.title}
                        </h4>
                        <p className="text-xs text-emerald-400 font-bold font-mono">
                          {item.currency === 'BARTER'
                            ? 'Trade Swap Only'
                            : `${item.currency} $${item.price?.toLocaleString()}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-lowveld-800/60">
                      <Link
                        href={`/listing/${item.id}`}
                        className="px-3 py-1.5 rounded-lg bg-lowveld-900 hover:bg-lowveld-800 text-gray-300 text-xs font-semibold flex items-center gap-1 border border-lowveld-700/60"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>View</span>
                      </Link>

                      {item.status !== 'sold' && (
                        <button
                          onClick={() => handleUpdateStatus(item.id, 'sold')}
                          disabled={updatingId === item.id}
                          className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1 border border-amber-500/40"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Mark Sold</span>
                        </button>
                      )}

                      {item.status === 'sold' && (
                        <button
                          onClick={() => handleUpdateStatus(item.id, 'active')}
                          disabled={updatingId === item.id}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1 border border-emerald-500/40"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Reactivate</span>
                        </button>
                      )}

                      {item.status !== 'archived' && (
                        <button
                          onClick={() => handleUpdateStatus(item.id, 'archived')}
                          disabled={updatingId === item.id}
                          className="px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-semibold flex items-center gap-1 border border-rose-500/30"
                        >
                          <Archive className="w-3 h-3" />
                          <span>Archive</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: BARTER PROPOSALS */}
        {activeTab === 'proposals' && (
          <div>
            {proposals.length === 0 ? (
              <div className="p-12 text-center glass-panel rounded-3xl border border-lowveld-800/80">
                <RefreshCw className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white mb-1">No Barter Proposals Received</h3>
                <p className="text-xs text-gray-400">
                  When other ranchers or artisans offer to swap their assets for your listings, they will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {proposals.map((prop) => {
                  const cleanPhone = prop.proposerPhone.replace(/\D/g, '');
                  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                    `Hi ${prop.proposerName}, I received your swap offer of "${prop.offeredItemTitle}" on ChiredziTrade. Let's discuss!`
                  )}`;

                  return (
                    <div
                      key={prop.id}
                      className="p-5 rounded-2xl glass-panel border border-amber-500/30 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[11px] font-bold">
                          Asset Swap Proposal
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(prop.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-display font-bold text-base text-white">
                          Offered: {prop.offeredItemTitle}
                        </h4>
                        {prop.offeredDescription && (
                          <p className="text-xs text-gray-300 mt-1">
                            "{prop.offeredDescription}"
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-lowveld-800/60 text-xs">
                        <div className="text-gray-400">
                          From: <strong className="text-white">{prop.proposerName}</strong> ({prop.proposerLocation})
                          {prop.cashTopUp && (
                            <span className="ml-2 text-emerald-400 font-bold">
                              + Cash Top-up: ${prop.cashTopUp}
                            </span>
                          )}
                        </div>

                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-md transition-all"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Chat on WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CASH ORDERS */}
        {activeTab === 'orders' && (
          <div>
            {orders.length === 0 ? (
              <div className="p-12 text-center glass-panel rounded-3xl border border-lowveld-800/80">
                <ShoppingBag className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white mb-1">No Cash Orders Yet</h3>
                <p className="text-xs text-gray-400">
                  When buyers select "Buy Cash" on your listings, their orders will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => {
                  const cleanPhone = ord.buyerPhone.replace(/\D/g, '');
                  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                    `Hi ${ord.buyerName}, I received your cash order on ChiredziTrade for total ${ord.currencyChoice} $${ord.totalPrice}. Ready to arrange pickup in ${ord.pickupLocation}!`
                  )}`;

                  return (
                    <div
                      key={ord.id}
                      className="p-5 rounded-2xl glass-panel border border-sky-500/30 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded bg-sky-500/20 text-sky-300 text-[11px] font-bold">
                          Cash Order (COD)
                        </span>
                        <span className="text-xs text-emerald-400 font-bold font-mono">
                          {ord.currencyChoice} ${ord.totalPrice} ({ord.quantity} unit{ord.quantity > 1 ? 's' : ''})
                        </span>
                      </div>

                      <div className="text-xs text-gray-300">
                        Buyer: <strong className="text-white">{ord.buyerName}</strong> ({ord.buyerPhone}) · Pickup Location: <strong className="text-white">{ord.pickupLocation}</strong>
                        {ord.notes && <p className="italic text-gray-400 mt-1">Note: "{ord.notes}"</p>}
                      </div>

                      <div className="flex items-center justify-end pt-2 border-t border-lowveld-800/60">
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Contact Buyer on WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <WhatsAppSimulatorModal isOpen={whatsAppOpen} onClose={() => setWhatsAppOpen(false)} />
    </main>
  );
}
