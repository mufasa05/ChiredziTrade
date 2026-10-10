'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Listing } from '@/lib/types';
import { ZIMBABWE_TRADE_HUBS, calculateTotalWithFee } from '@/lib/constants';
import { 
  X, 
  CheckCircle2, 
  MessageCircle, 
  ArrowLeft, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  MapPin, 
  ShieldCheck, 
  ExternalLink,
  Loader2,
  Copy,
  Check,
  Send,
  AlertCircle,
  FileText,
  Phone
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '@/context/AuthContext';

interface BuyCashModalProps {
  listing: Listing | null;
  isOpen?: boolean;
  onClose: () => void;
}

export type PaymentOption = 'ecocash' | 'direct_transfer' | 'cash_handover' | 'paynow_web';

export default function BuyCashModal({ listing, isOpen = true, onClose }: BuyCashModalProps) {
  const router = useRouter();
  const { user } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState<PaymentOption>('ecocash');
  const [buyerName, setBuyerName] = useState(user?.fullName || '');
  const [buyerPhone, setBuyerPhone] = useState(user?.phoneNumber || '');
  const [buyerEmail, setBuyerEmail] = useState(user?.email || '');
  const [ecoCashNumber, setEcoCashNumber] = useState(user?.phoneNumber || '');
  const [transactionCode, setTransactionCode] = useState('');
  const [selectedHub, setSelectedHub] = useState<string>('Chiredzi Town');
  const [customHub, setCustomHub] = useState<string>('');
  const [isCustomHub, setIsCustomHub] = useState(false);
  const [quantity, setQuantity] = useState('1');
  const [notes, setNotes] = useState('');
  
  // Submission & Post-Order States
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [orderReference, setOrderReference] = useState<string>('');
  const [orderStatus, setOrderStatus] = useState<string>('');
  const [instructions, setInstructions] = useState<string>('');
  const [paynowUrl, setPaynowUrl] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [pinConfirmed, setPinConfirmed] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.fullName) setBuyerName(user.fullName);
      if (user.phoneNumber) {
        setBuyerPhone(user.phoneNumber);
        setEcoCashNumber(user.phoneNumber);
      }
      if (user.email) setBuyerEmail(user.email);
      if (user.locationArea) {
        if (ZIMBABWE_TRADE_HUBS.includes(user.locationArea as any)) {
          setSelectedHub(user.locationArea);
          setIsCustomHub(false);
        } else {
          setIsCustomHub(true);
          setCustomHub(user.locationArea);
        }
      }
    }
  }, [user]);

  // Handle ESC key to dismiss modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleDismiss();
    };
    if (listing && isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [listing, isOpen]);

  if (!isOpen || !listing) return null;

  const handleDismiss = () => {
    setSubmitted(false);
    setPaynowUrl(null);
    setPinConfirmed(false);
    onClose();
  };

  const handleReturnToMarketplace = () => {
    handleDismiss();
    router.push('/');
  };

  const qty = Math.max(1, parseInt(quantity) || 1);
  const subtotal = (listing.price || 0) * qty;
  const { fee: platformFee, total: calculatedPrice } = calculateTotalWithFee(subtotal);
  const effectiveHub = isCustomHub ? (customHub.trim() || 'Custom Trade Hub') : selectedHub;

  const handleCopySellerPhone = () => {
    navigator.clipboard.writeText(listing.user.phoneNumber);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === 'direct_transfer' && !transactionCode.trim()) {
      alert('Please enter your EcoCash / InnBucks Transaction ID from your confirmation SMS to complete direct transfer.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/payments/paynow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: listing.id,
          amount: calculatedPrice,
          quantity: qty,
          buyerName: buyerName.trim() || 'Lowveld Trader',
          buyerPhone: buyerPhone.trim(),
          buyerEmail: buyerEmail.trim(),
          pickupLocation: effectiveHub,
          currencyChoice: listing.currency === 'BARTER' ? 'USD' : listing.currency,
          paymentMethod,
          mobileNumber: (paymentMethod === 'ecocash' ? ecoCashNumber : buyerPhone).trim(),
          transactionRef: transactionCode.trim(),
          notes: notes.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setOrderReference(data.orderReference || '');
        setOrderStatus(data.status || 'confirmed');
        setInstructions(data.instructions || '');
        if (data.redirectUrl) {
          setPaynowUrl(data.redirectUrl);
        }
        setSubmitted(true);
        confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
      } else {
        alert(`Order Error: ${data.error || 'Failed to process order'}`);
      }
    } catch (err) {
      console.error(err);
      alert('Network error while connecting to payment gateway.');
    } finally {
      setSubmitting(false);
    }
  };

  const cleanPhone = listing.user.phoneNumber.replace(/\D/g, '');
  const encodedWhatsApp = encodeURIComponent(
    `ORDER INQUIRY: Hi ${listing.user.fullName}, I have placed an order for "${listing.title}".\n\n` +
    `• Quantity: ${qty}\n` +
    `• Item Subtotal: $${subtotal.toFixed(2)} ${listing.currency}\n` +
    `• Platform Fee (5%): $${platformFee.toFixed(2)} ${listing.currency}\n` +
    `• Total Charged: $${calculatedPrice.toFixed(2)} ${listing.currency}\n` +
    `• Payment Method: ${paymentMethod === 'ecocash' ? 'EcoCash USSD Push' : paymentMethod === 'direct_transfer' ? `Direct Transfer (TX: ${transactionCode || 'Pending'})` : paymentMethod === 'cash_handover' ? 'Cash on Handover' : 'Paynow Online Card'}\n` +
    `• Order Ref: ${orderReference || 'New Order'}\n` +
    `• Collection Trade Hub: ${effectiveHub}\n` +
    `• Buyer: ${buyerName} (${buyerPhone})\n\n` +
    `Please confirm collection time!`
  );
  const directWhatsAppUrl = `https://wa.me/${cleanPhone}?text=${encodedWhatsApp}`;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) handleDismiss();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 dark:bg-black/85 backdrop-blur-md animate-fade-in cursor-pointer overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#0c1611] border border-slate-200 dark:border-emerald-500/30 p-5 sm:p-8 shadow-2xl overflow-hidden cursor-default my-auto text-slate-900 dark:text-gray-100 transition-colors"
      >
        {/* Top Accent Strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-500" />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 dark:bg-emerald-950/40 hover:bg-slate-200 dark:hover:bg-emerald-900/60 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
        >
          <X className="w-4 h-4" />
        </button>

        {!submitted ? (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-5 pr-8">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20 shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white">
                  Order &amp; Payment Options
                </h3>
                <p className="text-xs text-slate-500 dark:text-gray-400">
                  Seller: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{listing.user.fullName}</span> ({listing.locationArea})
                </p>
              </div>
            </div>

            {/* Target Item Pill */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-500/20 mb-5 flex items-center justify-between">
              <div className="min-w-0 pr-3">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Target Item</p>
                <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{listing.title}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Total Amount</span>
                <span className="font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
                  {listing.currency === 'BARTER' ? 'Barter Trade' : `${listing.currency} $${calculatedPrice.toLocaleString()}`}
                </span>
              </div>
            </div>

            {/* Payment Method Selector Grid */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-2">
                Select How You Want to Pay:
              </label>

              <div className="grid grid-cols-1 gap-2.5">
                {/* Method 1: EcoCash (USSD Push via Paynow) */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('ecocash')}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                    paymentMethod === 'ecocash'
                      ? 'bg-emerald-500/10 border-emerald-500 dark:border-emerald-400 ring-1 ring-emerald-500/40'
                      : 'bg-slate-50 dark:bg-emerald-950/10 border-slate-200 dark:border-emerald-500/20 hover:border-slate-300'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                        EcoCash (Mobile PIN Prompt)
                      </span>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                        Paynow Instant
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5">
                      Pushes a prompt to your EcoCash handset. Enter PIN to approve payment.
                    </p>
                  </div>
                </button>

                {/* Method 2: Direct EcoCash / InnBucks Transfer */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('direct_transfer')}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                    paymentMethod === 'direct_transfer'
                      ? 'bg-emerald-500/10 border-emerald-500 dark:border-emerald-400 ring-1 ring-emerald-500/40'
                      : 'bg-slate-50 dark:bg-emerald-950/10 border-slate-200 dark:border-emerald-500/20 hover:border-slate-300'
                  }`}
                >
                  <Send className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                        Direct Transfer (EcoCash / InnBucks to Seller)
                      </span>
                      <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400">
                        P2P Mobile
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5">
                      Transfer directly to seller ({listing.user.phoneNumber}) and enter approval code.
                    </p>
                  </div>
                </button>

                {/* Method 3: Cash on Handover / Collection */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash_handover')}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                    paymentMethod === 'cash_handover'
                      ? 'bg-emerald-500/10 border-emerald-500 dark:border-emerald-400 ring-1 ring-emerald-500/40'
                      : 'bg-slate-50 dark:bg-emerald-950/10 border-slate-200 dark:border-emerald-500/20 hover:border-slate-300'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                        Cash on Handover / Collection
                      </span>
                      <span className="text-[10px] font-bold text-slate-500">
                        USD / ZWG / ZAR
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5">
                      Pay physical cash upon meeting and inspecting goods at trade hub.
                    </p>
                  </div>
                </button>

                {/* Method 4: Cards & Zimswitch */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('paynow_web')}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                    paymentMethod === 'paynow_web'
                      ? 'bg-emerald-500/10 border-emerald-500 dark:border-emerald-400 ring-1 ring-emerald-500/40'
                      : 'bg-slate-50 dark:bg-emerald-950/10 border-slate-200 dark:border-emerald-500/20 hover:border-slate-300'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                        Visa / Mastercard / Zimswitch
                      </span>
                      <span className="text-[10px] font-bold text-indigo-500">
                        Online Card
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5">
                      Online 3D Secure checkout via Paynow payment gateway.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Order Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              {/* Method Specific Fields */}
              {paymentMethod === 'ecocash' && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>EcoCash Number to Charge *</span>
                    </label>
                    <span className="text-[10px] text-emerald-600 font-mono">077... / 078...</span>
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="0771234567 or 078..."
                    value={ecoCashNumber}
                    onChange={(e) => setEcoCashNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-emerald-950/40 border border-emerald-500/30 text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[11px] text-slate-600 dark:text-gray-300">
                    A USSD prompt will be sent to this number to authorize <strong>${calculatedPrice} USD</strong>.
                  </p>
                </div>
              )}

              {paymentMethod === 'direct_transfer' && (
                <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/30 space-y-3">
                  <div>
                    <span className="text-xs font-bold text-teal-800 dark:text-teal-300 block mb-1">
                      Seller&apos;s Mobile Money Details:
                    </span>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-teal-950/40 border border-teal-500/20 font-mono text-xs">
                      <div>
                        <span className="text-slate-500 dark:text-gray-400 text-[10px] block">Transfer to:</span>
                        <strong className="text-slate-900 dark:text-white">{listing.user.fullName} ({listing.user.phoneNumber})</strong>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopySellerPhone}
                        className="p-1.5 rounded-lg bg-teal-500/20 text-teal-700 dark:text-teal-300 hover:bg-teal-500/30 text-[11px] flex items-center gap-1"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-teal-800 dark:text-teal-300 mb-1">
                      EcoCash / InnBucks Transaction ID / Reference *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. MP261009.1420.H12345 or InnBucks approval code"
                      value={transactionCode}
                      onChange={(e) => setTransactionCode(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-teal-950/40 border border-teal-500/30 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-teal-500 text-xs sm:text-sm"
                    />
                    <p className="text-[11px] text-slate-600 dark:text-gray-300 mt-1">
                      Found in your EcoCash confirmation SMS after dialing *151#.
                    </p>
                  </div>
                </div>
              )}

              {/* Buyer Contact Details */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-gray-300 font-semibold mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tendai Moyo"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-emerald-950/30 border border-slate-200 dark:border-emerald-500/20 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-gray-300 font-semibold mb-1">
                    WhatsApp Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+263 77..."
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-emerald-950/30 border border-slate-200 dark:border-emerald-500/20 text-slate-900 dark:text-white placeholder-slate-400 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Trade Hub Selector with Suggestions + Custom Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-700 dark:text-gray-300 font-semibold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Collection / Trade Hub *</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCustomHub(!isCustomHub)}
                    className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
                  >
                    {isCustomHub ? 'Choose from suggested hubs' : '+ Enter custom town / location'}
                  </button>
                </div>

                {isCustomHub ? (
                  <input
                    type="text"
                    required
                    placeholder="Type your town, growth point or street (e.g. Checheche Growth Point, Jerera, Stand 14 Hippo Valley)..."
                    value={customHub}
                    onChange={(e) => setCustomHub(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-emerald-950/30 border border-emerald-500 dark:border-emerald-400 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <select
                    value={selectedHub}
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        setIsCustomHub(true);
                      } else {
                        setSelectedHub(e.target.value);
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-emerald-950/30 border border-slate-200 dark:border-emerald-500/20 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    {ZIMBABWE_TRADE_HUBS.map((hub) => (
                      <option key={hub} value={hub} className="bg-white text-slate-900 dark:bg-[#0c1611] dark:text-white">
                        {hub}
                      </option>
                    ))}
                    <option value="__custom__" className="bg-white text-emerald-600 dark:bg-[#0c1611] dark:text-emerald-400 font-bold">
                      + Enter Custom Location / Growth Point...
                    </option>
                  </select>
                )}
              </div>

              {/* Quantity Selector */}
              <div>
                <label className="block text-slate-700 dark:text-gray-300 font-semibold mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-emerald-950/30 border border-slate-200 dark:border-emerald-500/20 text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Transparent 5% Platform Fee & Total Breakdown */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-500/20 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600 dark:text-gray-400">
                  <span>Item Subtotal ({qty} {qty === 1 ? 'unit' : 'units'})</span>
                  <span className="font-mono font-semibold">${subtotal.toFixed(2)} {listing.currency}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Platform Facilitation &amp; Verification (5%)</span>
                  </span>
                  <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">+${platformFee.toFixed(2)} {listing.currency}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-emerald-500/20 flex items-center justify-between font-bold text-sm text-slate-900 dark:text-white">
                  <span>Total to Pay:</span>
                  <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-base">${calculatedPrice.toFixed(2)} {listing.currency}</span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-gray-400 pt-0.5 leading-tight">
                  * Seller receives 100% of their ${subtotal.toFixed(2)} asking price. The 5% facilitation fee covers platform hosting, anti-fraud checks, and WhatsApp connectivity.
                </p>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-gray-300 font-semibold mb-1">
                  Collection / Handover Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Can meet near Chiredzi Post Office around 2pm on Thursday..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-emerald-950/30 border border-slate-200 dark:border-emerald-500/20 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing Payment...</span>
                    </>
                  ) : paymentMethod === 'ecocash' ? (
                    <>
                      <Smartphone className="w-4 h-4" />
                      <span>Trigger EcoCash PIN Prompt • ${calculatedPrice} USD</span>
                    </>
                  ) : paymentMethod === 'direct_transfer' ? (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Confirm Direct Transfer Order • ${calculatedPrice} USD</span>
                    </>
                  ) : paymentMethod === 'paynow_web' ? (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Pay Online via Paynow Card • ${calculatedPrice} USD</span>
                    </>
                  ) : (
                    <>
                      <Banknote className="w-4 h-4" />
                      <span>Place Cash Handover Order • ${calculatedPrice} USD</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Confirmation, Seller Connection & Official Trade Receipt Screen */
          <div className="py-2 space-y-4">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2 border border-emerald-500/30 shadow-md">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="font-display font-extrabold text-xl text-slate-900 dark:text-white">
                {paymentMethod === 'ecocash' ? 'EcoCash USSD Prompt Sent!' : 'Order Verified & Recorded!'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
                {paymentMethod === 'ecocash' 
                  ? `Prompt dispatched to ${ecoCashNumber || buyerPhone}. Enter PIN on your phone to complete payment.`
                  : `Trade recorded on ZimBarter. Connect directly with the seller to finalize collection at ${effectiveHub}.`}
              </p>
            </div>

            {/* Official Itemized Trade Receipt Card */}
            <div className="rounded-2xl bg-slate-50 dark:bg-emerald-950/20 border border-dashed border-slate-300 dark:border-emerald-500/40 p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-emerald-500/20 pb-2.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                  <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>OFFICIAL TRADE RECEIPT</span>
                </div>
                <span className="font-mono text-emerald-700 dark:text-emerald-300 font-extrabold px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30">
                  {orderReference || 'ZT-ORDER'}
                </span>
              </div>

              {/* Order Meta */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-gray-300">
                <div>
                  <span className="text-slate-400 block text-[10px]">Seller Contact:</span>
                  <strong className="text-slate-900 dark:text-white">{listing.user.fullName}</strong>
                  <span className="block text-emerald-600 dark:text-emerald-400 font-mono">{listing.user.phoneNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Buyer:</span>
                  <strong className="text-slate-900 dark:text-white">{buyerName}</strong>
                  <span className="block font-mono">{buyerPhone}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-600 dark:text-gray-300 pt-1 border-t border-slate-200 dark:border-emerald-500/10">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Collection Trade Hub:</span>
                  <strong className="text-slate-900 dark:text-white">{effectiveHub}</strong>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-slate-400">Item:</span>
                  <strong className="text-slate-900 dark:text-white truncate max-w-[200px]">{listing.title} (x{qty})</strong>
                </div>
              </div>

              {/* Price & 5% Fee Breakdown on Receipt */}
              <div className="pt-2 border-t border-slate-200 dark:border-emerald-500/20 space-y-1 font-mono text-[11px]">
                <div className="flex justify-between text-slate-500 dark:text-gray-400">
                  <span>Seller Item Subtotal:</span>
                  <span>${subtotal.toFixed(2)} {listing.currency}</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-gray-400">
                  <span>Platform Fee (5%):</span>
                  <span>+${platformFee.toFixed(2)} {listing.currency}</span>
                </div>
                <div className="flex justify-between font-bold text-xs text-slate-900 dark:text-white pt-1 border-t border-slate-200 dark:border-emerald-500/20">
                  <span>Total Amount:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 text-sm">${calculatedPrice.toFixed(2)} {listing.currency}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400 font-mono">
                <span>Method: {paymentMethod.toUpperCase()}</span>
                <span>Date: {new Date().toLocaleDateString()}</span>
              </div>
            </div>

            {/* If EcoCash was used, interactive PIN prompt confirmation */}
            {paymentMethod === 'ecocash' && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-left space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  <Smartphone className="w-4 h-4 text-emerald-500 animate-pulse" />
                  <span>Mobile Handset PIN Prompt</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-gray-300">
                  {instructions || `Please enter your EcoCash PIN on ${ecoCashNumber || buyerPhone} to confirm deduction.`}
                </p>
                {!pinConfirmed ? (
                  <button
                    type="button"
                    onClick={() => setPinConfirmed(true)}
                    className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>I Have Entered My PIN on My Handset</span>
                  </button>
                ) : (
                  <div className="p-2 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>PIN Authorization Confirmed!</span>
                  </div>
                )}
              </div>
            )}

            {/* Paynow Card Web link if paynow_web selected */}
            {paynowUrl && paymentMethod === 'paynow_web' && (
              <a
                href={paynowUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg transition-all text-xs"
              >
                <CreditCard className="w-4 h-4" />
                <span>Open Secure Paynow Card Gateway</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            {/* Direct Seller Connection & Receipt Action Buttons */}
            <div className="space-y-2 pt-1">
              {/* Primary: Seller Direct Connection on WhatsApp & Direct Phone Call */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <a
                  href={directWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-3 rounded-xl bg-[#005c4b] hover:bg-[#00705b] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer text-center"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span className="truncate">WhatsApp Seller</span>
                </a>

                <a
                  href={`tel:${cleanPhone}`}
                  className="py-3 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer text-center"
                >
                  <Phone className="w-4 h-4 text-emerald-100 shrink-0" />
                  <span className="truncate">Call {listing.user.fullName}</span>
                </a>
              </div>

              {/* Secondary: Print / Save Trade Receipt */}
              <button
                type="button"
                onClick={() => {
                  const printWindow = window.open('', '_blank');
                  if (!printWindow) {
                    window.print();
                    return;
                  }
                  const receiptHtml = `
                    <!DOCTYPE html>
                    <html>
                      <head>
                        <title>Trade Receipt - ${orderReference}</title>
                        <style>
                          body { font-family: -apple-system, BlinkMacSystemFont, monospace, sans-serif; padding: 24px; max-width: 440px; margin: auto; }
                          .header { text-align: center; border-bottom: 2px dashed #222; padding-bottom: 12px; margin-bottom: 16px; }
                          .row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; }
                          .total { font-size: 15px; font-weight: bold; border-top: 2px dashed #222; padding-top: 10px; margin-top: 12px; }
                          .footer { text-align: center; font-size: 11px; margin-top: 24px; color: #555; }
                        </style>
                      </head>
                      <body>
                        <div class="header">
                          <h2>ZimBarter Trade Receipt</h2>
                          <p>Order Reference: <strong>${orderReference}</strong></p>
                          <p>${new Date().toLocaleString()}</p>
                        </div>
                        <div class="row"><span>Item:</span><strong>${listing.title} (x${qty})</strong></div>
                        <div class="row"><span>Seller:</span><strong>${listing.user.fullName} (${listing.user.phoneNumber})</strong></div>
                        <div class="row"><span>Buyer:</span><strong>${buyerName} (${buyerPhone})</strong></div>
                        <div class="row"><span>Collection Hub:</span><strong>${effectiveHub}</strong></div>
                        <div class="row"><span>Payment Method:</span><strong>${paymentMethod.toUpperCase()}</strong></div>
                        <hr style="border: 0; border-top: 1px dashed #ccc; margin: 12px 0;" />
                        <div class="row"><span>Seller Subtotal:</span><span>$${subtotal.toFixed(2)} ${listing.currency}</span></div>
                        <div class="row"><span>Platform Fee (5%):</span><span>+$${platformFee.toFixed(2)} ${listing.currency}</span></div>
                        <div class="row total"><span>Total Charged:</span><span>$${calculatedPrice.toFixed(2)} ${listing.currency}</span></div>
                        <div class="footer">
                          <p>Thank you for trading on ZimBarter!</p>
                          <p>Show this receipt when collecting your item at ${effectiveHub}.</p>
                        </div>
                      </body>
                    </html>
                  `;
                  printWindow.document.write(receiptHtml);
                  printWindow.document.close();
                  printWindow.focus();
                  setTimeout(() => printWindow.print(), 250);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-emerald-950/30 text-slate-700 dark:text-gray-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Print / Save Trade Receipt</span>
              </button>

              <button
                type="button"
                onClick={handleReturnToMarketplace}
                className="w-full py-2 px-4 rounded-xl text-slate-500 hover:text-slate-800 dark:text-gray-400 dark:hover:text-white font-medium text-xs transition-colors flex items-center justify-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Marketplace</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
