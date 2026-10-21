'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Phone,
  ChevronDown,
  Lock,
  Minus,
  Plus,
  Download,
  Printer,
  User,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '@/context/AuthContext';
import { formatCashOrderUrl } from '@/lib/whatsapp-messages';
import { addNotification } from '@/lib/notifications';
import TradeReceiptModal, { ReceiptData } from './TradeReceiptModal';

function EcoCashBadge({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#002b7f] text-white shadow-sm shrink-0 border border-[#001f5c] ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-[#e31b23] animate-pulse" />
      <span className="font-extrabold text-xs tracking-tight select-none">
        <span className="text-white">Eco</span>
        <span className="text-[#e31b23]">Cash</span>
      </span>
    </div>
  );
}

function CashBadge({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 shadow-sm shrink-0 ${className}`}>
      <Banknote className="w-3.5 h-3.5 text-amber-500" />
      <span className="font-extrabold text-xs tracking-tight select-none">CASH</span>
    </div>
  );
}

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
  const [paymentDropdownOpen, setPaymentDropdownOpen] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const paymentDropdownRef = useRef<HTMLDivElement>(null);

  // Close payment dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (paymentDropdownRef.current && !paymentDropdownRef.current.contains(e.target as Node)) {
        setPaymentDropdownOpen(false);
      }
    };
    if (paymentDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [paymentDropdownOpen]);

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
    setPaymentDropdownOpen(false);
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
        const ref = data.orderReference || `ZT-ORD-${Date.now().toString().slice(-4)}`;
        setOrderReference(ref);
        setOrderStatus(data.status || 'confirmed');
        setInstructions(data.instructions || '');
        if (data.redirectUrl) {
          setPaynowUrl(data.redirectUrl);
        }
        setSubmitted(true);
        confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });

        // Save to buyer transaction history in localStorage
        try {
          if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('zimbarter_buyer_orders');
            const list = stored ? JSON.parse(stored) : [];
            list.unshift({
              reference: ref,
              date: new Date().toLocaleDateString(),
              listingTitle: listing.title,
              quantity: qty,
              totalPrice: calculatedPrice,
              subtotal,
              fee: calculatedPrice - subtotal,
              currency: listing.currency,
              paymentMethod,
              sellerName: listing.user.fullName,
              sellerPhone: listing.user.phoneNumber,
              sellerLocation: listing.locationArea,
              buyerName,
              buyerPhone,
              collectionHub: effectiveHub,
              notes,
            });
            localStorage.setItem('zimbarter_buyer_orders', JSON.stringify(list));
          }
        } catch {}

        // Trigger real live notification for the trader
        addNotification({
          type: 'order',
          title: 'Cash Order Confirmed & Receipt Ready',
          desc: `Your order for "${listing.title}" (#${ref}) is confirmed. Total: ${listing.currency} $${calculatedPrice.toFixed(2)}.`,
          link: '/dashboard?tab=transactions',
          metadata: {
            buyerName,
            buyerPhone,
            itemTitle: listing.title,
            amount: calculatedPrice,
            currency: listing.currency,
          },
        });
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

  const sellerPhone = listing.user?.phoneNumber || '+263771234567';
  const cleanPhone = sellerPhone.replace(/\D/g, '');

  const directWhatsAppUrl = formatCashOrderUrl({
    sellerPhone: listing.user?.phoneNumber || '+263 77 123 4567',
    sellerName: listing.user?.fullName || 'Seller',
    listingTitle: listing.title,
    orderReference: orderReference || 'New Order',
    quantity: qty,
    totalPrice: calculatedPrice.toFixed(2),
    currency: listing.currency,
    paymentMethod,
    collectionHub: effectiveHub,
    buyerName,
    buyerPhone,
    notes,
  });

  const currentReceiptData: ReceiptData = {
    orderReference: orderReference || 'ZB-ORDER',
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    itemTitle: listing.title,
    category: listing.category,
    quantity: qty,
    unitPrice: listing.price || 0,
    subtotal: subtotal,
    platformFee: 0,
    totalAmount: calculatedPrice,
    currency: listing.currency,
    paymentMethod: paymentMethod.toUpperCase(),
    paymentStatus: paymentMethod === 'ecocash' ? 'PAID' : 'HANDOVER_PENDING',
    sellerName: listing.user?.fullName || 'Verified Seller',
    sellerPhone: listing.user?.phoneNumber || '+263 77 123 4567',
    sellerLocation: listing.locationArea || 'Zimbabwe',
    sellerVerified: true,
    buyerName: buyerName || 'Trader',
    buyerPhone: buyerPhone || '+263 77 000 0000',
    collectionHub: effectiveHub,
    notes: notes,
  };

  return (
    <>
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) handleDismiss();
        }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 dark:bg-black/85 backdrop-blur-md animate-fade-in cursor-pointer overflow-y-auto"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#0c1611] border border-slate-200 dark:border-emerald-500/30 p-5 sm:p-7 shadow-2xl overflow-hidden cursor-default my-auto text-slate-900 dark:text-gray-100 transition-colors"
        >
          {/* Top Emerald Accent Strip */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-[#F5C542]" />

          {/* Close Button */}
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Close checkout"
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 dark:bg-emerald-950/40 hover:bg-slate-200 dark:hover:bg-emerald-900/60 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {!submitted ? (
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between pr-8 border-b border-slate-100 dark:border-emerald-500/20 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20 shrink-0">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-base sm:text-lg text-slate-900 dark:text-white leading-tight">
                      Secure Checkout
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-gray-400">
                      ZimBarter Verified Escrow &amp; Trade Protection
                    </p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>256-Bit SSL</span>
                </div>
              </div>

              {/* International Standard Product Card with Image & Stepper */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-emerald-950/20 border border-slate-200/80 dark:border-emerald-500/20 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-black/40 overflow-hidden shrink-0 border border-slate-200 dark:border-emerald-500/30">
                    <img
                      src={listing.imageUrls?.[0] || 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=200&auto=format&fit=crop&q=80'}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                      {listing.title}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-gray-400 flex items-center gap-1">
                      <span>Seller:</span>
                      <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">{listing.user.fullName}</strong>
                    </p>
                  </div>
                </div>

                {/* Quantity Stepper */}
                <div className="flex items-center gap-1.5 shrink-0 bg-white dark:bg-[#070d09] px-2 py-1 rounded-xl border border-slate-200 dark:border-emerald-500/30">
                  <button
                    type="button"
                    onClick={() => setQuantity(String(Math.max(1, qty - 1)))}
                    className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-emerald-950/40 hover:bg-slate-200 dark:hover:bg-emerald-900/40 text-slate-600 dark:text-gray-300 flex items-center justify-center transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-mono font-bold text-xs px-1 text-slate-900 dark:text-white min-w-[18px] text-center">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(String(Math.min(99, qty + 1)))}
                    className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-emerald-950/40 hover:bg-slate-200 dark:hover:bg-emerald-900/40 text-slate-600 dark:text-gray-300 flex items-center justify-center transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Payment Method Selector (Clean Segmented Cards) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-2">
                  Select Payment Method:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {/* Option 1: EcoCash */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('ecocash')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      paymentMethod === 'ecocash'
                        ? 'bg-emerald-50/70 dark:bg-emerald-500/15 border-emerald-500 shadow-sm ring-1 ring-emerald-500'
                        : 'bg-slate-50 dark:bg-emerald-950/20 border-slate-200 dark:border-emerald-500/20 hover:border-slate-300 dark:hover:border-emerald-500/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <EcoCashBadge />
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        paymentMethod === 'ecocash' ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 dark:border-gray-600'
                      }`}>
                        {paymentMethod === 'ecocash' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-[11px] text-slate-900 dark:text-white leading-tight">EcoCash</p>
                      <p className="text-[10px] text-slate-500 dark:text-gray-400">Mobile USSD Push</p>
                    </div>
                  </button>

                  {/* Option 2: Cash Handover */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash_handover')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      paymentMethod === 'cash_handover'
                        ? 'bg-emerald-50/70 dark:bg-emerald-500/15 border-emerald-500 shadow-sm ring-1 ring-emerald-500'
                        : 'bg-slate-50 dark:bg-emerald-950/20 border-slate-200 dark:border-emerald-500/20 hover:border-slate-300 dark:hover:border-emerald-500/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <CashBadge />
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        paymentMethod === 'cash_handover' ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 dark:border-gray-600'
                      }`}>
                        {paymentMethod === 'cash_handover' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-[11px] text-slate-900 dark:text-white leading-tight">Cash on Delivery</p>
                      <p className="text-[10px] text-slate-500 dark:text-gray-400">Pay at Trade Hub</p>
                    </div>
                  </button>

                  {/* Option 3: Paynow Online Card */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paynow_web')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      paymentMethod === 'paynow_web'
                        ? 'bg-emerald-50/70 dark:bg-emerald-500/15 border-emerald-500 shadow-sm ring-1 ring-emerald-500'
                        : 'bg-slate-50 dark:bg-emerald-950/20 border-slate-200 dark:border-emerald-500/20 hover:border-slate-300 dark:hover:border-emerald-500/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-teal-600 text-white text-[10px] font-bold">
                        <CreditCard className="w-3 h-3" />
                        <span>PAYNOW</span>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        paymentMethod === 'paynow_web' ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 dark:border-gray-600'
                      }`}>
                        {paymentMethod === 'paynow_web' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-[11px] text-slate-900 dark:text-white leading-tight">Cards &amp; Web</p>
                      <p className="text-[10px] text-slate-500 dark:text-gray-400">Visa / Zimswitch</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Order Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                {/* Method-Specific Sub-box */}
                {paymentMethod === 'ecocash' && (
                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1.5 animate-in fade-in-50">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>EcoCash Phone Number to Prompt *</span>
                      </label>
                      <span className="text-[10px] text-emerald-600 font-mono">077... / 078...</span>
                    </div>
                    <input
                      type="tel"
                      required
                      placeholder="0771234567 or 078..."
                      value={ecoCashNumber}
                      onChange={(e) => setEcoCashNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-emerald-950/50 border border-emerald-500/30 text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:border-emerald-500 text-xs"
                    />
                    <p className="text-[10px] text-slate-500 dark:text-gray-400">
                      Instant USSD authorization will be pushed to your handset.
                    </p>
                  </div>
                )}

                {paymentMethod === 'cash_handover' && (
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-[11px] space-y-1 animate-in fade-in-50">
                    <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300">
                      <Banknote className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      <span>In-Person Trade Hub Settlement</span>
                    </div>
                    <p className="text-slate-600 dark:text-gray-300 leading-relaxed text-[10px]">
                      No upfront deduction. Meet seller, inspect goods thoroughly at <strong>{effectiveHub}</strong>, then hand over agreed cash (USD / ZWG / ZAR).
                    </p>
                  </div>
                )}

                {paymentMethod === 'paynow_web' && (
                  <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-[11px] space-y-1 animate-in fade-in-50">
                    <div className="flex items-center gap-1.5 font-bold text-teal-800 dark:text-teal-300">
                      <CreditCard className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      <span>Online Card &amp; Bank Gateway</span>
                    </div>
                    <p className="text-slate-600 dark:text-gray-300 text-[10px]">
                      You will be directed to Paynow&apos;s 3D-secure checkout for Visa, Mastercard, or Zimswitch.
                    </p>
                  </div>
                )}

                {/* Buyer Contact Details: 2 columns */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-slate-700 dark:text-gray-300 font-semibold mb-1 text-[11px] flex items-center gap-1">
                      <User className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span>Your Full Name *</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tendai Moyo"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-emerald-950/30 border border-slate-200 dark:border-emerald-500/20 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-gray-300 font-semibold mb-1 text-[11px] flex items-center gap-1">
                      <Phone className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span>WhatsApp Phone *</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+263 77..."
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-emerald-950/30 border border-slate-200 dark:border-emerald-500/20 text-slate-900 dark:text-white placeholder-slate-400 font-mono focus:outline-none focus:border-emerald-500 text-xs"
                    />
                  </div>
                </div>

                {/* Trade Hub Selector */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-700 dark:text-gray-300 font-semibold text-[11px] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span>Collection / Trade Hub *</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCustomHub(!isCustomHub)}
                      className="text-[10px] text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
                    >
                      {isCustomHub ? 'Suggested hubs' : '+ Custom location'}
                    </button>
                  </div>

                  {isCustomHub ? (
                    <input
                      type="text"
                      required
                      placeholder="Type town or growth point (e.g. Checheche Growth Point, Stand 14 Hippo Valley)..."
                      value={customHub}
                      onChange={(e) => setCustomHub(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-emerald-950/30 border border-emerald-500 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-xs"
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
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-emerald-950/30 border border-slate-200 dark:border-emerald-500/20 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 text-xs"
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

                {/* Handover Notes */}
                <div>
                  <label className="block text-slate-700 dark:text-gray-300 font-semibold mb-1 text-[11px]">
                    Handover Notes (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Can meet near Chiredzi Post Office around 2pm..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-emerald-950/30 border border-slate-200 dark:border-emerald-500/20 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 text-xs"
                  />
                </div>

                {/* International Standard Itemized Price Table */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-emerald-950/20 border border-slate-200/80 dark:border-emerald-500/20 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-600 dark:text-gray-400 text-[11px]">
                    <span>Item Subtotal ({qty} {qty === 1 ? 'unit' : 'units'})</span>
                    <span className="font-mono font-semibold">${subtotal.toFixed(2)} {listing.currency}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-gray-400 text-[11px]">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-500" />
                      <span>Trade Protection &amp; Escrow</span>
                    </span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">FREE ($0.00)</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 dark:border-emerald-500/20 flex items-center justify-between font-bold text-slate-900 dark:text-white">
                    <span>Total Amount:</span>
                    <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-base">
                      ${calculatedPrice.toFixed(2)} {listing.currency}
                    </span>
                  </div>
                </div>

                {/* Action Submit Button */}
                <button
                  id="checkout-submit-btn"
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer text-sm"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing Trade Order...</span>
                    </>
                  ) : paymentMethod === 'ecocash' ? (
                    <>
                      <Smartphone className="w-4 h-4" />
                      <span>Pay ${calculatedPrice.toFixed(2)} with EcoCash</span>
                    </>
                  ) : paymentMethod === 'paynow_web' ? (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Proceed to Paynow • ${calculatedPrice.toFixed(2)}</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Confirm Order (${calculatedPrice.toFixed(2)} Handover)</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* Confirmation, Seller Connection & Official Trade Receipt Screen */
            <div className="py-2 space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2 border border-emerald-500/30 shadow-md">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-display font-black text-lg sm:text-xl text-slate-900 dark:text-white">
                  {paymentMethod === 'ecocash' ? 'EcoCash USSD Prompt Sent!' : 'Order Confirmed & Verified!'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5 max-w-sm mx-auto">
                  {paymentMethod === 'ecocash' 
                    ? `Prompt dispatched to ${ecoCashNumber || buyerPhone}. Enter your PIN on handset.`
                    : `Trade slip recorded. Connect with seller to arrange collection at ${effectiveHub}.`}
                </p>
              </div>

              {/* Itemized Order Receipt Card */}
              <div className="rounded-2xl bg-slate-50 dark:bg-emerald-950/20 border border-dashed border-slate-300 dark:border-emerald-500/40 p-3.5 space-y-2.5 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-emerald-500/20 pb-2">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                    <FileText className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>TRADE RECEIPT</span>
                  </div>
                  <span className="font-mono text-emerald-700 dark:text-emerald-300 font-black px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-[11px]">
                    {orderReference || 'ZT-ORDER'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-gray-300">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Seller:</span>
                    <strong className="text-slate-900 dark:text-white">{listing.user.fullName}</strong>
                    <span className="block text-emerald-600 dark:text-emerald-400 font-mono text-[10px]">{listing.user.phoneNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Buyer:</span>
                    <strong className="text-slate-900 dark:text-white">{buyerName}</strong>
                    <span className="block font-mono text-[10px]">{buyerPhone}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-emerald-500/20 flex items-center justify-between font-mono text-xs">
                  <span className="font-sans text-slate-500 dark:text-gray-400">Total Amount:</span>
                  <strong className="text-emerald-600 dark:text-emerald-400 text-sm font-black">
                    ${calculatedPrice.toFixed(2)} {listing.currency}
                  </strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                {/* Primary Seller Connection Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <a
                    href={directWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-[#005c4b] hover:bg-[#00705b] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer text-center"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-300 shrink-0" />
                    <span className="truncate">WhatsApp Seller</span>
                  </a>

                  <a
                    href={`tel:${cleanPhone || '+263771234567'}`}
                    className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer text-center"
                  >
                    <Phone className="w-4 h-4 text-emerald-100 shrink-0" />
                    <span className="truncate">Call {listing.user?.fullName || 'Seller'}</span>
                  </a>
                </div>

                {/* International Standard Download / Print Receipt Button */}
                <button
                  type="button"
                  onClick={() => setShowReceiptModal(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-500/30 text-slate-800 dark:text-gray-200 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Download / Print Official Receipt</span>
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

      {/* Official Standalone Trade Receipt Modal */}
      {showReceiptModal && (
        <TradeReceiptModal
          isOpen={showReceiptModal}
          onClose={() => setShowReceiptModal(false)}
          receipt={currentReceiptData}
        />
      )}
    </>
  );
}
