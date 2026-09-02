'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import WhatsAppSimulatorModal from '@/components/WhatsAppSimulatorModal';
import { SectorCategory, TradeCurrency, ConditionGrade } from '@/lib/types';
import { 
  Sparkles, 
  Camera, 
  RefreshCw, 
  ShieldCheck, 
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LanguageProvider, useLanguage } from '@/context/LanguageContext';

function PostListingContent() {
  const router = useRouter();
  const { t } = useLanguage();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<SectorCategory>('livestock_agric');
  const [currency, setCurrency] = useState<TradeCurrency>('USD');
  const [price, setPrice] = useState<string>('650');
  const [barterTerms, setBarterTerms] = useState('');
  const [locationArea, setLocationArea] = useState('Tshovani');
  const [conditionGrade, setConditionGrade] = useState<ConditionGrade>('New');
  const [harvestReady, setHarvestReady] = useState(false);
  const [openToBarter, setOpenToBarter] = useState(true);
  const [sellerName, setSellerName] = useState('Tongai Machona');
  const [sellerPhone, setSellerPhone] = useState('+263773910284');

  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800&auto=format&fit=crop&q=80');
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const [aiTags, setAiTags] = useState<string[]>(['cattle', 'brahman', 'lowveld', 'livestock']);
  const [aiConfidence, setAiConfidence] = useState<number | null>(0.94);

  const [submitting, setSubmitting] = useState(false);
  const [whatsAppOpen, setWhatsAppOpen] = useState(false);

  const handleInspectPhoto = async (samplePreset?: string) => {
    setAnalyzingImage(true);

    try {
      const res = await fetch('/api/ai/vision-tag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: samplePreset ? samplePreset : title || 'livestock machinery',
        }),
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        const { suggestedTitle, category: cat, tags, conditionGrade: grade, confidence } = data.analysis;
        if (!title || samplePreset) setTitle(suggestedTitle);
        setCategory(cat);
        setAiTags(tags);
        setConditionGrade(grade);
        setAiConfidence(confidence);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzingImage(false);
    }
  };

  const handleSelectSample = (url: string, keyword: string) => {
    setImageUrl(url);
    handleInspectPhoto(keyword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        userId: `user-web-${Date.now().toString().slice(-4)}`,
        user: {
          id: `user-web-${Date.now().toString().slice(-4)}`,
          phoneNumber: sellerPhone,
          fullName: sellerName,
          locationArea,
          verifiedArtisan: true,
          rating: 5.0,
          tradeCount: 1,
        },
        title,
        description,
        category,
        currency,
        price: currency === 'BARTER' ? null : parseFloat(price) || 0,
        barterTerms: openToBarter ? barterTerms : null,
        locationArea,
        imageUrls: [imageUrl],
        imageTags: aiTags,
        conditionGrade,
        status: 'active',
        urgent: false,
        harvestReady,
        openToBarter,
      };

      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.listing) {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
        });
        router.push(`/listing/${data.listing.id}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#070d09]">
      <Navbar onOpenWhatsApp={() => setWhatsAppOpen(true)} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full flex-1">
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI-Assisted Listing & Multi-Currency Engine</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-white">
            {t.postListing} on <span className="text-emerald-400">ChiredziTrade</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-2">
            Reach commercial outgrowers, livestock ranchers, and town traders across the Lowveld.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-lowveld-800/80 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                  <Camera className="w-5 h-5 text-emerald-400" />
                  <span>1. Photo & Computer Vision Inspection</span>
                </h3>
                <p className="text-xs text-gray-400">
                  Upload a photo of your goods or artisan service to auto-generate tags and verify quality.
                </p>
              </div>

              {aiConfidence && (
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Gemini Vision 2.5: {Math.round(aiConfidence * 100)}% Pass</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
              <div className="sm:col-span-5">
                <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden bg-lowveld-950 border-2 border-dashed border-emerald-500/40 group">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  {analyzingImage && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-emerald-400 gap-2">
                      <RefreshCw className="w-6 h-6 animate-spin" />
                      <span className="text-xs font-bold font-mono">Appraising Photo...</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="sm:col-span-7 space-y-3">
                <label className="block text-xs font-semibold text-gray-300">
                  Image URL or Choose a Lowveld Test Scenario:
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-lowveld-950 text-xs text-white border border-lowveld-800 focus:outline-none focus:border-emerald-400"
                />

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => handleSelectSample('https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800&auto=format&fit=crop&q=80', 'Brahman heifers cattle')}
                    className="px-2.5 py-1 rounded-lg bg-lowveld-900 hover:bg-lowveld-800 text-[11px] text-gray-300 border border-lowveld-700/60"
                  >
                    🐄 Brahman Cattle
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectSample('https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=80', 'welding cane trailer chassis')}
                    className="px-2.5 py-1 rounded-lg bg-lowveld-900 hover:bg-lowveld-800 text-[11px] text-gray-300 border border-lowveld-700/60"
                  >
                    ⚙️ Trailer Welding
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectSample('https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80', 'borehole solar pump repair')}
                    className="px-2.5 py-1 rounded-lg bg-lowveld-900 hover:bg-lowveld-800 text-[11px] text-gray-300 border border-lowveld-700/60"
                  >
                    💧 Solar Borehole
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectSample('https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&auto=format&fit=crop&q=80', '30t sugarcane haulage truck')}
                    className="px-2.5 py-1 rounded-lg bg-lowveld-900 hover:bg-lowveld-800 text-[11px] text-gray-300 border border-lowveld-700/60"
                  >
                    🚛 Cane Haulage
                  </button>
                </div>

                {aiTags.length > 0 && (
                  <div className="pt-2">
                    <p className="text-[11px] text-gray-400 mb-1">AI Detected Tags:</p>
                    <div className="flex flex-wrap gap-1">
                      {aiTags.map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-[11px] border border-emerald-500/20">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-lowveld-800/80 shadow-xl space-y-4">
            <h3 className="font-display font-bold text-lg text-white">
              2. Listing Details & Category
            </h3>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Listing Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 4 Brahman Breeding Heifers or Cane Trailer Chassis Fabrication"
                className="w-full px-4 py-3 rounded-xl bg-lowveld-950 text-white border border-lowveld-800 focus:outline-none focus:border-emerald-400 text-sm sm:text-base font-semibold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Economic Sector Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as SectorCategory)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-lowveld-950 text-white border border-lowveld-800 focus:outline-none focus:border-emerald-400 text-xs sm:text-sm"
                >
                  <option value="livestock_agric">🌾 Livestock & Agriculture</option>
                  <option value="industrial_services">⚙️ Industrial & Trades</option>
                  <option value="transport_logistics">🚛 Transport & Haulage</option>
                  <option value="woodwork_construction">🪵 Woodwork & Construction</option>
                  <option value="retail_hardware">🛒 Solar, Hardware & Spares</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Lowveld Location Hub *
                </label>
                <select
                  value={locationArea}
                  onChange={(e) => setLocationArea(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-lowveld-950 text-white border border-lowveld-800 focus:outline-none focus:border-emerald-400 text-xs sm:text-sm"
                >
                  <option value="Tshovani">Tshovani</option>
                  <option value="Chiredzi Light Industry">Chiredzi Light Industry</option>
                  <option value="Triangle Estate">Triangle Estate</option>
                  <option value="Hippo Valley">Hippo Valley</option>
                  <option value="Mkwasine">Mkwasine</option>
                  <option value="Buffalo Range">Buffalo Range</option>
                  <option value="Chipiwa Outgrowers">Chipiwa Outgrowers</option>
                  <option value="Malipati">Malipati</option>
                  <option value="Mwenezi / Rutenga">Mwenezi / Rutenga</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Description & Terms
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe specifications, quantities, condition, availability, or delivery options..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-lowveld-950 text-white border border-lowveld-800 focus:outline-none focus:border-emerald-400 text-xs sm:text-sm"
              />
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl glass-panel-amber border border-amber-500/40 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-amber-400" />
                <span>3. Multi-Currency Pricing & Barter Exchange</span>
              </h3>
              <span className="text-xs text-amber-300 font-semibold">USD • ZAR • Barter</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Pricing Currency *
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as TradeCurrency)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-lowveld-950 text-white border border-amber-500/40 focus:outline-none focus:border-amber-400 text-xs sm:text-sm"
                >
                  <option value="USD">USD ($ Cash)</option>
                  <option value="ZAR">ZAR (SA Rand R)</option>
                  <option value="BARTER">BARTER ONLY (Pure Trade)</option>
                </select>
              </div>

              {currency !== 'BARTER' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Price Amount ({currency}) *
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-lowveld-950 text-white border border-amber-500/40 focus:outline-none focus:border-amber-400 text-xs sm:text-sm font-mono font-bold"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Open to Barter Trade?
                </label>
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="barterToggle"
                    checked={openToBarter || currency === 'BARTER'}
                    onChange={(e) => setOpenToBarter(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-lowveld-950"
                  />
                  <label htmlFor="barterToggle" className="text-xs text-amber-200 cursor-pointer font-medium">
                    Accept items / cattle in swap
                  </label>
                </div>
              </div>
            </div>

            {(openToBarter || currency === 'BARTER') && (
              <div className="pt-2">
                <label className="block text-xs font-semibold text-amber-300 mb-1">
                  What goods / services will you accept in barter? *
                </label>
                <input
                  type="text"
                  value={barterTerms}
                  onChange={(e) => setBarterTerms(e.target.value)}
                  placeholder="e.g. Will swap for 2 Brahman heifers, 20 bags maize, or borehole repair service"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-lowveld-950 text-white border border-amber-500/60 focus:outline-none focus:border-amber-300 text-xs sm:text-sm"
                />
              </div>
            )}
          </div>

          <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-lowveld-800/80 shadow-xl space-y-4">
            <h3 className="font-display font-bold text-lg text-white">
              4. Seller WhatsApp Contact
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Your Full / Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-lowveld-950 text-white border border-lowveld-800 focus:outline-none focus:border-emerald-400 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  WhatsApp Phone Number (E.164) *
                </label>
                <input
                  type="text"
                  required
                  value={sellerPhone}
                  onChange={(e) => setSellerPhone(e.target.value)}
                  placeholder="+26377..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-lowveld-950 text-white border border-lowveld-800 focus:outline-none focus:border-emerald-400 text-xs sm:text-sm"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto flex-1 py-4 px-8 rounded-2xl bg-gradient-to-r from-emerald-500 to-lowveld-600 hover:from-emerald-400 hover:to-lowveld-500 text-white font-extrabold text-base shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-50"
            >
              <span>{submitting ? 'Publishing to ChiredziTrade...' : 'Publish Listing Live'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      <WhatsAppSimulatorModal
        isOpen={whatsAppOpen}
        onClose={() => setWhatsAppOpen(false)}
      />
    </main>
  );
}

export default function PostListingPage() {
  return (
    <LanguageProvider>
      <PostListingContent />
    </LanguageProvider>
  );
}
