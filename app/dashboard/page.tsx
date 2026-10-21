'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import WhatsAppSimulatorModal from '@/components/WhatsAppSimulatorModal';
import TradeReceiptModal, { ReceiptData } from '@/components/TradeReceiptModal';
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
  AlertCircle,
  Trash2,
  Receipt,
  Download,
  Printer,
  Zap,
  LogIn
} from 'lucide-react';
import {
  formatSellerOrderResponseUrl,
  formatBarterProposalUrl
} from '@/lib/whatsapp-messages';

interface DashboardStats {
  totalListings: number;
  activeListings: number;
  soldListings: number;
  pendingProposals: number;
  totalOrders: number;
  totalOrderValue: number;
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const { user, isAuthenticated, openAuthModal, signInAsDemo } = useAuth();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'listings' | 'proposals' | 'orders' | 'transactions'>('listings');
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
  const [buyerOrders, setBuyerOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [whatsAppOpen, setWhatsAppOpen] = useState(false);

  // Receipt Modal State
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptData | null>(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  // Sync tab from query param
  useEffect(() => {
    const tab = searchParams?.get('tab');
    if (tab === 'proposals' || tab === 'orders' || tab === 'transactions' || tab === 'listings') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Load locally saved orders (purchases made as buyer)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('zimbarter_buyer_orders');
        if (stored) {
          setBuyerOrders(JSON.parse(stored));
        }
      } catch (e) {
        console.warn('Failed to load local buyer orders:', e);
      }
    }
  }, []);

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

  const handleDeleteListing = async (listingId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"? This cannot be undone.`)) {
      return;
    }
    setUpdatingId(listingId);
    try {
      const res = await fetch(`/api/dashboard?listingId=${encodeURIComponent(listingId)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setListings((prev) => prev.filter((l) => l.id !== listingId));
        fetchDashboardData();
      } else {
        alert(data.error || 'Failed to delete listing');
      }
    } catch (err) {
      console.error('Error deleting listing:', err);
      alert('Failed to delete listing. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  const openReceiptForOrder = (order: TradeOrder) => {
    const listing = listings.find((l) => l.id === order.listingId);
    const itemTitle = listing?.title || 'Marketplace Item';
    const unitPrice = order.quantity && order.quantity > 0 ? (order.totalPrice || 0) / order.quantity : (order.totalPrice || 0);

    const receipt: ReceiptData = {
      orderReference: order.id.toUpperCase().replace(/^ORDER-/, 'ZT-'),
      date: new Date(order.createdAt).toLocaleDateString() + ' ' + new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      itemTitle,
      category: listing?.category,
      quantity: order.quantity || 1,
      unitPrice: Number(unitPrice.toFixed(2)),
      subtotal: Number((order.totalPrice || 0).toFixed(2)),
      platformFee: 0,
      totalAmount: Number((order.totalPrice || 0).toFixed(2)),
      currency: order.currencyChoice || 'USD',
      paymentMethod: order.currencyChoice === 'USD' ? 'EcoCash / Cash Handover' : 'Cash Handover',
      paymentStatus: 'CONFIRMED',
      sellerName: user?.fullName || 'Prince A. Shumba',
      sellerPhone: user?.phoneNumber || '+263 77 123 4567',
      sellerLocation: user?.locationArea || 'Chiredzi Town',
      sellerVerified: true,
      buyerName: order.buyerName,
      buyerPhone: order.buyerPhone,
      collectionHub: order.pickupLocation,
      notes: order.notes,
    };

    setSelectedReceipt(receipt);
    setReceiptModalOpen(true);
  };

  const openReceiptForBuyerOrder = (bo: any) => {
    const receipt: ReceiptData = {
      orderReference: bo.reference || 'ZT-ORD-' + Date.now().toString().slice(-4),
      date: bo.date || new Date().toLocaleDateString(),
      itemTitle: bo.listingTitle || 'Marketplace Item',
      quantity: bo.quantity || 1,
      unitPrice: bo.unitPrice || bo.totalPrice || 0,
      subtotal: bo.subtotal || bo.totalPrice || 0,
      platformFee: bo.fee || 0,
      totalAmount: bo.totalPrice || 0,
      currency: bo.currency || 'USD',
      paymentMethod: bo.paymentMethod || 'ecocash',
      paymentStatus: 'PAID',
      sellerName: bo.sellerName || 'Verified Merchant',
      sellerPhone: bo.sellerPhone || '+263 77 123 4567',
      sellerLocation: bo.sellerLocation || 'Chiredzi Town',
      buyerName: bo.buyerName || user?.fullName || 'Buyer',
      buyerPhone: bo.buyerPhone || user?.phoneNumber || '+263 77 000 0000',
      collectionHub: bo.collectionHub || 'Chiredzi Town',
      notes: bo.notes,
    };

    setSelectedReceipt(receipt);
    setReceiptModalOpen(true);
  };

  // If user is not authenticated: Show friendly options without trapping the user
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070d09] text-slate-900 dark:text-gray-100 transition-colors duration-300">
        <Navbar onOpenWhatsApp={() => setWhatsAppOpen(true)} />
        <div className="max-w-md mx-auto px-4 py-16 text-center glass-panel rounded-3xl mt-10 border border-slate-200 dark:border-emerald-500/20 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 text-emerald-600 dark:text-emerald-400">
            <Package className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 font-display">Trader Portal &amp; Portfolio</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400 mb-6 leading-relaxed">
            Manage your active marketplace listings, review incoming barter proposals, and view complete <strong>Transaction History with Downloadable Receipts</strong>.
          </p>

          <div className="space-y-3">
            {/* 1-Tap Demo Access Button */}
            <button
              onClick={() => signInAsDemo()}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>1-Tap Demo Sign In (Prince A. Shumba)</span>
            </button>

            {/* Standard Sign In */}
            <button
              onClick={() => openAuthModal('Sign in to view your seller dashboard and listings.')}
              className="w-full py-3 px-4 rounded-xl bg-slate-200 dark:bg-emerald-950/40 hover:bg-slate-300 dark:hover:bg-emerald-900/40 border border-slate-300 dark:border-emerald-500/30 text-slate-800 dark:text-emerald-300 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In with Email / Google</span>
            </button>

            <Link
              href="/"
              className="block pt-2 text-xs font-semibold text-slate-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors"
            >
              ← Return to Marketplace Feed
            </Link>
          </div>
        </div>
        <WhatsAppSimulatorModal isOpen={whatsAppOpen} onClose={() => setWhatsAppOpen(false)} />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070d09] text-slate-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar onOpenWhatsApp={() => setWhatsAppOpen(true)} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 w-full flex-1">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span>Zimbabwe Trade &amp; Barter Portal</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-slate-900 dark:text-white">
              Seller &amp; Trader Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400 mt-1">
              Active Account: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{user?.fullName}</span> ({user?.phoneNumber}) · {user?.locationArea}
            </p>
          </div>

          <Link
            href="/post"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-lowveld-600 hover:from-emerald-400 hover:to-lowveld-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-105"
          >
            <PlusCircle className="w-4 h-4 text-white" />
            <span>Post New Listing</span>
          </Link>
        </div>

        {/* STATS STRIP */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 mb-8">
          <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-slate-200 dark:border-lowveld-800/80 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-600 dark:text-gray-400 font-medium">My Listings</span>
              <Package className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white font-display">
              {stats.totalListings}
            </p>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              {stats.activeListings} currently active
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-slate-200 dark:border-lowveld-800/80 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-600 dark:text-gray-400 font-medium">Barter Proposals</span>
              <RefreshCw className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            </div>
            <p className="text-xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 font-display">
              {stats.pendingProposals}
            </p>
            <span className="text-[11px] text-slate-500 dark:text-gray-400 font-medium">
              Asset swap offers
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-slate-200 dark:border-lowveld-800/80 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-600 dark:text-gray-400 font-medium">Cash Orders</span>
              <ShoppingBag className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            </div>
            <p className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white font-display">
              {stats.totalOrders}
            </p>
            <span className="text-[11px] text-sky-600 dark:text-sky-400 font-medium">
              COD Handover orders
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-slate-200 dark:border-lowveld-800/80 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-600 dark:text-gray-400 font-medium">Trade Volume</span>
              <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-display">
              ${stats.totalOrderValue.toLocaleString()}
            </p>
            <span className="text-[11px] text-slate-500 dark:text-gray-400 font-medium">
              Total transaction value
            </span>
          </div>
        </div>

        {/* TABS CONTROLLER (Includes Transaction History & Receipts) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-lowveld-800/80 mb-6 pb-2">
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
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
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
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
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Cash Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'transactions'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Receipt className="w-4 h-4 text-amber-400" />
            <span>Transaction History &amp; Receipts ({orders.length + buyerOrders.length})</span>
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
                          className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-xs font-semibold flex items-center gap-1 border border-amber-500/30"
                        >
                          <Archive className="w-3 h-3" />
                          <span>Archive</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteListing(item.id, item.title)}
                        disabled={updatingId === item.id}
                        className="px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-semibold flex items-center gap-1 border border-rose-500/30"
                        title="Permanently delete this listing"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
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
                  const waUrl = formatBarterProposalUrl({
                    sellerPhone: prop.proposerPhone,
                    sellerName: prop.proposerName,
                    targetListingTitle: prop.offeredItemTitle,
                    offeredItemTitle: prop.offeredItemTitle,
                    offeredDescription: prop.offeredDescription,
                    cashTopUp: prop.cashTopUp,
                    proposerName: user?.fullName || 'Prince A. Shumba',
                    proposerPhone: user?.phoneNumber || '+263 77 123 4567',
                    proposerLocation: user?.locationArea || 'Chiredzi Town',
                  });

                  return (
                    <div
                      key={prop.id}
                      className="p-5 rounded-2xl glass-panel border border-amber-500/30 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[11px] font-bold">
                          Asset Swap Proposal
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1 font-mono">
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
                          <MessageCircle className="w-4 h-4 text-emerald-300" />
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
                  const targetListing = listings.find((l) => l.id === ord.listingId);
                  const waUrl = formatSellerOrderResponseUrl({
                    buyerPhone: ord.buyerPhone,
                    buyerName: ord.buyerName,
                    listingTitle: targetListing?.title || 'Marketplace Item',
                    orderReference: ord.id.replace(/^order-/, 'ZT-'),
                    totalPrice: ord.totalPrice,
                    currency: ord.currencyChoice,
                    pickupLocation: ord.pickupLocation,
                    sellerName: user?.fullName || 'Prince A. Shumba',
                  });

                  return (
                    <div
                      key={ord.id}
                      className="p-5 rounded-2xl glass-panel border border-sky-500/30 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded bg-sky-500/20 text-sky-300 text-[11px] font-bold font-mono">
                          Order #{ord.id.replace(/^order-/, 'ZT-')} · COD
                        </span>
                        <span className="text-xs text-emerald-400 font-bold font-mono">
                          {ord.currencyChoice} ${ord.totalPrice} ({ord.quantity} unit{ord.quantity > 1 ? 's' : ''})
                        </span>
                      </div>

                      <div className="text-xs text-gray-300">
                        Buyer: <strong className="text-white">{ord.buyerName}</strong> ({ord.buyerPhone}) · Pickup Location: <strong className="text-white">{ord.pickupLocation}</strong>
                        {ord.notes && <p className="italic text-gray-400 mt-1">Note: "{ord.notes}"</p>}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-lowveld-800/60">
                        {/* Download / View Receipt Button */}
                        <button
                          type="button"
                          onClick={() => openReceiptForOrder(ord)}
                          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 hover:text-white font-bold text-xs flex items-center gap-1.5 border border-emerald-500/30 transition-all cursor-pointer shadow-sm"
                        >
                          <Receipt className="w-3.5 h-3.5 text-emerald-400" />
                          <span>View / Download Receipt</span>
                        </button>

                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-xl bg-[#005c4b] hover:bg-[#00705b] text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                        >
                          <MessageCircle className="w-4 h-4 text-emerald-300" />
                          <span>WhatsApp Buyer</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: TRANSACTION HISTORY & DOWNLOADABLE RECEIPTS */}
        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
              <div className="flex items-center gap-2.5">
                <Receipt className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-white">Transaction History &amp; Official Receipts</h4>
                  <p className="text-xs text-amber-200/80">
                    Official proof of trade for all purchases, cash collections, and barter agreements on ZimBarter.
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 self-start sm:self-auto">
                {orders.length + buyerOrders.length} Completed Trades
              </span>
            </div>

            {orders.length === 0 && buyerOrders.length === 0 ? (
              <div className="p-12 text-center glass-panel rounded-3xl border border-lowveld-800/80">
                <Receipt className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white mb-1">No Transactions Recorded Yet</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto mb-4">
                  When you buy items via EcoCash/Cash on Handover, or when buyers place orders on your listings, downloadable receipts will be generated here.
                </p>
                <Link
                  href="/#marketplace"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Browse Marketplace</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-3.5">
                {/* 1. Seller Orders */}
                {orders.map((ord) => {
                  const targetListing = listings.find((l) => l.id === ord.listingId);
                  const ref = ord.id.toUpperCase().replace(/^ORDER-/, 'ZT-');

                  return (
                    <div
                      key={ord.id}
                      className="p-4 sm:p-5 rounded-2xl glass-panel border border-slate-200 dark:border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-emerald-500/60"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Receipt className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                              REF: #{ref}
                            </span>
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                              SALE (SELLER)
                            </span>
                            <span className="text-[11px] text-gray-400 font-mono">
                              {new Date(ord.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <h4 className="font-bold text-sm sm:text-base text-white">
                            {targetListing?.title || 'Marketplace Item'} (x{ord.quantity})
                          </h4>
                          <p className="text-xs text-gray-300 mt-0.5">
                            Buyer: <strong className="text-white">{ord.buyerName}</strong> ({ord.buyerPhone}) · Hub: {ord.pickupLocation}
                          </p>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-lowveld-800">
                        <span className="text-base sm:text-lg font-black font-mono text-emerald-400">
                          {ord.currencyChoice} ${ord.totalPrice}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openReceiptForOrder(ord)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download Receipt</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* 2. Buyer Orders (Purchases placed by this account) */}
                {buyerOrders.map((bo, idx) => (
                  <div
                    key={`buyer-ord-${idx}`}
                    className="p-4 sm:p-5 rounded-2xl glass-panel border border-slate-200 dark:border-sky-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-sky-500/60"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/30">
                            REF: #{bo.reference || 'ZT-PURCHASE'}
                          </span>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">
                            PURCHASE (BUYER)
                          </span>
                          <span className="text-[11px] text-gray-400 font-mono">
                            {bo.date || 'Recent'}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm sm:text-base text-white">
                          {bo.listingTitle} (x{bo.quantity || 1})
                        </h4>
                        <p className="text-xs text-gray-300 mt-0.5">
                          Seller: <strong className="text-white">{bo.sellerName}</strong> · Pickup: {bo.collectionHub}
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-lowveld-800">
                      <span className="text-base sm:text-lg font-black font-mono text-emerald-400">
                        {bo.currency || 'USD'} ${bo.totalPrice}
                      </span>

                      <button
                        type="button"
                        onClick={() => openReceiptForBuyerOrder(bo)}
                        className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Receipt</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Trade Receipt Modal */}
      <TradeReceiptModal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        receipt={selectedReceipt}
      />

      <WhatsAppSimulatorModal isOpen={whatsAppOpen} onClose={() => setWhatsAppOpen(false)} />
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#070d09] flex items-center justify-center text-white text-xs">
        Loading Trader Dashboard...
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
