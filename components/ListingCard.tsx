'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Listing } from '@/lib/types';
import { 
  MapPin, 
  MessageCircle, 
  RefreshCw, 
  ShoppingBag, 
  Sparkles, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

interface ListingCardProps {
  listing: Listing;
  onProposeBarter?: (listing: Listing) => void;
  onBuyCash?: (listing: Listing) => void;
}

export default function ListingCard({ listing, onProposeBarter, onBuyCash }: ListingCardProps) {
  const { t } = useLanguage();
  const { isAuthenticated, openAuthModal } = useAuth();

  const handleBuyClick = () => {
    if (!isAuthenticated) {
      openAuthModal('Please sign in or create an account to place cash orders.');
      return;
    }
    if (onBuyCash) onBuyCash(listing);
  };

  const handleBarterClick = () => {
    if (!isAuthenticated) {
      openAuthModal('Please sign in or create an account to propose barter swaps.');
      return;
    }
    if (onProposeBarter) onProposeBarter(listing);
  };

  const cleanPhone = listing.user.phoneNumber.replace(/\D/g, '');
  const encodedText = encodeURIComponent(
    `Hi ${listing.user.fullName}, I saw your listing "${listing.title}" on ChiredziTrade. I want to buy it. Is it still available?`
  );
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;

  const [imgError, setImgError] = useState(false);
  const primaryImage = listing.imageUrls[0] || 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=80';

  return (
    <div className="group relative flex flex-col rounded-2xl glass-card overflow-hidden transition-all duration-300">
      {/* Image Header & Badges */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-lowveld-950">
        {!imgError ? (
          <img
            src={primaryImage}
            alt=""
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-lowveld-900 via-lowveld-950 to-emerald-950 flex flex-col items-center justify-center text-emerald-400 p-4 text-center">
            <ShoppingBag className="w-10 h-10 mb-1.5 opacity-60" />
            <span className="text-[11px] font-bold text-gray-400 line-clamp-1">{listing.title}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-darkbg via-transparent to-black/40 pointer-events-none" />

        {/* Currency & Price Badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {listing.currency === 'BARTER' ? (
            <span className="px-2.5 py-1 rounded-lg text-xs font-black badge-barter flex items-center gap-1 shadow-md">
              <RefreshCw className="w-3 h-3" />
              <span>{t.barterOnly}</span>
            </span>
          ) : (
            <span
              className={`px-2.5 py-1 rounded-lg text-xs font-extrabold shadow-md flex items-center gap-1 ${
                listing.currency === 'USD' ? 'badge-usd' : 'badge-zar'
              }`}
            >
              <span>
                {listing.currency === 'USD' ? '$' : 'R'} {listing.price?.toLocaleString()}
              </span>
              <span className="text-[10px] font-bold opacity-80">{listing.currency}</span>
            </span>
          )}
        </div>

        {/* Location Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 rounded-lg text-[11px] font-medium bg-black/60 backdrop-blur-md text-gray-200 border border-white/10 flex items-center gap-1 shadow-sm">
            <MapPin className="w-3 h-3 text-emerald-400" />
            <span>{listing.locationArea}</span>
          </span>
        </div>

        {/* Condition Grade or Harvest Ready */}
        <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5">
          {listing.harvestReady && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/90 text-white shadow-sm flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5" />
              <span>HARVEST READY</span>
            </span>
          )}
          {listing.conditionGrade && (
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-lowveld-950/80 backdrop-blur-md text-emerald-300 border border-emerald-500/30">
              {listing.conditionGrade}
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <Link href={`/listing/${listing.id}`}>
            <h3 className="font-display font-bold text-base sm:text-lg text-white group-hover:text-emerald-300 transition-colors line-clamp-2 leading-snug mb-2">
              {listing.title}
            </h3>
          </Link>

          {/* Description snippet */}
          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-3">
            {listing.description}
          </p>

          {/* Barter Callout Banner */}
          {listing.barterTerms && (
            <div className="p-2.5 rounded-xl glass-panel-amber border border-amber-500/30 mb-3 text-xs text-amber-200 flex items-start gap-2">
              <RefreshCw className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
              <div className="line-clamp-2">
                <span className="font-bold text-amber-300">{t.barterTerms}</span>
                {listing.barterTerms}
              </div>
            </div>
          )}

          {/* Tags */}
          {listing.imageTags && listing.imageTags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {listing.imageTags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-lowveld-950 text-[10px] text-gray-400 border border-lowveld-800"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer: Seller & Explicit Buy / Barter Actions */}
        <div className="pt-3 border-t border-lowveld-800/40">
          <div className="flex items-center justify-between mb-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-lowveld-800 flex items-center justify-center text-emerald-400 text-xs font-bold border border-lowveld-700">
                {listing.user.fullName.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="font-semibold text-gray-200 truncate max-w-[120px] sm:max-w-[140px]">
                  {listing.user.fullName}
                </p>
                {listing.user.verifiedArtisan && (
                  <p className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                    <ShieldCheck className="w-2.5 h-2.5" />
                    <span>Verified</span>
                  </p>
                )}
              </div>
            </div>

            <span className="text-[11px] text-gray-400 font-mono">
              ⭐ {listing.user.rating || '5.0'}
            </span>
          </div>

          {/* Action Buttons: Cash Buy + Barter Swap + WhatsApp */}
          <div className="grid grid-cols-2 gap-2">
            {/* BUY WITH CASH BUTTON */}
            <button
              onClick={handleBuyClick}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-lowveld-600 hover:from-emerald-400 hover:to-lowveld-500 text-white text-xs font-black transition-all shadow-md shadow-emerald-950/60"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{t.buyNowCash}</span>
            </button>

            {/* BARTER SWAP OR DETAIL BUTTON */}
            {listing.openToBarter || listing.currency === 'BARTER' ? (
              <button
                onClick={handleBarterClick}
                className="flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all"
              >
                <RefreshCw className="w-3 h-3 text-amber-400" />
                <span>{t.proposeBarter}</span>
              </button>
            ) : (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-[#005c4b] hover:bg-[#00705b] text-emerald-100 text-xs font-bold transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-300" />
                <span>WhatsApp</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
