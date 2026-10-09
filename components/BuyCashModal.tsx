'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Listing } from '@/lib/types';
import { ZIMBABWE_TRADE_HUBS } from '@/lib/constants';
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
  ChevronRight,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '@/context/AuthContext';

interface BuyCashModalProps {
  listing: Listing | null;
  isOpen?: boolean;
  onClose: () => void;
}

type PaymentMethod = 'paynow' | 'cash_handover' | 'direct_ecocash';

export default function BuyCashModal({ listing, isOpen = true, onClose }: BuyCashModalProps) {
  const router = useRouter();
  const { user } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('paynow');
  const [buyerName, setBuyerName] = useState(user?.fullName || '');
  const [buyerPhone, setBuyerPhone] = useState(user?.phoneNumber || '');
  const [selectedHub, setSelectedHub] = useState<string>('Chiredzi Town');
  const [customHub, setCustomHub] = useState<string>('');
  const [isCustomHub, setIsCustomHub] = useState(false);
  const [quantity, setQuantity] = useState('1');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [paynowUrl, setPaynowUrl] = useState<string | null>(null);
  const [orderReference, setOrderReference] = useState<string>('');

  useEffect(() => {
    if (user) {
      if (user.fullName) setBuyerName(user.fullName);
      if (user.phoneNumber) setBuyerPhone(user.phoneNumber);
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
    onClose();
  };

  const handleReturnToMarketplace = () => {
    handleDismiss();
    router.push('/');
  };

  const qty = Math.max(1, parseInt(quantity) || 1);
  const calculatedPrice = (listing.price || 0) * qty;
  const effectiveHub = isCustomHub ? (customHub.trim() || 'Custom Trade Hub') : selectedHub;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (paymentMethod === 'paynow') {
        // Initiate Paynow Zimbabwe transaction
        const res = await fetch('/api/payments/paynow', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            listingId: listing.id,
            amount: calculatedPrice,
            quantity: qty,
            buyerName,
            buyerPhone,
            pickupLocation: effectiveHub,
            currencyChoice: listing.currency === 'BARTER' ? 'USD' : listing.currency,
            notes,
          }),
        });

        const data = await res.json();
        if (data.success) {
          setOrderReference(data.orderReference || '');
          if (data.redirectUrl) {
            setPaynowUrl(data.redirectUrl);
          }
          setSubmitted(true);
          confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
        } else {
          alert(`Payment Error: ${data.error || 'Failed to initialize Paynow'}`);
        }
      } else {
        // Standard Cash on Handover or Direct EcoCash Order
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            listingId: listing.id,
            buyerName,
            buyerPhone,
            pickupLocation: effectiveHub,
            currencyChoice: listing.currency === 'BARTER' ? 'USD' : listing.currency,
            quantity: qty,
            totalPrice: calculatedPrice,
            notes: `[PAYMENT: ${paymentMethod.toUpperCase()}] ${notes}`.trim(),
          }),
        });

        if (res.ok) {
          setSubmitted(true);
          confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
        }
      }
    } catch (err) {
      console.error(err);
      alert('Network error while processing order');
    } finally {
      setSubmitting(false);
    }
  };

  const cleanPhone = listing.user.phoneNumber.replace(/\D/g, '');
  const encodedWhatsApp = encodeURIComponent(
    `ORDER INQUIRY: Hi ${listing.user.fullName}, I want to order "${listing.title}". Quantity: ${qty}. Total: ${calculatedPrice > 0 ? `${calculatedPrice} ${listing.currency}` : 'Cash'}. Payment: ${paymentMethod === 'paynow' ? 'Paynow (EcoCash/Card)' : paymentMethod === 'direct_ecocash' ? 'Direct EcoCash' : 'Cash on Handover'}. Collection Hub: ${effectiveHub}. Buyer: ${buyerName} (${buyerPhone}). Please confirm.`
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
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white">
                  Checkout &amp; Order
                </h3>
                <p className="text-xs text-slate-500 dark:text-gray-400">
                  Seller: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{listing.user.fullName}</span> ({listing.locationArea})
                </p>
              </div>
            </div>

            {/* Target Item Pill */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-500/20 mb-5 flex items-center justify-between">
              <div className="min-w-0 pr-3">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Item</p>
                <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{listing.title}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Price</span>
                <span className="font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
                  {listing.currency === 'BARTER' ? 'Barter Trade' : `${listing.currency} $${(listing.price || 0).toLocaleString()}`}
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-2">
                Choose Payment Method
              </label>
              <div className="grid grid-cols-1 gap-2.5">
                {/* Method 1: Paynow (EcoCash / OneMoney / Cards) */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('paynow')}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                    paymentMethod === 'paynow'
                      ? 'bg-emerald-500/10 border-emerald-500 dark:border-emerald-400 ring-1 ring-emerald-500/40'
                      : 'bg-slate-50 dark:bg-emerald-950/10 border-slate-200 dark:border-emerald-500/20 hover:border-slate-300'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                        Paynow Zimbabwe
                      </span>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                        Instant
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5">
                      EcoCash, OneMoney, Visa, Mastercard &amp; Zimswitch
                    </p>
                  </div>
                </button>

                {/* Method 2: Cash on Collection */}
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
                      Pay physical cash upon meeting and inspecting goods
                    </p>
                  </div>
                </button>

                {/* Method 3: Direct EcoCash / InnBucks */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('direct_ecocash')}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                    paymentMethod === 'direct_ecocash'
                      ? 'bg-emerald-500/10 border-emerald-500 dark:border-emerald-400 ring-1 ring-emerald-500/40'
                      : 'bg-slate-50 dark:bg-emerald-950/10 border-slate-200 dark:border-emerald-500/20 hover:border-slate-300'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                        Direct Transfer (EcoCash / InnBucks)
                      </span>
                      <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400">
                        P2P
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5">
                      Send directly to seller&apos;s phone number: {listing.user.phoneNumber}
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Order Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
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
                    Your WhatsApp Phone *
                  </label>
                  <input
                    type="text"
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

              <div className="grid grid-cols-2 gap-3">
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

                <div>
                  <label className="block text-slate-700 dark:text-gray-300 font-semibold mb-1">
                    Total Amount
                  </label>
                  <div className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-mono font-extrabold flex items-center justify-between">
                    <span>{listing.currency}</span>
                    <span>${calculatedPrice.toLocaleString()}</span>
                  </div>
                </div>
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
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Connecting Payment Gateway...</span>
                    </>
                  ) : paymentMethod === 'paynow' ? (
                    <>
                      <Smartphone className="w-4 h-4" />
                      <span>Pay with Paynow (EcoCash / Card) • ${calculatedPrice}</span>
                    </>
                  ) : paymentMethod === 'direct_ecocash' ? (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Confirm Direct Transfer Order • ${calculatedPrice}</span>
                    </>
                  ) : (
                    <>
                      <Banknote className="w-4 h-4" />
                      <span>Place Cash Handover Order • ${calculatedPrice}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Confirmation Screen */
          <div className="text-center py-5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3 border border-emerald-500/30">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="font-display font-extrabold text-xl text-slate-900 dark:text-white mb-1">
              Order Confirmed!
            </h3>
            <p className="text-xs text-slate-500 dark:text-gray-400 mb-5 max-w-sm mx-auto">
              {paymentMethod === 'paynow'
                ? 'Your Paynow payment session has been generated. Proceed below to complete EcoCash/Card payment:'
                : `Order recorded for ${listing.user.fullName}. Contact seller on WhatsApp to finalize collection:`}
            </p>

            {orderReference && (
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-emerald-950/30 border border-slate-200 dark:border-emerald-500/20 font-mono text-xs text-emerald-600 dark:text-emerald-400 mb-4 inline-block px-4">
                Ref: {orderReference}
              </div>
            )}

            <div className="space-y-3">
              {paynowUrl && (
                <a
                  href={paynowUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Open Paynow (EcoCash / Card)</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              <a
                href={directWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[#005c4b] hover:bg-[#00705b] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <MessageCircle className="w-4 h-4 text-emerald-300" />
                <span>Notify Seller on WhatsApp</span>
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
