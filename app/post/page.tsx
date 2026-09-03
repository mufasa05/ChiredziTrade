'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import WhatsAppSimulatorModal from '@/components/WhatsAppSimulatorModal';
import { SectorCategory, TradeCurrency, ConditionGrade, LowveldLocation } from '@/lib/types';
import { 
  Sparkles, 
  Camera, 
  RefreshCw, 
  ShieldCheck, 
  ArrowRight,
  Upload,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

export default function PostListingPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<SectorCategory>('livestock_agric');
  const [currency, setCurrency] = useState<TradeCurrency>('USD');
  const [price, setPrice] = useState<string>('650');
  const [barterTerms, setBarterTerms] = useState('');
  const [locationArea, setLocationArea] = useState<LowveldLocation | string>('Tshovani');
  const [conditionGrade, setConditionGrade] = useState<ConditionGrade>('New');
  const [harvestReady, setHarvestReady] = useState(false);
  const [openToBarter, setOpenToBarter] = useState(true);
  const [sellerName, setSellerName] = useState('');
  const [sellerPhone, setSellerPhone] = useState('+263');

  // Photo & Camera State
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800&auto=format&fit=crop&q=80');
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const [aiTags, setAiTags] = useState<string[]>(['cattle', 'brahman', 'lowveld', 'livestock']);
  const [aiConfidence, setAiConfidence] = useState<number | null>(0.94);
  const [uploadSource, setUploadSource] = useState<'sample' | 'custom'>('sample');

  const [submitting, setSubmitting] = useState(false);
  const [whatsAppOpen, setWhatsAppOpen] = useState(false);

  // Auto-fill from authenticated user profile
  useEffect(() => {
    if (user) {
      if (user.fullName) setSellerName(user.fullName);
      if (user.phoneNumber) setSellerPhone(user.phoneNumber);
      if (user.locationArea) setLocationArea(user.locationArea);
    }
  }, [user]);

  // Client-side image compression (optimizes for Lowveld 2G/3G mobile networks)
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            // 82% quality JPEG provides crystal-clear photos at ~150-250KB
            const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
            resolve(dataUrl);
          } else {
            resolve(img.src);
          }
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalyzingImage(true);
    try {
      const compressedDataUrl = await compressImage(file);
      setImageUrl(compressedDataUrl);
      setUploadSource('custom');

      // Send to Gemini Vision for automatic appraising & tagging
      const res = await fetch('/api/ai/vision-tag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          imagePreview: compressedDataUrl.slice(0, 100), // metadata
        }),
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        const { suggestedTitle, category: cat, tags, conditionGrade: grade, confidence } = data.analysis;
        if (!title) setTitle(suggestedTitle);
        setCategory(cat);
        setAiTags(tags);
        if (grade) setConditionGrade(grade);
        setAiConfidence(confidence);
      }
    } catch (err) {
      console.error('Error handling image upload:', err);
    } finally {
      setAnalyzingImage(false);
    }
  };

  const handleSelectSample = async (url: string, keyword: string) => {
    setImageUrl(url);
    setUploadSource('sample');
    setAnalyzingImage(true);

    try {
      const res = await fetch('/api/ai/vision-tag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: keyword }),
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        const { suggestedTitle, category: cat, tags, conditionGrade: grade, confidence } = data.analysis;
        setTitle(suggestedTitle);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      openAuthModal('Please sign in or register to publish your listing to the live marketplace.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        userId: user?.id || `user-web-${Date.now().toString().slice(-4)}`,
        user: {
          id: user?.id || `user-web-${Date.now().toString().slice(-4)}`,
          phoneNumber: sellerPhone || user?.phoneNumber || '+263770000000',
          fullName: sellerName || user?.fullName || 'Lowveld Trader',
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
      } else {
        alert(data.error || 'Failed to submit listing');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while publishing listing.');
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
          {/* STEP 1: PHOTO & CAMERA UPLOAD */}
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-lowveld-800/80 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                  <Camera className="w-5 h-5 text-emerald-400" />
                  <span>1. Photo & Computer Vision Inspection</span>
                </h3>
                <p className="text-xs text-gray-400">
                  Take a photo or upload from your device to auto-generate tags and verify quality.
                </p>
              </div>

              {aiConfidence && (
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Gemini Vision: {Math.round(aiConfidence * 100)}% Pass</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
              <div className="sm:col-span-5">
                <div className="relative h-52 sm:h-60 rounded-2xl overflow-hidden bg-lowveld-950 border-2 border-dashed border-emerald-500/40 group shadow-inner">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  {analyzingImage && (
                    <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center text-emerald-400 gap-2">
                      <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
                      <span className="text-xs font-bold font-mono">Gemini Appraising Photo...</span>
                    </div>
                  )}

                  {uploadSource === 'custom' && (
                    <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-[10px] text-emerald-300 font-bold flex items-center gap-1 shadow-md">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>Custom Photo Loaded</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="sm:col-span-7 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">
                    Upload Real Product Photo from Device:
                  </label>
                  
                  {/* Real File Input for Camera & Local Files */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                  />

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-lowveld-600 hover:from-emerald-500 hover:to-lowveld-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950 transition-all"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Take Photo / Upload</span>
                    </button>
                  </div>
                </div>

                <div className="pt-1">
                  <p className="text-[11px] text-gray-400 mb-1.5 font-medium">Or Pick a Lowveld Sample Preset:</p>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleSelectSample('https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800&auto=format&fit=crop&q=80', 'Brahman heifers cattle')}
                      className="px-2.5 py-1 rounded-lg bg-lowveld-900 hover:bg-lowveld-800 text-[11px] text-gray-300 border border-lowveld-700/60"
                    >
                      🐄 Cattle & Goats
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectSample('https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&auto=format&fit=crop&q=80', 'ladies fashion dresses boutique textiles')}
                      className="px-2.5 py-1 rounded-lg bg-lowveld-900 hover:bg-lowveld-800 text-[11px] text-pink-300 border border-pink-500/30"
                    >
                      👗 Boutique & Textiles
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectSample('https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&auto=format&fit=crop&q=80', 'wholesale groceries bulk cooking oil rice mealie meal')}
                      className="px-2.5 py-1 rounded-lg bg-lowveld-900 hover:bg-lowveld-800 text-[11px] text-amber-300 border border-amber-500/30"
                    >
                      🍞 Groceries & Wholesale
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectSample('https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80', 'building cement bricks construction materials')}
                      className="px-2.5 py-1 rounded-lg bg-lowveld-900 hover:bg-lowveld-800 text-[11px] text-orange-300 border border-orange-500/30"
                    >
                      🧱 Building & Hardware
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
                      onClick={() => handleSelectSample('https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&auto=format&fit=crop&q=80', '30t sugarcane haulage truck')}
                      className="px-2.5 py-1 rounded-lg bg-lowveld-900 hover:bg-lowveld-800 text-[11px] text-gray-300 border border-lowveld-700/60"
                    >
                      🚛 Cane Haulage
                    </button>
                  </div>
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

          {/* STEP 2: LISTING CORE DETAILS */}
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-lowveld-800/80 shadow-xl space-y-4">
            <h3 className="font-display font-bold text-lg text-white">
              2. Core Listing Details
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
                placeholder="e.g. 5 Young Brahman Heifers, 50kg Sugar & Cooking Oil Bulk, or Ladies Fashion Dresses"
                className="w-full px-3.5 py-2.5 rounded-xl bg-lowveld-950 text-white border border-lowveld-800 focus:outline-none focus:border-emerald-400 text-xs sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Economic Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as SectorCategory)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-lowveld-950 text-white border border-lowveld-800 focus:outline-none focus:border-emerald-400 text-xs sm:text-sm"
                >
                  <option value="livestock_agric">Livestock & Cattle Farming</option>
                  <option value="grocery_wholesale">Groceries, Food Wholesale & FMCG</option>
                  <option value="clothing_textiles">Clothing, Boutiques & Textiles (Vasoni veHembe)</option>
                  <option value="building_construction">Building, Hardware & Construction</option>
                  <option value="industrial_services">Industrial Trades, Welding & Engineering</option>
                  <option value="transport_logistics">Transport, Haulage & Deliveries</option>
                  <option value="general_services">General Retail, Electronics & Services</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Lowveld Location Area *
                </label>
                <select
                  value={locationArea}
                  onChange={(e) => setLocationArea(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-lowveld-950 text-white border border-lowveld-800 focus:outline-none focus:border-emerald-400 text-xs sm:text-sm"
                >
                  <option value="Tshovani">Tshovani Town</option>
                  <option value="Chiredzi Light Industry">Chiredzi Light Industry</option>
                  <option value="Hippo Valley">Hippo Valley Estate</option>
                  <option value="Triangle Estate">Triangle Sugar Estate</option>
                  <option value="Mkwasine">Mkwasine Outgrowers</option>
                  <option value="Buffalo Range">Buffalo Range</option>
                  <option value="Chipiwa Outgrowers">Chipiwa Outgrowers</option>
                  <option value="Malipati">Malipati Rural</option>
                  <option value="Mwenezi / Rutenga">Mwenezi / Rutenga</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Detailed Description *
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Specify condition, quantities, delivery terms, or harvest timelines..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-lowveld-950 text-white border border-lowveld-800 focus:outline-none focus:border-emerald-400 text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* STEP 3: PRICING & BARTER */}
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-lowveld-800/80 shadow-xl space-y-4">
            <h3 className="font-display font-bold text-lg text-white">
              3. Multi-Currency Pricing & Barter Exchange
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Currency Type *
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as TradeCurrency)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-lowveld-950 text-white border border-lowveld-800 focus:outline-none focus:border-emerald-400 text-xs sm:text-sm"
                >
                  <option value="USD">USD ($ Cash)</option>
                  <option value="ZAR">ZAR (SA Rand)</option>
                  <option value="ZWG">ZWG (Zig / Local)</option>
                  <option value="BARTER">BARTER ONLY (Swap)</option>
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

          {/* STEP 4: SELLER PROFILE & CONTACT */}
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-lowveld-800/80 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-white">
                4. Seller Contact & Verification
              </h3>
              {user && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Linked to {user.fullName}</span>
                </span>
              )}
            </div>

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
                  placeholder="e.g. Prince A. Shumba"
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

          {/* SUBMIT BUTTON */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-lowveld-600 hover:from-emerald-400 hover:to-lowveld-500 text-white font-black text-sm shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Publishing to Marketplace...</span>
                </>
              ) : (
                <>
                  <span>Publish Trade Listing</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
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
