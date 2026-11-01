'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Listing, isUserVerified } from '@/lib/types';
import {
  MapPin,
  MessageCircle,
  RefreshCw,
  ShoppingBag,
  Heart,
  Star,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { formatListingInquiryUrl } from '@/lib/whatsapp-messages';

interface ListingCardProps {
  listing: Listing;
  onProposeBarter?: (listing: Listing) => void;
  onBuyCash?: (listing: Listing) => void;
  isFavorited?: boolean;
  onToggleFavorite?: (listing: Listing) => void;
}

export default function ListingCard({
  listing,
  onProposeBarter,
  onBuyCash,
  isFavorited = false,
  onToggleFavorite,
}: ListingCardProps) {
  const { isAuthenticated, openAuthModal } = useAuth();
  const [favorite, setFavorite] = useState(isFavorited);
  const [imgError, setImgError] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorite(!favorite);
    if (onToggleFavorite) onToggleFavorite(listing);
  };

  const handleBarterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onProposeBarter) onProposeBarter(listing);
  };

  const handleBuyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onBuyCash) {
      onBuyCash(listing);
    }
  };

  const currencySymbol = listing.currency === 'USD' ? '$' : listing.currency === 'ZAR' ? 'R' : listing.currency === 'ZWG' ? 'ZWG' : '$';
  const displayPrice = listing.price ? `${currencySymbol} ${listing.price.toLocaleString()} ${listing.currency}` : listing.currency === 'BARTER' ? 'BARTER ONLY' : `${currencySymbol} 0 ${listing.currency}`;

  const directWhatsAppUrl = formatListingInquiryUrl({
    sellerPhone: listing.user?.phoneNumber || '+263 78 323 7918',
    sellerName: listing.user?.fullName || 'Trader',
    listingTitle: listing.title,
    priceOrTerms: displayPrice,
    locationArea: listing.locationArea || 'Zimbabwe',
    listingId: listing.id,
  });

  const primaryImage =
    listing.imageUrls?.[0] ||
    'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&auto=format&fit=crop&q=80';

  const isSold = listing.status === 'sold';
  const sellerInitial = (listing.user?.fullName || 'T').trim().charAt(0).toLowerCase();

  return (
    <div className="group relative bg-white dark:bg-[#0c1813] rounded-2xl border border-[#E2E8E4] dark:border-[#0e4337] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
      {/* Top Image Section */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-black/40">
        <Link href={`/listing/${listing.id}`} className="block w-full h-full">
          {!imgError ? (
            <img
              src={primaryImage}
              alt={listing.title}
              onError={() => setImgError(true)}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="w-full h-full bg-slate-200 dark:bg-[#0a231b] flex items-center justify-center text-slate-400">
              <ShoppingBag className="w-8 h-8 opacity-50" />
            </div>
          )}
        </Link>

        {/* Top-Left: Price Glass Pill */}
        <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
          <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-[#031d17]/85 backdrop-blur-md text-[#10b981] border border-[#10b981]/30 shadow-md inline-flex items-center">
            {displayPrice}
          </span>
        </div>

        {/* Top-Right: Status & Location Badges */}
        <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5">
          {/* Status Badge */}
          {isSold ? (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-red-950/85 backdrop-blur-md text-red-400 border border-red-500/40 shadow-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span>SOLD</span>
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#031d17]/85 backdrop-blur-md text-emerald-400 border border-emerald-500/40 shadow-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>AVAILABLE</span>
            </span>
          )}

          {/* Location Badge */}
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-black/60 backdrop-blur-md text-gray-200 border border-white/10 shadow-sm flex items-center gap-1 max-w-[120px] truncate">
            <MapPin className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
            <span className="truncate">{listing.locationArea || 'Zimbabwe'}</span>
          </span>

          {/* Favorite Heart Button */}
          <button
            type="button"
            onClick={handleFavoriteClick}
            className="w-6 h-6 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md flex items-center justify-center text-white transition-all shadow-md ml-0.5"
            aria-label="Add to favorites"
          >
            <Heart
              className={`w-3 h-3 transition-colors ${
                favorite ? 'fill-red-500 text-red-500' : 'text-white'
              }`}
            />
          </button>
        </div>

        {/* Bottom-Left: 'New' Badge */}
        <div className="absolute bottom-2.5 left-2.5 z-10 pointer-events-none">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#041d18]/90 backdrop-blur-md text-emerald-400 border border-emerald-500/40 shadow-sm">
            New
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <Link href={`/listing/${listing.id}`}>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-1 group-hover:text-[#059669] transition-colors">
              {listing.title}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-xs text-slate-600 dark:text-gray-300 line-clamp-2 mt-1 leading-relaxed">
            {listing.description || 'Verified Zimbabwean marketplace trade offer.'}
          </p>

          {/* Category Hash Tag */}
          <div className="mt-2">
            <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-[#041d18] border border-emerald-500/30 text-[10px] sm:text-[11px] font-mono font-medium text-emerald-700 dark:text-emerald-400">
              #{listing.category?.replace(/_/g, ' ')}
            </span>
          </div>

          {/* Seller Profile Row with Star Rating */}
          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 dark:border-[#0e4337]/60">
            <div className="flex items-center gap-2 min-w-0">
              {listing.user?.avatarUrl ? (
                <img
                  src={listing.user.avatarUrl}
                  alt={listing.user.fullName || 'Trader'}
                  className="w-6 h-6 rounded-full object-cover shrink-0 border border-emerald-500/30"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-emerald-800 text-emerald-200 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                  {sellerInitial}
                </div>
              )}
              <span className="text-xs font-semibold text-slate-800 dark:text-gray-200 truncate">
                {listing.user?.fullName || 'Trader'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {isUserVerified(listing.user) && (
                <span title={Number(listing.user?.tradeCount || 0) >= 25 ? `Verified Trader (${listing.user.tradeCount} Trades)` : 'Admin Verified Trader'} className="text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </span>
              )}
              {listing.user?.rating && listing.user.rating > 0 && (listing.user.tradeCount || 0) > 0 ? (
                <div className="flex items-center gap-0.5 text-xs font-bold text-amber-500">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{listing.user.rating.toFixed(1)}</span>
                </div>
              ) : (
                <span className="text-[10px] text-slate-400 dark:text-gray-500 font-medium">New Trader</span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons: Buy (Cash USD/ZWG) & Swap Offer */}
        <div className="grid grid-cols-2 gap-2 mt-3 pt-1">
          {isSold ? (
            <>
              {/* Sold Out (Disabled) */}
              <button
                type="button"
                disabled
                className="py-2 px-2.5 rounded-xl bg-slate-100 dark:bg-[#062A22]/40 text-slate-400 dark:text-emerald-700 border border-slate-200 dark:border-[#0e4337]/40 text-xs font-bold flex items-center justify-center gap-1.5 cursor-not-allowed"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Sold Out</span>
              </button>

              {/* Direct WhatsApp Message Button */}
              <a
                href={directWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="py-2 px-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </>
          ) : listing.currency === 'BARTER' ? (
            /* Barter-only listing */
            <button
              type="button"
              onClick={handleBarterClick}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-[0.98]"
              title="Propose a Barter Swap or Asset Exchange"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Propose Barter Swap</span>
            </button>
          ) : listing.openToBarter === false ? (
            /* Cash-only listing */
            <button
              type="button"
              onClick={handleBuyClick}
              className="w-full py-2 px-3 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md hover:scale-[1.01] active:scale-[0.98]"
              title="Buy with EcoCash, OneMoney, Paynow or Cash on Handover"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Buy (Cash USD/ZWG)</span>
            </button>
          ) : (
            <>
              {/* Buy (Cash USD/ZWG) Button -> Launches BuyCashModal Checkout Logic */}
              <button
                type="button"
                onClick={handleBuyClick}
                className="py-2 px-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md hover:scale-[1.02] active:scale-[0.98]"
                title="Buy with EcoCash, OneMoney, Paynow or Cash on Handover"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Buy (Cash USD/ZWG)</span>
              </button>

              {/* Swap Offer Button -> Launches BarterProposalModal */}
              <button
                type="button"
                onClick={handleBarterClick}
                className="py-2 px-2.5 rounded-xl bg-[#d97706]/10 hover:bg-[#d97706]/20 border border-[#d97706]/70 text-[#f5c542] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors active:scale-[0.98]"
                title="Propose a Barter Swap or Asset Exchange"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Swap Offer</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
