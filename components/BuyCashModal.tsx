'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Listing } from '@/lib/types';
import { ShoppingBag, X, CheckCircle, MessageCircle, Send, DollarSign, MapPin, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

interface BuyCashModalProps {
  listing: Listing | null;
  isOpen?: boolean;
  onClose: () => void;
}

export default function BuyCashModal({ listing, isOpen = true, onClose }: BuyCashModalProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [buyerName, setBuyerName] = useState(user?.fullName || '');
  const [buyerPhone, setBuyerPhone] = useState(user?.phoneNumber || '');
  const [pickupLocation, setPickupLocation] = useState(user?.locationArea || 'Tshovani');
  const [currencyChoice, setCurrencyChoice] = useState<'USD' | 'ZAR'>('USD');
  const [quantity, setQuantity] = useState('1');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.fullName) setBuyerName(user.fullName);
      if (user.phoneNumber) setBuyerPhone(user.phoneNumber);
      if (user.locationArea) setPickupLocation(user.locationArea);
    }
  }, [user]);

  // Handle ESC key to dismiss modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleDismiss();
      }
    };
    if (listing && isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [listing, isOpen]);

  if (!isOpen || !listing) return null;

  const handleDismiss = () => {
    setSubmitted(false);
    onClose();
  };

  const handleReturnToMarketplace = () => {
    handleDismiss();
    router.push('/');
  };

  const calculatedPrice = (listing.price || 0) * (parseInt(quantity) || 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: listing.id,
          buyerName,
          buyerPhone,
          pickupLocation,
          currencyChoice: listing.currency === 'BARTER' ? currencyChoice : listing.currency,
          quantity: parseInt(quantity) || 1,
          totalPrice: calculatedPrice,
          notes,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const cleanPhone = listing.user.phoneNumber.replace(/\D/g, '');
  const encodedText = encodeURIComponent(
    `CASH PURCHASE ORDER: Hi ${listing.user.fullName}, I want to buy "${listing.title}" for ${calculatedPrice > 0 ? `${calculatedPrice} ${listing.currency}` : 'Cash'}. Quantity: ${quantity}. Handover Hub: ${pickupLocation}. Buyer: ${buyerName} (${buyerPhone}). Please confirm availability.`
  );
  const directWhatsAppUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) handleDismiss();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-3xl glass-panel border border-emerald-500/40 p-6 sm:p-8 shadow-2xl overflow-hidden cursor-default"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-lowveld-900/80 hover:bg-lowveld-800 text-gray-400 hover:text-white transition-all shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-4 pr-8">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 shrink-0">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-white">
                  {t.buyModalTitle}
                </h3>
                <p className="text-xs text-gray-300">
                  {t.buyModalSubtitle} <b className="text-emerald-400">{listing.user.fullName}</b> ({listing.locationArea})
                </p>
              </div>
            </div>

            {/* Target Item Pill */}
            <div className="p-3.5 rounded-2xl bg-lowveld-950/80 border border-lowveld-800 mb-5 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-gray-400">Target Item:</p>
                <p className="font-bold text-white text-sm">{listing.title}</p>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-gray-400 block">Unit Price:</span>
                <span className="font-mono font-bold text-sm text-emerald-400">
                  {listing.currency === 'BARTER' ? 'Barter Trade' : `${listing.currency} $${listing.price?.toLocaleString()}`}
                </span>
              </div>
            </div>

            {/* Order Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Prince A. Shumba"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-lowveld-950/90 border border-lowveld-800 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">
                    Your WhatsApp Phone *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+263 77..."
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-lowveld-950/90 border border-lowveld-800 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">
                    Pickup Location Hub
                  </label>
                  <select
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-lowveld-950/90 border border-lowveld-800 text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="Tshovani">Tshovani Town</option>
                    <option value="Chiredzi Light Industry">Chiredzi Light Industry</option>
                    <option value="Hippo Valley">Hippo Valley Estate</option>
                    <option value="Triangle Estate">Triangle Estate</option>
                    <option value="Mkwasine">Mkwasine</option>
                    <option value="Buffalo Range">Buffalo Range</option>
                    <option value="Malipati">Malipati</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">
                    Quantity Needed
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-lowveld-950/90 border border-lowveld-800 text-white font-mono font-bold focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Delivery / Collection Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Can meet near Chiredzi Post Office around 2pm on Thursday..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-lowveld-950/90 border border-lowveld-800 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-200 flex items-center justify-between">
                <span>Handover Cash Payment:</span>
                <span className="font-mono font-extrabold text-sm text-emerald-400">
                  {calculatedPrice > 0 ? `${calculatedPrice} ${listing.currency}` : 'Cash Negotiable'}
                </span>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-lowveld-600 hover:from-emerald-400 hover:to-lowveld-500 text-white font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 transition-all disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{submitting ? 'Processing Order...' : t.submitCashOrder}</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/40">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-2xl text-white mb-2">
              {t.orderSubmitted}
            </h3>
            <p className="text-sm text-gray-300 mb-6 max-w-sm mx-auto">
              Your cash order is ready! Send your order directly to{' '}
              <b className="text-white">{listing.user.fullName}</b> on WhatsApp to arrange instant pickup:
            </p>

            <div className="space-y-3">
              <a
                href={directWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-[#005c4b] hover:bg-[#00705b] text-white font-bold flex items-center justify-center gap-2 shadow-xl shadow-emerald-950 transition-all"
              >
                <MessageCircle className="w-5 h-5 text-emerald-300" />
                <span>{t.openWhatsAppBuy}</span>
              </a>

              <button
                type="button"
                onClick={handleReturnToMarketplace}
                className="w-full py-3 px-4 rounded-xl bg-lowveld-900 hover:bg-lowveld-800 text-emerald-300 font-bold text-xs transition-colors flex items-center justify-center gap-2 border border-emerald-500/30 shadow-md"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Marketplace</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
