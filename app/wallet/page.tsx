'use client';

import React, { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import TradeReceiptModal, { ReceiptData } from '@/components/TradeReceiptModal';
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
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LedgerItem {
  id: string;
  reference: string;
  date: string;
  counterparty: string;
  title: string;
  type: 'sale' | 'purchase' | 'barter_topup' | 'payout';
  amount: number;
  currency: string;
  paymentMethod: string;
  status: 'COMPLETED' | 'IN_ESCROW' | 'HANDOVER_PENDING';
  hub: string;
}

const DEFAULT_LEDGER: LedgerItem[] = [
  {
    id: 'tx-1',
    reference: 'ZB-9021',
    date: '31 Oct 2026, 18:30',
    counterparty: 'Prince A. Shumba',
    title: 'Solar Inverter & Lithium Battery (5kVA)',
    type: 'purchase',
    amount: 1250.00,
    currency: 'USD',
    paymentMethod: 'EcoCash (Instant USSD)',
    status: 'IN_ESCROW',
    hub: 'Harare CBD Hub',
  },
  {
    id: 'tx-2',
    reference: 'ZB-8842',
    date: '30 Oct 2026, 14:15',
    counterparty: 'Simba Chauke',
    title: 'Broiler farming (Metra Poultry)',
    type: 'barter_topup',
    amount: 10.00,
    currency: 'USD',
    paymentMethod: 'Cash on Handover',
    status: 'COMPLETED',
    hub: 'Triangle Estate Hub',
  },
  {
    id: 'tx-3',
    reference: 'ZB-7319',
    date: '28 Oct 2026, 09:45',
    counterparty: 'Farai Ncube',
    title: 'Broiler chicken crate wholesale (x50)',
    type: 'sale',
    amount: 300.00,
    currency: 'USD',
    paymentMethod: 'Paynow Online Card',
    status: 'COMPLETED',
    hub: 'Masvingo Urban Depot',
  },
  {
    id: 'tx-4',
    reference: 'ZB-6102',
    date: '25 Oct 2026, 11:20',
    counterparty: 'EcoCash Mobile Payout',
    title: 'Merchant Payout to +263773123456',
    type: 'payout',
    amount: -250.00,
    currency: 'USD',
    paymentMethod: 'EcoCash Payout',
    status: 'COMPLETED',
    hub: 'Direct Settlement',
  },
];

export default function WalletPage() {
  const [ledger, setLedger] = useState<LedgerItem[]>(DEFAULT_LEDGER);
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptData | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'escrow' | 'completed' | 'payouts'>('all');
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('100.00');
  const [payoutPhone, setPayoutPhone] = useState('+263 77 312 3456');
  const [payoutChannel, setPayoutChannel] = useState<'ecocash' | 'onemoney' | 'innbucks'>('ecocash');
  const [payoutSuccess, setPayoutSuccess] = useState(false);

  // Load locally saved orders if any
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedOrders = localStorage.getItem('zimbarter_buyer_orders');
        if (storedOrders) {
          const parsed = JSON.parse(storedOrders);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const mappedOrders: LedgerItem[] = parsed.map((ord: any) => ({
              id: ord.reference || `tx-${Date.now()}`,
              reference: ord.reference || `ZB-${Math.floor(1000 + Math.random() * 9000)}`,
              date: new Date(ord.createdAt || Date.now()).toLocaleDateString([], {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              }),
              counterparty: ord.sellerName || 'Verified Trader',
              title: ord.itemTitle || 'Marketplace Item',
              type: 'purchase',
              amount: ord.totalPrice || 0,
              currency: ord.currency || 'USD',
              paymentMethod: ord.paymentMethod === 'ecocash' ? 'EcoCash USSD' : 'Cash Handover',
              status: ord.status === 'completed' ? 'COMPLETED' : 'IN_ESCROW',
              hub: ord.collectionHub || 'Trade Hub',
            }));

            // Merge with default transactions avoiding duplicates
            const existingRefs = new Set(DEFAULT_LEDGER.map((d) => d.reference));
            const newOnes = mappedOrders.filter((m) => !existingRefs.has(m.reference));
            setLedger([...newOnes, ...DEFAULT_LEDGER]);
          }
        }
      } catch (e) {
        console.warn('Failed to load local orders in wallet:', e);
      }
    }
  }, []);

  const totalUsdBalance = 360.00;
  const inEscrowBalance = 1250.00;
  const totalZarBalance = 4500.00;
  const totalZwgBalance = 2850.00;

  const filteredLedger = ledger.filter((item) => {
    if (activeTab === 'escrow') return item.status === 'IN_ESCROW' || item.status === 'HANDOVER_PENDING';
    if (activeTab === 'completed') return item.status === 'COMPLETED';
    if (activeTab === 'payouts') return item.type === 'payout';
    return true;
  });

  const handleExecutePayout = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(payoutAmount) || 0;
    if (amountNum <= 0) return;

    const newTx: LedgerItem = {
      id: `tx-${Date.now()}`,
      reference: `ZB-PO-${Math.floor(1000 + Math.random() * 9000)}`,
      date: 'Just now',
      counterparty: `${payoutChannel.toUpperCase()} (${payoutPhone})`,
      title: `Instant Settlement Payout`,
      type: 'payout',
      amount: -amountNum,
      currency: 'USD',
      paymentMethod: payoutChannel.toUpperCase(),
      status: 'COMPLETED',
      hub: 'Instant USSD Settlement',
    };

    setLedger([newTx, ...ledger]);
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
      paymentStatus: tx.status === 'COMPLETED' ? 'PAID' : 'HANDOVER_PENDING',
      buyerName: 'Prince A. Shumba',
      buyerPhone: '+263 77 312 3456',
      sellerName: tx.counterparty,
      sellerPhone: '+263 77 456 7890',
      sellerLocation: tx.hub || 'Chiredzi Trade Hub',
      collectionHub: tx.hub,
    });
  };

  return (
    <AppShell activeNav="Wallet & Trades">
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
              className="px-4 py-2.5 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-all hover:scale-105"
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
              <span className="text-slate-500 dark:text-gray-400">Gold-Backed Domestic:</span>
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
                When an order is created, funds remain securely earmarked until physical item inspection and handover are verified at your designated trade hub.
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
                All platform trades, collections, cash settlements, and receipts.
              </p>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {(['all', 'escrow', 'completed', 'payouts'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${
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
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#041d18] hover:bg-slate-200 text-slate-700 dark:text-gray-300 font-bold text-[11px] inline-flex items-center gap-1 transition-colors border border-slate-200 dark:border-[#0e4337]"
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
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition"
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
                          className={`p-2.5 rounded-xl border text-center font-bold capitalize transition-all ${
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
                      className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-[#0e4337] text-slate-700 dark:text-gray-300 font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold transition-all shadow-md"
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
    </AppShell>
  );
}
