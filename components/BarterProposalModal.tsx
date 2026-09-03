'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Listing } from '@/lib/types';
import { RefreshCw, X, CheckCircle, MessageCircle, Send, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '@/context/AuthContext';

interface BarterProposalModalProps {
  listing: Listing | null;
  onClose: () => void;
}

export default function BarterProposalModal({ listing, onClose }: BarterProposalModalProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [proposerName, setProposerName] = useState(user?.fullName || '');
  const [proposerPhone, setProposerPhone] = useState(user?.phoneNumber || '');
  const [proposerLocation, setProposerLocation] = useState(user?.locationArea || 'Tshovani');
  const [offeredItemTitle, setOfferedItemTitle] = useState('');
  const [offeredDescription, setOfferedDescription] = useState('');
  const [cashTopUp, setCashTopUp] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.fullName) setProposerName(user.fullName);
      if (user.phoneNumber) setProposerPhone(user.phoneNumber);
      if (user.locationArea) setProposerLocation(user.locationArea);
    }
  }, [user]);

  // Handle ESC key to dismiss modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleDismiss();
      }
    };
    if (listing) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [listing]);

  if (!listing) return null;

  const handleDismiss = () => {
    setSubmitted(false);
    onClose();
  };

  const handleReturnToMarketplace = () => {
    handleDismiss();
    router.push('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/barter/propose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: listing.id,
          proposerName,
          proposerPhone,
          proposerLocation,
          offeredItemTitle,
          offeredDescription,
          cashTopUp,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        confetti({
          particleCount: 80,
          spread: 70,
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
    `BARTER OFFER: Hi ${listing.user.fullName}, I want to propose a trade for "${listing.title}". I am offering: "${offeredItemTitle}" (${offeredDescription}) from ${proposerLocation}. My contact number is ${proposerPhone}.`
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
        className="relative w-full max-w-lg rounded-3xl glass-panel border border-amber-500/40 p-6 sm:p-8 shadow-2xl overflow-hidden cursor-default"
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
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40 shrink-0">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-white">
                  Propose Smart Barter Swap
                </h3>
                <p className="text-xs text-gray-300">
                  Trading with <b className="text-emerald-400">{listing.user.fullName}</b> ({listing.locationArea})
                </p>
              </div>
            </div>

            {/* Target Item Pill */}
            <div className="p-3 rounded-xl bg-lowveld-950/80 border border-lowveld-800 mb-5 text-xs">
              <p className="text-gray-400">Target Item:</p>
              <p className="font-bold text-white text-sm">{listing.title}</p>
              {listing.barterTerms && (
                <p className="text-amber-300 mt-1">
                  <b>Seller seeks:</b> {listing.barterTerms}
                </p>
              )}
            </div>

            {/* Proposal Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  What item / service are you offering in return? *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2 Boer goats, 20 bags maize, borehole repair, tractor ploughing"
                  value={offeredItemTitle}
                  onChange={(e) => setOfferedItemTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-lowveld-950/90 border border-lowveld-800 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Details of your offer (Quantity, Condition, Terms)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Healthy 2-year-old Boer goat ewes vaccinated, or 5 hectares disc ridging..."
                  value={offeredDescription}
                  onChange={(e) => setOfferedDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-lowveld-950/90 border border-lowveld-800 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Prince A. Shumba"
                    value={proposerName}
                    onChange={(e) => setProposerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-lowveld-950/90 border border-lowveld-800 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
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
                    value={proposerPhone}
                    onChange={(e) => setProposerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-lowveld-950/90 border border-lowveld-800 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">
                    Your Location
                  </label>
                  <select
                    value={proposerLocation}
                    onChange={(e) => setProposerLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-lowveld-950/90 border border-lowveld-800 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Tshovani">Tshovani</option>
                    <option value="Chiredzi Light Industry">Chiredzi Light Industry</option>
                    <option value="Triangle Estate">Triangle Estate</option>
                    <option value="Hippo Valley">Hippo Valley</option>
                    <option value="Mkwasine">Mkwasine</option>
                    <option value="Buffalo Range">Buffalo Range</option>
                    <option value="Malipati">Malipati</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">
                    Cash Top-Up (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. + $50 USD or + 500 ZAR"
                    value={cashTopUp}
                    onChange={(e) => setCashTopUp(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-lowveld-950/90 border border-lowveld-800 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-lowveld-950 font-black flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40 transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Submitting...' : 'Submit Barter Proposal'}</span>
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
              Barter Offer Logged!
            </h3>
            <p className="text-sm text-gray-300 mb-6 max-w-sm mx-auto">
              Your trade offer has been recorded. To speed up the deal, send this offer directly to{' '}
              <b className="text-white">{listing.user.fullName}</b> on WhatsApp now:
            </p>

            <div className="space-y-3">
              <a
                href={directWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-[#005c4b] hover:bg-[#00705b] text-white font-bold flex items-center justify-center gap-2 shadow-xl shadow-emerald-950 transition-all"
              >
                <MessageCircle className="w-5 h-5 text-emerald-300" />
                <span>Open Pre-filled WhatsApp Chat</span>
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
