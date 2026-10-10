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
  AlertCircle
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
          /* Confirmation & Payment Verification Screen */
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30 shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-display font-extrabold text-xl text-slate-900 dark:text-white">
                {paymentMethod === 'ecocash' ? 'EcoCash USSD Prompt Sent!' : 'Order Successfully Placed!'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
                {paymentMethod === 'ecocash' 
                  ? `A mobile money USSD prompt was sent to ${ecoCashNumber || buyerPhone}. Please check your phone now and enter your EcoCash PIN to approve $${calculatedPrice} USD.`
                  : `Your order has been recorded for ${listing.user.fullName}. Notify the seller on WhatsApp to finalize collection at ${effectiveHub}.`}
              </p>
            </div>

            {orderReference && (
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-emerald-950/30 border border-slate-200 dark:border-emerald-500/20 font-mono text-xs text-emerald-600 dark:text-emerald-400 inline-block px-5">
                Order Reference: <strong>{orderReference}</strong>
              </div>
            )}

            {/* If EcoCash was used, interactive PIN prompt confirmation */}
            {paymentMethod === 'ecocash' && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-left space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  <Smartphone className="w-4 h-4 text-emerald-500 animate-pulse" />
                  <span>Mobile Handset Verification</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-gray-300 leading-relaxed">
                  {instructions || `Please enter your EcoCash PIN on ${ecoCashNumber || buyerPhone} to confirm the deduction of $${calculatedPrice} USD.`}
                </p>
                {!pinConfirmed ? (
                  <button
                    type="button"
                    onClick={() => setPinConfirmed(true)}
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>I Have Entered My PIN on My Phone</span>
                  </button>
                ) : (
                  <div className="p-2.5 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-2">
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
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <CreditCard className="w-4 h-4" />
                <span>Open Secure Paynow Card Gateway</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            {/* WhatsApp Notification Link to Seller */}
            <div className="space-y-2.5 pt-2">
              <a
                href={directWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-[#005c4b] hover:bg-[#00705b] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <MessageCircle className="w-4 h-4 text-emerald-300" />
                <span>Notify Seller ({listing.user.fullName}) on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={handleReturnToMarketplace}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-emerald-950/30 text-slate-700 dark:text-gray-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
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
