'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import BarterProposalModal from '@/components/BarterProposalModal';
import BuyCashModal from '@/components/BuyCashModal';
import WhatsAppSimulatorModal from '@/components/WhatsAppSimulatorModal';
import { Listing, BarterMatch } from '@/lib/types';
import { 
  ArrowLeft, 
  MapPin, 
  MessageCircle, 
  RefreshCw, 
  ShieldCheck, 
  Sparkles, 
  ShoppingBag,
  Share2,
  Tag
} from 'lucide-react';
import { LanguageProvider, useLanguage } from '@/context/LanguageContext';

function ListingDetailContent() {
  const params = useParams();
  const id = params?.id as string;
  const { t } = useLanguage();

  const [listing, setListing] = useState<Listing | null>(null);
  const [barterMatches, setBarterMatches] = useState<BarterMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState(0);
  const [barterModalOpen, setBarterModalOpen] = useState(false);
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [whatsAppOpen, setWhatsAppOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchListingAndMatches = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/listings/${id}`);
        const data = await res.json();
        if (data.success && data.listing) {
          setListing(data.listing);

          const matchRes = await fetch(`/api/barter/match?listingId=${id}`);
          const matchData = await matchRes.json();
          if (matchData.success) {
            setBarterMatches(matchData.matches);
          }
        }
      } catch (err) {
        console.error('Error fetching listing details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchListingAndMatches();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col bg-[#070d09]">
        <Navbar onOpenWhatsApp={() => setWhatsAppOpen(true)} />
        <div className="max-w-5xl mx-auto px-4 py-16 w-full text-center">
          <div className="w-12 h-12 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Loading Lowveld listing details...</p>
        </div>
      </main>
    );
  }

  if (!listing) {
    return (
      <main className="min-h-screen flex flex-col bg-[#070d09]">
        <Navbar onOpenWhatsApp={() => setWhatsAppOpen(true)} />
        <div className="max-w-lg mx-auto px-4 py-20 text-center glass-panel rounded-3xl mt-12">
          <h2 className="text-2xl font-bold text-white mb-2">Listing Not Found</h2>
          <p className="text-sm text-gray-400 mb-6">
            This trade listing might have been concluded or archived.
          </p>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-md inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Marketplace</span>
          </Link>
        </div>
      </main>
    );
  }

  const cleanPhone = listing.user.phoneNumber.replace(/\D/g, '');
  const encodedText = encodeURIComponent(
    `Hi ${listing.user.fullName}, I saw your listing "${listing.title}" on ChiredziTrade. Is this still available?`
  );
  const directWhatsAppUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#070d09]">
      <Navbar onOpenWhatsApp={() => setWhatsAppOpen(true)} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 w-full flex-1">
        {/* Top Breadcrumb & Share */}
        <div className="flex items-center justify-between gap-4 mb-6 text-xs sm:text-sm">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-gray-400 hover:text-emerald-400 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Marketplace</span>
          </Link>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-lowveld-900/80 hover:bg-lowveld-800 text-gray-300 hover:text-white border border-lowveld-700/60 transition-all text-xs font-semibold"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{copiedLink ? 'Link Copied!' : 'Share Listing'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-3xl overflow-hidden glass-panel border border-lowveld-800/60 shadow-2xl">
              <div className="relative h-72 sm:h-96 w-full bg-lowveld-950 overflow-hidden">
                <img
                  src={listing.imageUrls[activePhoto] || listing.imageUrls[0]}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-darkbg/80 via-transparent to-transparent pointer-events-none" />

                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-black/70 backdrop-blur-md text-gray-200 border border-white/10 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{listing.locationArea}</span>
                  </span>
                </div>

                <div className="absolute top-4 right-4 flex gap-1.5">
                  {listing.harvestReady && (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-600 text-white shadow-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>HARVEST READY</span>
                    </span>
                  )}
                  {listing.conditionGrade && (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-lowveld-950/80 backdrop-blur-md text-emerald-300 border border-emerald-500/30">
                      {listing.conditionGrade}
                    </span>
                  )}
                </div>
              </div>

              {listing.imageUrls.length > 1 && (
                <div className="p-3 bg-lowveld-950/90 flex gap-2 overflow-x-auto border-t border-lowveld-800/40">
                  {listing.imageUrls.map((url, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhoto(idx)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                        activePhoto === idx
                          ? 'border-emerald-400 scale-105'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-lowveld-800/60 space-y-4">
              <h3 className="font-display font-bold text-xl text-white">Item Overview</h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>

              {listing.imageTags && listing.imageTags.length > 0 && (
                <div className="pt-4 border-t border-lowveld-800/40">
                  <p className="text-xs text-gray-400 font-semibold mb-2 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Sector Tags</span>
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {listing.imageTags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-lowveld-950 text-xs text-emerald-300 border border-lowveld-800"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-7 rounded-3xl glass-panel border border-lowveld-800/80 shadow-2xl">
              <span className="text-xs uppercase font-bold tracking-wider text-gray-400">
                {t.offeringDetails}
              </span>
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white mt-1 mb-4 leading-snug">
                {listing.title}
              </h1>

              <div className="p-4 rounded-2xl bg-lowveld-950/80 border border-lowveld-800 mb-6">
                <span className="text-xs text-gray-400 block mb-1">{t.listedPriceTerms}</span>
                {listing.currency === 'BARTER' ? (
                  <div className="flex items-center gap-2 text-amber-400 font-black text-xl">
                    <RefreshCw className="w-6 h-6 animate-spin" />
                    <span>BARTER SWAP ONLY</span>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-display">
                      {listing.currency === 'USD' ? '$' : 'R'} {listing.price?.toLocaleString()}
                    </span>
                    <span className="text-sm font-bold text-gray-300 uppercase">
                      {listing.currency} CASH
                    </span>
                  </div>
                )}

                {listing.barterTerms && (
                  <div className="mt-3 pt-3 border-t border-lowveld-800/80 text-xs text-amber-300 flex items-start gap-2">
                    <RefreshCw className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">{t.barterTerms}</span>
                      {listing.barterTerms}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons: Cash Purchase, Barter Swap & WhatsApp */}
              <div className="space-y-3">
                {/* BUY CASH BUTTON */}
                <button
                  onClick={() => setBuyModalOpen(true)}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-lowveld-600 hover:from-emerald-400 hover:to-lowveld-500 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/60 transition-all hover:scale-[1.02]"
                >
                  <ShoppingBag className="w-5 h-5 text-white" />
                  <span>{t.buyNowCash}</span>
                </button>

                {/* WhatsApp Chat Button */}
                <a
                  href={directWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#005c4b] hover:bg-[#00735e] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-300" />
                  <span>{t.contactSeller}</span>
                </a>

                {/* Propose Barter Swap */}
                <button
                  onClick={() => setBarterModalOpen(true)}
                  className="w-full py-3.5 px-6 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 font-bold text-sm flex items-center justify-center gap-2 transition-all"
                >
                  <RefreshCw className="w-4 h-4 text-amber-400" />
                  <span>{t.proposeBarter}</span>
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-lowveld-800/60">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-lowveld-800 flex items-center justify-center text-emerald-400 font-bold text-lg border border-lowveld-700 shadow-md">
                    {listing.user.fullName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm sm:text-base">
                      {listing.user.fullName}
                    </h4>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      <span>{listing.user.locationArea}</span>
                      {listing.user.verifiedArtisan && (
                        <span className="ml-1 text-emerald-400 font-semibold flex items-center gap-0.5">
                          • <ShieldCheck className="w-3 h-3" /> Verified
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-gray-400 px-3 py-2 rounded-xl bg-lowveld-950">
                  <span>{t.completedTrades}: <b className="text-white">{listing.user.tradeCount || 12}</b></span>
                  <span>{t.rating}: <b className="text-amber-400">⭐ {listing.user.rating || '5.0'}</b></span>
                </div>
              </div>
            </div>

            {barterMatches.length > 0 && (
              <div className="p-5 sm:p-6 rounded-3xl glass-panel-amber border border-amber-500/40 space-y-3">
                <div className="flex items-center gap-2 text-amber-300">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h4 className="font-bold text-sm uppercase tracking-wider">
                    Smart Barter Cross-Matches
                  </h4>
                </div>
                <p className="text-xs text-amber-200/80">
                  Sellers in Chiredzi whose needs synergize with this listing:
                </p>

                <div className="space-y-2.5 pt-1">
                  {barterMatches.map((match, i) => (
                    <Link
                      key={i}
                      href={`/listing/${match.matchedListing.id}`}
                      className="block p-3 rounded-xl bg-lowveld-950/80 hover:bg-lowveld-900 border border-amber-500/30 transition-all group"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-bold text-xs text-white group-hover:text-amber-300 line-clamp-1">
                          {match.matchedListing.title}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          {match.matchScore}% Fit
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 line-clamp-1">
                        📍 {match.matchedListing.locationArea} • Wants: {match.matchedListing.barterTerms || 'Open trade'}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <BuyCashModal
        listing={listing}
        onClose={() => setBuyModalOpen(false)}
      />

      <BarterProposalModal
        listing={listing}
        onClose={() => setBarterModalOpen(false)}
      />

      <WhatsAppSimulatorModal
        isOpen={whatsAppOpen}
        onClose={() => setWhatsAppOpen(false)}
      />
    </main>
  );
}

export default function ListingDetailPage() {
  return (
    <LanguageProvider>
      <ListingDetailContent />
    </LanguageProvider>
  );
}
