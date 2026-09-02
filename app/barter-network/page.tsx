'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import BarterProposalModal from '@/components/BarterProposalModal';
import BuyCashModal from '@/components/BuyCashModal';
import WhatsAppSimulatorModal from '@/components/WhatsAppSimulatorModal';
import { Listing } from '@/lib/types';
import { 
  RefreshCw, 
  ArrowRight, 
  MapPin, 
  Zap,
  CheckCircle2,
  ShoppingBag
} from 'lucide-react';
import { LanguageProvider, useLanguage } from '@/context/LanguageContext';

function BarterNetworkContent() {
  const { t } = useLanguage();
  const [listings, setListings] = useState<Listing[]>([]);
  const [activeModalListing, setActiveModalListing] = useState<Listing | null>(null);
  const [activeBuyListing, setActiveBuyListing] = useState<Listing | null>(null);
  const [whatsAppOpen, setWhatsAppOpen] = useState(false);

  useEffect(() => {
    const fetchBarterListings = async () => {
      try {
        const res = await fetch('/api/listings?barterOnly=true');
        const data = await res.json();
        if (data.success) {
          setListings(data.listings);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchBarterListings();
  }, []);

  return (
    <main className="min-h-screen flex flex-col bg-[#070d09]">
      <Navbar onOpenWhatsApp={() => setWhatsAppOpen(true)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full flex-1">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold mb-3 shadow-md">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
            <span>Semantic Bilateral Vector Barter Engine</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
            Chiredzi <span className="text-amber-400">Smart Barter</span> Hub
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 mt-2.5 max-w-xl mx-auto leading-relaxed">
            Trade livestock, agricultural roughage, fabrication labor, and haulage without needing liquid cash. Connect directly on WhatsApp with matched traders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {listings.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl glass-panel-amber border border-amber-500/30 p-5 flex flex-col justify-between hover:border-amber-400 transition-all duration-300 hover:scale-[1.01] shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-lg bg-black/60 text-gray-200 text-xs font-medium border border-white/10 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span>{item.locationArea}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Open for Swap
                  </span>
                </div>

                <h3 className="font-display font-bold text-base text-white mb-2 line-clamp-2">
                  {item.title}
                </h3>

                <div className="p-3 rounded-2xl bg-lowveld-950/80 border border-lowveld-800 mb-3 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>OFFERS:</span>
                  </div>
                  <p className="text-gray-300 line-clamp-2">{item.description}</p>
                </div>

                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 mb-4 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>SEEKS IN BARTER:</span>
                  </div>
                  <p className="text-amber-200 font-semibold line-clamp-2">
                    {item.barterTerms || 'Open to fair trade or asset exchange'}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-amber-500/20 flex items-center justify-between gap-2">
                <div className="text-xs">
                  <p className="font-bold text-gray-200">{item.user.fullName}</p>
                  <p className="text-[10px] text-gray-400">⭐ {item.user.rating || '5.0'} • Verified</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveBuyListing(item)}
                    className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    <span>{t.buyNowCash}</span>
                  </button>

                  <button
                    onClick={() => setActiveModalListing(item)}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-lowveld-950 font-black text-xs flex items-center gap-1 shadow-md"
                  >
                    <span>Swap</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-8 rounded-3xl glass-panel border border-lowveld-800/80 max-w-4xl mx-auto">
          <div className="flex items-center gap-2.5 mb-4 text-emerald-400">
            <Zap className="w-5 h-5" />
            <h3 className="font-display font-bold text-lg text-white">
              How Lowveld Barter Matching Works
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm text-gray-300">
            <div className="p-4 rounded-2xl bg-lowveld-950 border border-lowveld-800">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs mb-2">1</span>
              <p className="font-bold text-white mb-1">State Offer & Needs</p>
              <p className="text-gray-400 text-xs">Post what you have (e.g. 500 bundles of cane tops) and what you need (e.g. submersible pump servicing).</p>
            </div>

            <div className="p-4 rounded-2xl bg-lowveld-950 border border-lowveld-800">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs mb-2">2</span>
              <p className="font-bold text-white mb-1">pgvector Cosine Match</p>
              <p className="text-gray-400 text-xs">Our matching algorithm cross-references what you need with what other Lowveld artisans and farmers are offering.</p>
            </div>

            <div className="p-4 rounded-2xl bg-lowveld-950 border border-lowveld-800">
              <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs mb-2">3</span>
              <p className="font-bold text-white mb-1">Direct WhatsApp Handshake</p>
              <p className="text-gray-400 text-xs">Both parties receive instant pre-formatted WhatsApp chat links to finalize delivery and asset exchange in Chiredzi.</p>
            </div>
          </div>
        </div>
      </div>

      <BuyCashModal
        listing={activeBuyListing}
        onClose={() => setActiveBuyListing(null)}
      />

      <BarterProposalModal
        listing={activeModalListing}
        onClose={() => setActiveModalListing(null)}
      />

      <WhatsAppSimulatorModal
        isOpen={whatsAppOpen}
        onClose={() => setWhatsAppOpen(false)}
      />
    </main>
  );
}

export default function BarterNetworkPage() {
  return <BarterNetworkContent />;
}
