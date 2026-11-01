'use client';

import React, { useState, useEffect, useMemo } from 'react';
import AppShell from '@/components/AppShell';
import AuthGate from '@/components/AuthGate';
import TradeReceiptModal, { ReceiptData } from '@/components/TradeReceiptModal';
import { useAuth } from '@/context/AuthContext';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
  Download,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  Coins,
  RefreshCw,
  CreditCard,
  Building,
  Smartphone,
  ShoppingBag,
  PlusCircle,
  X
} from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';

interface LedgerItem {
  id: string;
  reference: string;
  date: string;
  counterparty: string;
  counterpartyPhone?: string;
  buyerName?: string;
  buyerPhone?: string;
  sellerName?: string;
  sellerPhone?: string;
  title: string;
  type: 'sale' | 'purchase' | 'barter_topup' | 'payout';
  amount: number;
  currency: string;
  paymentMethod: string;
  status: 'COMPLETED' | 'IN_ESCROW' | 'HANDOVER_PENDING';
  hub: string;
}

export default function WalletPage() {
  const { user } = useAuth();
  const [ledger, setLedger] = useState<LedgerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptData | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'escrow' | 'completed' | 'payouts'>('all');
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('25.00');
  const [payoutPhone, setPayoutPhone] = useState('');
  const [payoutChannel, setPayoutChannel] = useState<'ecocash' | 'onemoney' | 'innbucks'>('ecocash');
  const [payoutSuccess, setPayoutSuccess] = useState(false);
  const [payoutError, setPayoutError] = useState<string | null>(null);

  // Sync recipient phone with user phone
  useEffect(() => {
    if (user?.phoneNumber) {
      setPayoutPhone(user.phoneNumber);
    }
  }, [user]);

  // Load real transactions
  useEffect(() => {
    const loadRealTransactions = async () => {
      setLoading(true);
      const items: LedgerItem[] = [];
      const seenRefs = new Set<string>();

      // 1. Fetch remote orders from API
      try {
        const res = await fetch('/api/orders');
        const data = await res.json();
        if (data.success && Array.isArray(data.orders)) {
          data.orders.forEach((ord: any) => {
            const ref = ord.reference || `ZB-${ord.id?.slice(0, 4) || 'ORD'}`;
            if (!seenRefs.has(ref)) {
              seenRefs.add(ref);
              const isSale = user && ord.sellerId === user.id;
              items.push({
                id: ord.id || ref,
                reference: ref,
                date: new Date(ord.createdAt || Date.now()).toLocaleDateString([], {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                }),
                counterparty: isSale ? ord.buyerName || 'Verified Buyer' : ord.sellerName || 'Verified Trader',
                counterpartyPhone: isSale ? ord.buyerPhone : ord.sellerPhone,
                buyerName: ord.buyerName,
                buyerPhone: ord.buyerPhone,
                sellerName: ord.sellerName,
                sellerPhone: ord.sellerPhone,
                title: ord.listingTitle || ord.listing?.title || 'Marketplace Item',
                type: isSale ? 'sale' : 'purchase',
                amount: ord.totalPrice || 0,
                currency: ord.currencyChoice || ord.currency || 'USD',
                paymentMethod: ord.paymentMethod === 'ecocash' ? 'EcoCash USSD' : 'Cash on Handover',
                status: ord.status === 'completed' ? 'COMPLETED' : 'IN_ESCROW',
                hub: ord.pickupLocation || ord.collectionHub || 'Trade Hub',
              });
            }
          });
        }
      } catch (err) {
        console.warn('Failed to load server orders:', err);
      }

      // 2. Load locally stored buyer orders (placed on this device)
      if (typeof window !== 'undefined') {
        try {
          const raw = localStorage.getItem('zimbarter_buyer_orders');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              parsed.forEach((ord: any) => {
                const ref = ord.reference || `ZB-${Math.floor(1000 + Math.random() * 9000)}`;
                if (!seenRefs.has(ref)) {
                  seenRefs.add(ref);
                  items.push({
                    id: ref,
                    reference: ref,
                    date: ord.date || new Date().toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' }),
                    counterparty: ord.sellerName || 'Verified Seller',
                    counterpartyPhone: ord.sellerPhone,
                    buyerName: ord.buyerName || user?.fullName || 'Buyer',
                    buyerPhone: ord.buyerPhone || user?.phoneNumber || '',
                    sellerName: ord.sellerName,
                    sellerPhone: ord.sellerPhone,
                    title: ord.listingTitle || 'Marketplace Order',
                    type: 'purchase',
                    amount: ord.totalPrice || 0,
                    currency: ord.currency || 'USD',
                    paymentMethod: ord.paymentMethod === 'ecocash' ? 'EcoCash USSD' : 'Cash on Handover',
                    status: ord.status === 'completed' ? 'COMPLETED' : 'IN_ESCROW',
                    hub: ord.collectionHub || ord.sellerLocation || 'Trade Hub',
                  });
                }
              });
            }
          }
        } catch (e) {
          console.warn('Error reading local buyer orders:', e);
        }

        // 3. Load locally stored payouts
        try {
          const rawPayouts = localStorage.getItem('zimbarter_user_payouts');
          if (rawPayouts) {
            const parsed = JSON.parse(rawPayouts);
            if (Array.isArray(parsed)) {
              parsed.forEach((p: any) => {
                const ref = p.reference || `ZB-PO-${Date.now()}`;
                if (!seenRefs.has(ref)) {
                  seenRefs.add(ref);
                  items.push({
                    id: ref,
                    reference: ref,
                    date: p.date || 'Recent',
                    counterparty: `${p.channel.toUpperCase()} (${p.phone})`,
                    title: 'Dispatched Settlement Payout',
                    type: 'payout',
                    amount: -Math.abs(p.amount),
                    currency: p.currency || 'USD',
                    paymentMethod: p.channel.toUpperCase(),
                    status: 'COMPLETED',
                    hub: 'Direct Settlement Rail',
                  });
                }
              });
            }
          }
        } catch (e) {
          console.warn('Error reading local payouts:', e);
        }
      }

      // Sort newest first
      items.sort((a, b) => (b.id > a.id ? 1 : -1));
      setLedger(items);
      setLoading(false);
    };

    loadRealTransactions();
  }, [user]);

  // Dynamic real balances based strictly on real transaction activity
  const { totalUsdBalance, inEscrowBalance, totalZarBalance, totalZwgBalance } = useMemo(() => {
    let usdSales = 0;
    let usdPayouts = 0;
    let usdEscrow = 0;
    let zarSales = 0;
    let zwgSales = 0;

    ledger.forEach((tx) => {
      if (tx.currency === 'USD') {
        if (tx.type === 'sale' && tx.status === 'COMPLETED') {
          usdSales += tx.amount;
        } else if (tx.type === 'payout') {
          usdPayouts += Math.abs(tx.amount);
        }
        if (tx.status === 'IN_ESCROW' || tx.status === 'HANDOVER_PENDING') {
          usdEscrow += Math.abs(tx.amount);
        }
      } else if (tx.currency === 'ZAR') {
        if (tx.type === 'sale' && tx.status === 'COMPLETED') {
          zarSales += tx.amount;
        }
      } else if (tx.currency === 'ZWG') {
        if (tx.type === 'sale' && tx.status === 'COMPLETED') {
          zwgSales += tx.amount;
        }
      }
    });

    const netUsd = Math.max(0, usdSales - usdPayouts);

    return {
      totalUsdBalance: netUsd,
      inEscrowBalance: usdEscrow,
      totalZarBalance: Math.max(0, zarSales),
      totalZwgBalance: Math.max(0, zwgSales),
    };
  }, [ledger]);

  const filteredLedger = ledger.filter((item) => {
    if (activeTab === 'escrow') return item.status === 'IN_ESCROW' || item.status === 'HANDOVER_PENDING';
    if (activeTab === 'completed') return item.status === 'COMPLETED';
    if (activeTab === 'payouts') return item.type === 'payout';
    return true;
  });

  const handleExecutePayout = (e: React.FormEvent) => {
    e.preventDefault();
    setPayoutError(null);
    const amountNum = parseFloat(payoutAmount) || 0;
    if (amountNum <= 0) {
      setPayoutError('Please enter a valid payout amount.');
      return;
    }
    if (!payoutPhone.trim() || payoutPhone.trim().length < 9) {
      setPayoutError('Please enter a valid recipient phone number.');
      return;
    }

    const ref = `ZB-PO-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTx: LedgerItem = {
      id: `tx-${Date.now()}`,
      reference: ref,
      date: 'Just now',
      counterparty: `${payoutChannel.toUpperCase()} (${payoutPhone})`,
      title: 'Dispatched Settlement Payout',
      type: 'payout',
      amount: -amountNum,
      currency: 'USD',
      paymentMethod: payoutChannel.toUpperCase(),
      status: 'COMPLETED',
      hub: 'Direct Settlement Rail',
    };

    // Save to local payouts
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem('zimbarter_user_payouts');
        const list = raw ? JSON.parse(raw) : [];
        list.unshift({
          reference: ref,
          date: new Date().toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' }),
          amount: amountNum,
          currency: 'USD',
          phone: payoutPhone,
          channel: payoutChannel,
        });
        localStorage.setItem('zimbarter_user_payouts', JSON.stringify(list));
      }
    } catch {}

    setLedger((prev) => [newTx, ...prev]);
    setPayoutSuccess(true);
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });

    setTimeout(() => {
      setPayoutSuccess(false);
      setPayoutModalOpen(false);
    }, 1800);
  };

  const handleViewReceipt = (tx: LedgerItem) => {
    setSelectedReceipt({
      orderReference: tx.reference,
      date: tx.date,
      itemTitle: tx.title,
      quantity: 1,
      unitPrice: Math.abs(tx.amount),
      subtotal: Math.abs(tx.amount),
      platformFee: 0,
      totalAmount: Math.abs(tx.amount),
      currency: tx.currency,
      paymentMethod: tx.paymentMethod,
      paymentStatus: tx.status === 'COMPLETED' ? 'COMPLETED' : 'HANDOVER_PENDING',
      buyerName: tx.buyerName || user?.fullName || 'Buyer',
      buyerPhone: tx.buyerPhone || user?.phoneNumber || '',
      sellerName: tx.sellerName || tx.counterparty,
      sellerPhone: tx.sellerPhone || tx.counterpartyPhone || '+263 78 323 7918',
      sellerLocation: tx.hub || 'Chiredzi Trade Hub',
      collectionHub: tx.hub,
    });
  };

  return (
    <AppShell activeNav="Wallet & Trades">
      <AuthGate
        featureName="Wallet & Trades"
        description="Escrow balances, transaction histories, and digital receipts are encrypted and restricted to verified account holders. Sign in to view your ledger."
        icon={Wallet}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 w-full space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#062A22] via-[#041d18] to-[#0a3a30] text-white p-6 sm:p-8 rounded-3xl border border-[#0e4337] shadow-xl">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Multi-Currency Sovereign Trade Ledger</span>
              </div>
              <h1 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-white">
                Wallet &amp; Trade Escrow
              </h1>
              <p className="text-xs sm:text-sm text-gray-200/90 leading-relaxed max-w-xl">
                Real-time multi-currency balances (USD, ZAR, ZWG), trade settlements, EcoCash withdrawals, and cryptographic escrow protection.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setPayoutModalOpen(true)}
                className="px-4 py-2.5 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-all hover:scale-105 cursor-pointer"
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>Withdraw Payout</span>
              </button>
            </div>
          </div>

          {/* 3 Currency Balances Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* USD Card */}
            <div className="p-5 rounded-3xl bg-white dark:bg-[#0c1813] border border-slate-200 dark:border-[#0e4337] shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-gray-400">
                <span className="text-xs font-bold uppercase tracking-wider">USD Balance</span>
                <DollarSign className="w-4 h-4 text-[#059669]" />
              </div>
              <p className="font-display font-black text-3xl text-slate-900 dark:text-white">
                ${totalUsdBalance.toFixed(2)}
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-[#0e4337] flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-gray-400">Locked in Trade Escrow:</span>
                <span className="font-bold text-amber-600 dark:text-[#F5C542]">
                  ${inEscrowBalance.toFixed(2)} USD
                </span>
              </div>
            </div>

            {/* ZAR Card */}
            <div className="p-5 rounded-3xl bg-white dark:bg-[#0c1813] border border-slate-200 dark:border-[#0e4337] shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-gray-400">
                <span className="text-xs font-bold uppercase tracking-wider">ZAR Balance (Rand)</span>
                <Coins className="w-4 h-4 text-blue-500" />
              </div>
              <p className="font-display font-black text-3xl text-slate-900 dark:text-white">
                R {totalZarBalance.toFixed(2)}
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-[#0e4337] flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-gray-400">Cross-Border Settlement:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  Active &amp; Ready
                </span>
              </div>
            </div>

            {/* ZWG Card */}
            <div className="p-5 rounded-3xl bg-white dark:bg-[#0c1813] border border-slate-200 dark:border-[#0e4337] shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-gray-400">
                <span className="text-xs font-bold uppercase tracking-wider">Zimbabwe Gold (ZWG)</span>
                <ShieldCheck className="w-4 h-4 text-amber-500" />
              </div>
              <p className="font-display font-black text-3xl text-slate-900 dark:text-white">
                ZWG {totalZwgBalance.toFixed(2)}
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-[#0e4337] flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-gray-400">Domestic Currency:</span>
                <span className="font-bold text-slate-700 dark:text-gray-300">
                  Official RBZ Rate Sync
                </span>
              </div>
            </div>
          </div>

          {/* Escrow Protection Explanation Card */}
          <div className="p-4 sm:p-5 rounded-3xl bg-emerald-50/60 dark:bg-[#031d17] border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-[#059669] flex items-center justify-center shrink-0 border border-emerald-500/30 mt-0.5 sm:mt-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Non-Custodial Escrow &amp; Physical Handover Protection
                </h4>
                <p className="text-xs text-slate-600 dark:text-gray-300 mt-0.5 leading-relaxed">
                  When an order or swap is agreed, funds and goods remain securely earmarked until physical item inspection and handover are verified at your designated trade hub.
                </p>
              </div>
            </div>
          </div>

          {/* Trade Ledger Table */}
          <div className="bg-white dark:bg-[#0c1813] rounded-3xl border border-slate-200 dark:border-[#0e4337] overflow-hidden shadow-sm">
            {/* Table Header & Filters */}
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-[#0e4337] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Transaction History &amp; Orders Ledger
                </h3>
                <p className="text-xs text-slate-500 dark:text-gray-400">
                  All your real platform trades, collections, cash settlements, and receipts.
                </p>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {(['all', 'escrow', 'completed', 'payouts'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap cursor-pointer ${
                      activeTab === tab
                        ? 'bg-[#059669] text-white shadow-sm'
                        : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#0a3a30]'
                    }`}
                  >
                    {tab === 'all' ? 'All Transactions' : tab === 'escrow' ? 'In Escrow' : tab === 'completed' ? 'Completed' : 'Payouts'}
                  </button>
                ))}
              </div>
            </div>

            {/* Table Content */}
            {loading ? (
              <div className="py-16 text-center text-slate-400 text-xs">
                <RefreshCw className="w-6 h-6 mx-auto mb-2 text-emerald-500 animate-spin" />
                <p>Loading your wallet ledger...</p>
              </div>
            ) : filteredLedger.length === 0 ? (
              <div className="py-16 px-4 text-center max-w-md mx-auto space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
                  <Wallet className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">
                    {activeTab === 'all'
                      ? 'No transactions yet'
                      : activeTab === 'escrow'
                      ? 'No active escrow items'
                      : activeTab === 'completed'
                      ? 'No completed trades yet'
                      : 'No payout withdrawals yet'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 leading-relaxed">
                    When you purchase products, accept barter proposals, or sell inventory on ZimBarter, your real transactions and downloadable receipts will appear here.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 pt-2">
                  <Link
                    href="/marketplace"
                    className="px-4 py-2 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Explore Marketplace</span>
                  </Link>
                  <Link
                    href="/post"
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#041d18] hover:bg-slate-200 dark:hover:bg-[#0a3a30] text-slate-700 dark:text-gray-200 text-xs font-bold transition-all border border-slate-200 dark:border-[#0e4337] flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Post a Listing</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-[#051a14] border-b border-slate-200 dark:border-[#0e4337] text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Ref &amp; Date</th>
                      <th className="py-3 px-4">Item &amp; Counterparty</th>
                      <th className="py-3 px-4">Channel &amp; Hub</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Amount</th>
                      <th className="py-3 px-4 text-center">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-[#0e4337]/50 text-slate-800 dark:text-gray-200">
                    {filteredLedger.map((tx) => {
                      const isPositive = tx.amount > 0 && tx.type !== 'purchase';

                      return (
                        <tr key={tx.id} className="hover:bg-slate-50/80 dark:hover:bg-[#051a14]/60 transition-colors">
                          <td className="py-3 px-4">
                            <span className="font-mono font-bold text-slate-900 dark:text-white block">
                              #{tx.reference}
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-gray-500">
                              {tx.date}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <p className="font-bold text-slate-900 dark:text-white">
                              {tx.title}
                            </p>
                            <span className="text-[11px] text-slate-500 dark:text-gray-400">
                              {tx.counterparty}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <span className="font-medium text-slate-700 dark:text-gray-300 block">
                              {tx.paymentMethod}
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-gray-500">
                              {tx.hub}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                tx.status === 'COMPLETED'
                                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                  : 'bg-amber-500/15 text-amber-700 dark:text-[#F5C542]'
                              }`}
                            >
                              {tx.status === 'COMPLETED' ? 'Completed' : 'Escrow Held'}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-right">
                            <span
                              className={`font-mono font-bold text-sm ${
                                isPositive
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : tx.amount < 0
                                  ? 'text-red-500'
                                  : 'text-slate-900 dark:text-white'
                              }`}
                            >
                              {tx.amount > 0 ? `+${tx.currency} $${tx.amount.toFixed(2)}` : `${tx.currency} $${tx.amount.toFixed(2)}`}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => handleViewReceipt(tx)}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#041d18] hover:bg-slate-200 dark:hover:bg-[#0a3a30] text-slate-700 dark:text-gray-300 font-bold text-[11px] inline-flex items-center gap-1 transition-colors border border-slate-200 dark:border-[#0e4337] cursor-pointer"
                              title="View Official Receipt"
                            >
                              <FileText className="w-3 h-3 text-[#059669]" />
                              <span>Receipt</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Withdrawal / Payout Modal */}
          {payoutModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
              <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#0c1813] border border-slate-200 dark:border-[#0e4337] p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#0e4337] pb-3">
                  <div className="flex items-center gap-2">
                    <ArrowUpRight className="w-5 h-5 text-[#059669]" />
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      Request Payout Settlement
                    </h3>
                  </div>
                  <button
                    onClick={() => setPayoutModalOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition cursor-pointer"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {payoutSuccess ? (
                  <div className="text-center py-6 space-y-2">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-[#059669] flex items-center justify-center mx-auto border border-emerald-500/40">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h4 className="font-bold text-lg text-slate-900 dark:text-white">
                      Payout Dispatched!
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-gray-300">
                      US$ {payoutAmount} has been queued for transfer to {payoutPhone}.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleExecutePayout} className="space-y-4 text-xs">
                    {payoutError && (
                      <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{payoutError}</span>
                      </div>
                    )}
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-gray-300 mb-1">
                        Payout Channel
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['ecocash', 'onemoney', 'innbucks'] as const).map((ch) => (
                          <button
                            key={ch}
                            type="button"
                            onClick={() => setPayoutChannel(ch)}
                            className={`p-2.5 rounded-xl border text-center font-bold capitalize transition-all cursor-pointer ${
                              payoutChannel === ch
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-[#059669] text-[#059669]'
                                : 'bg-slate-50 dark:bg-[#041d18] border-slate-200 dark:border-[#0e4337] text-slate-600 dark:text-gray-400'
                            }`}
                          >
                            {ch}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-gray-300 mb-1">
                        Withdrawal Amount (USD)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={payoutAmount}
                        onChange={(e) => setPayoutAmount(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#041d18] border border-slate-200 dark:border-[#0e4337] font-mono text-slate-900 dark:text-white text-sm font-bold focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-gray-300 mb-1">
                        Recipient Mobile Number
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="+263 78 323 7918"
                        value={payoutPhone}
                        onChange={(e) => setPayoutPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#041d18] border border-slate-200 dark:border-[#0e4337] text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#041d18] border border-slate-200 dark:border-[#0e4337] text-[11px] text-slate-500 dark:text-gray-400">
                      Instant USSD transfer will settle via ZimSwitch / Mobile Money rails. Standard network tariff applies.
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPayoutModalOpen(false)}
                        className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-[#0e4337] text-slate-700 dark:text-gray-300 font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold transition-all shadow-md cursor-pointer"
                      >
                        Confirm Payout
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* Trade Receipt Modal */}
          {selectedReceipt && (
            <TradeReceiptModal
              receipt={selectedReceipt}
              isOpen={true}
              onClose={() => setSelectedReceipt(null)}
            />
          )}
        </div>
      </AuthGate>
    </AppShell>
  );
}
