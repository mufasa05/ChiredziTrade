'use client';

import React, { useState } from 'react';
import { X, Star, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  sellerId: string;
  sellerName: string;
  listingId?: string;
  onReviewSubmitted: () => void;
}

export default function ReviewModal({
  isOpen,
  onClose,
  sellerId,
  sellerName,
  listingId,
  onReviewSubmitted,
}: ReviewModalProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [tradeType, setTradeType] = useState<string>('Livestock & Farming Trade');
  const [reviewerName, setReviewerName] = useState<string>(user?.fullName || '');
  const [reviewerLocation, setReviewerLocation] = useState<string>(user?.locationArea || 'Tshovani');
  const [comment, setComment] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sellerId,
          listingId,
          reviewerName: reviewerName || 'Verified Trader',
          reviewerLocation,
          rating,
          tradeType,
          comment,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onReviewSubmitted();
          onClose();
        }, 1500);
      } else {
        setErrorMsg(data.error || 'Failed to submit review');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setErrorMsg('Network error while saving review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl glass-panel border border-emerald-500/30 p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-lowveld-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-display font-extrabold text-xl text-white">Review Published!</h3>
            <p className="text-xs text-gray-400">
              Thank you for strengthening trust and artisan reputation across the Lowveld.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-semibold mb-2">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Verified Trade Feedback</span>
              </div>
              <h3 className="font-display font-extrabold text-xl text-white">
                Review <span className="text-emerald-400">{sellerName}</span>
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Share your experience on product quality, negotiation fairness, and delivery speed.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            {/* STAR RATING PICKER */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Rating Score *
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        (hoverRating !== null ? hoverRating >= star : rating >= star)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-gray-600'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-xs font-bold text-amber-300">
                  {rating === 5 ? '5.0 - Excellent / Highly Recommended' : `${rating}.0 Stars`}
                </span>
              </div>
            </div>

            {/* TRADE TYPE CATEGORY */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Trade Category *
              </label>
              <select
                value={tradeType}
                onChange={(e) => setTradeType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-lowveld-950 text-white border border-lowveld-800 text-xs focus:outline-none focus:border-emerald-400"
              >
                <option value="Livestock & Cattle Farming">Livestock & Cattle Farming</option>
                <option value="Welding & Metal Fabrication">Welding & Metal Fabrication</option>
                <option value="Sugarcane & Freight Haulage">Sugarcane & Freight Haulage</option>
                <option value="Borehole & Solar Engineering">Borehole & Solar Engineering</option>
                <option value="Timber & Woodwork">Timber & Woodwork</option>
                <option value="Hardware & Spares">Hardware & Spares</option>
              </select>
            </div>

            {/* REVIEWER INFO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="e.g. Prince A. Shumba"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-lowveld-950 text-white border border-lowveld-800 text-xs focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Your Location *
                </label>
                <select
                  value={reviewerLocation}
                  onChange={(e) => setReviewerLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-lowveld-950 text-white border border-lowveld-800 text-xs focus:outline-none focus:border-emerald-400"
                >
                  <option value="Tshovani">Tshovani</option>
                  <option value="Chiredzi Town">Chiredzi Town</option>
                  <option value="Triangle Estate">Triangle Estate</option>
                  <option value="Hippo Valley">Hippo Valley</option>
                  <option value="Mkwasine">Mkwasine</option>
                  <option value="Buffalo Range">Buffalo Range</option>
                  <option value="Mwenezi / Rutenga">Mwenezi / Rutenga</option>
                </select>
              </div>
            </div>

            {/* COMMENT */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Your Review & Trade Experience *
              </label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was the product quality? Was the barter or cash transaction transparent and on time?"
                className="w-full px-3.5 py-2.5 rounded-xl bg-lowveld-950 text-white border border-lowveld-800 text-xs focus:outline-none focus:border-emerald-400"
              />
            </div>

            {/* SUBMIT BUTTON */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-lowveld-900 text-gray-300 text-xs font-bold hover:bg-lowveld-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !comment.trim()}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-lowveld-600 hover:from-emerald-400 hover:to-lowveld-500 text-white font-bold text-xs shadow-lg shadow-emerald-950 disabled:opacity-50 transition-all"
              >
                {submitting ? 'Submitting...' : 'Post Verified Review'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
