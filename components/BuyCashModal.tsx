'use client';

import React, { useState, useEffect } from 'react';
import { Listing } from '@/lib/types';
import { ShoppingBag, X, CheckCircle, MessageCircle, Send, DollarSign, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

interface BuyCashModalProps {
  listing: Listing | null;
  onClose: () => void;
}

export default function BuyCashModal({ listing, onClose }: BuyCashModalProps) {
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

  if (!listing) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl glass-panel border border-emerald-500/40 p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-lowveld-900/60 hover:bg-lowveld-800 text-gray-400 hover:text-white transition-colors"
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
              <div className="min-w-0">
                <h3 className="font-display font-bold text-xl text-white truncate">
                  {t.buyModalTitle}
                </h3>
                <p className="text-xs text-gray-300 truncate">
                  {t.buyModalSubtitle} <b className="text-emerald-400">{listing.user.fullName}</b> ({listing.locationArea})
                </p>
              </div>
            </div>

            {/* Target Item Summary Box (Fixed Overflow Alignment) */}
            <div className="p-3.5 rounded-xl bg-lowveld-950/90 border border-lowveld-800 mb-5 text-xs flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1 pr-2">
                <p className="text-gray-400">Target Item:</p>
                <p className="font-bold text-white text-sm line-clamp-2 leading-snug">{listing.title}</p>
                <p className="text-emerald-400 font-mono font-bold mt-1">
                  {listing.currency === 'BARTER' ? 'Open Cash Offer' : `${listing.price} ${listing.currency}`}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 whitespace-nowrap inline-block">
                  In Stock
                </span>
              </div>
            </div>

            {/* Cash Purchase Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">
                    {t.buyerName} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Farai Chauke"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-lowveld-950/90 border border-lowveld-800 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">
                    {t.buyerPhone} *
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
                    {t.pickupLocation} *
                  </label>
                  <select
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-lowveld-950/90 border border-lowveld-800 text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="Tshovani">Tshovani</option>
                    <option value="Chiredzi Light Industry">Chiredzi Light Industry</option>
                    <option value="Triangle Estate">Triangle Estate</option>
                    <option value="Hippo Valley">Hippo Valley</option>
                    <option value="Mkwasine">Mkwasine</option>
                    <option value="Buffalo Range">Buffalo Range</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-lowveld-950/90 border border-lowveld-800 text-white font-mono font-bold focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Order Notes / Handover Preferred Time
                </label>
                <input
                  type="text"
                  placeholder="e.g. Will pick up tomorrow at Light Industry workshop..."
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
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl bg-lowveld-900 hover:bg-lowveld-800 text-gray-300 font-semibold text-xs transition-colors"
              >
                Done & Return to Market
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
