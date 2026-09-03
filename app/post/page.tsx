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
  Image as ImageIcon,
  X,
  Plus,
  Trash2
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
  const [price, setPrice] = useState<string>('');
  const [barterTerms, setBarterTerms] = useState('');
  const [locationArea, setLocationArea] = useState<LowveldLocation | string>('Tshovani');
  const [conditionGrade, setConditionGrade] = useState<ConditionGrade>('New');
  const [harvestReady, setHarvestReady] = useState(false);
  const [openToBarter, setOpenToBarter] = useState(true);
  const [sellerName, setSellerName] = useState('');
  const [sellerPhone, setSellerPhone] = useState('+263');

  // Photo & Camera State - Clean empty initial state (no preloaded image)
  const [imageUrl, setImageUrl] = useState('');
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const [aiTags, setAiTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [aiConfidence, setAiConfidence] = useState<number | null>(null);

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
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
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
            // 70% quality JPEG provides lightweight, fast photos at ~40-80KB
            const dataUrl = canvas.toDataURL('image/jpeg', 0.70);
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

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalyzingImage(true);
    try {
      const compressedBase64 = await compressImage(file);
      setImageUrl(compressedBase64);

      // Intelligent AI Vision Appraisal
      const res = await fetch('/api/ai/vision-tag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: compressedBase64,
          fileName: file.name,
        }),
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        const { suggestedTitle, category: cat, tags, conditionGrade: grade, confidence } = data.analysis;
        if (suggestedTitle && !title) setTitle(suggestedTitle);
        if (cat) setCategory(cat);
        if (Array.isArray(tags) && tags.length > 0) {
          setAiTags(tags);
        }
        if (grade) setConditionGrade(grade);
        setAiConfidence(confidence);
      }
    } catch (err) {
      console.error('Error handling image upload:', err);
    } finally {
      setAnalyzingImage(false);
    }
  };

  const handleAddTag = (e?: React.FormEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    const clean = tagInput.trim().toLowerCase().replace(/^#/, '');
    if (clean && !aiTags.includes(clean)) {
      setAiTags([...aiTags, clean]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setAiTags(aiTags.filter(t => t !== tagToRemove));
  };

  const handleRemovePhoto = () => {
    setImageUrl('');
    setAiConfidence(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const defaultCategoryImages: Record<string, string> = {
    livestock_agric: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&auto=format&fit=crop&q=80',
    grocery_wholesale: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&auto=format&fit=crop&q=80',
    clothing_textiles: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&auto=format&fit=crop&q=80',
    building_construction: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80',
    industrial_services: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=80',
    transport_logistics: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&auto=format&fit=crop&q=80',
    general_services: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&auto=format&fit=crop&q=80',
    woodwork_construction: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&auto=format&fit=crop&q=80',
    retail_hardware: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=800&auto=format&fit=crop&q=80',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalSellerName = sellerName.trim() || user?.fullName || 'Prince A. Shumba';
    const finalSellerPhone = sellerPhone.trim() || user?.phoneNumber || '+263 783237918';
    const finalImageUrl = imageUrl || defaultCategoryImages[category] || 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800';
    const finalDescription = description.trim() || 'Available for cash purchase or barter exchange in Chiredzi.';

    if (title.trim().length < 2) {
      alert('Please enter a descriptive listing title.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        userId: user?.id || `user-web-${Date.now().toString().slice(-4)}`,
        user: {
          id: user?.id || `user-web-${Date.now().toString().slice(-4)}`,
          phoneNumber: finalSellerPhone,
          fullName: finalSellerName,
          locationArea,
          verifiedArtisan: true,
          rating: 5.0,
          tradeCount: 1,
        },
        title: title.trim(),
        description: finalDescription,
        category,
        currency,
        price: currency === 'BARTER' ? null : (parseFloat(price) || 0),
        barterTerms: (openToBarter || currency === 'BARTER') ? barterTerms.trim() : null,
        locationArea,
        imageUrls: [finalImageUrl],
        imageTags: aiTags.length > 0 ? aiTags : [category.replace('_', ' ')],
        conditionGrade,
        status: 'active',
        urgent: false,
        harvestReady,
        openToBarter: openToBarter || currency === 'BARTER',
      };

      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success && data.listing) {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
        });
        router.push(`/listing/${data.listing.id}`);
      } else {
        const errorMsg = data.details 
          ? data.details.map((d: any) => `${d.path?.join('.')}: ${d.message}`).join(', ')
          : (data.error || 'Failed to submit listing');
        alert(`Could not post listing: ${errorMsg}`);
      }
    } catch (err) {
      console.error(err);
      alert('Network error while publishing listing.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070d09] text-gray-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      <Navbar onOpenWhatsApp={() => setWhatsAppOpen(true)} />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 w-full">
        <div className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Lowveld Multi-Currency & Barter Marketplace</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-white">
            {t.postListing} on <span className="text-emerald-400">ChiredziTrade</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-2">
            Connect directly with outgrowers, ranchers, artisans, wholesalers, and traders across the Lowveld.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* STEP 1: PHOTO & CAMERA UPLOAD */}
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-lowveld-800/80 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                  <Camera className="w-5 h-5 text-emerald-400" />
                  <span>1. Real Product Photo</span>
                </h3>
                <p className="text-xs text-gray-400">
                  Take a photo or upload from your device. Real photos increase buyer trust.
                </p>
              </div>

              {aiConfidence && (
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Quality Verified</span>
                </span>
              )}
            </div>

            {/* Hidden native camera/file input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              capture="environment"
              onChange={handleImageFileChange}
              className="hidden"
            />

            {/* Photo Upload / Preview Zone */}
            {!imageUrl ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-emerald-500/40 hover:border-emerald-400 bg-lowveld-950/60 hover:bg-lowveld-950/90 rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all group"
              >
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 group-hover:bg-emerald-500/25 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30 transition-transform group-hover:scale-105">
                  <Camera className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-white text-base sm:text-lg mb-1">
                  Tap to Take Photo with Camera or Upload
                </h4>
                <p className="text-xs text-gray-400 max-w-sm mx-auto mb-4">
                  Select a clear photo from your phone or computer. Images are auto-compressed for Lowveld mobile networks.
                </p>
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950 transition-all">
                  <Upload className="w-4 h-4" />
                  <span>Choose Photo / Open Camera</span>
                </span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden bg-lowveld-950 border border-lowveld-800 group shadow-xl">
                  <img
                    src={imageUrl}
                    alt="Product Preview"
                    className="w-full h-full object-cover"
                  />
                  {analyzingImage && (
                    <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center text-emerald-400 gap-2">
                      <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
                      <span className="text-xs font-bold font-mono">Analyzing Photo...</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-xl bg-black/70 hover:bg-black text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition-all"
                    >
                      Change Photo
                    </button>
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="p-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-300 backdrop-blur-md border border-red-500/40 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 text-xs font-bold border border-emerald-500/40 backdrop-blur-md">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Custom Photo Ready</span>
                    </span>
                  </div>
                </div>

                {/* Editable Tags */}
                <div className="p-4 rounded-2xl bg-lowveld-950/60 border border-lowveld-800/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-300">Listing Tags (for search & matching):</span>
                    <span className="text-[11px] text-gray-500">Tap tag to remove</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5 items-center">
                    {aiTags.map((tag) => (
                      <span 
                        key={tag} 
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 text-xs border border-emerald-500/30"
                      >
                        <span>#{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-red-400 transition-colors ml-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}

                    {/* Inline Add Tag Input */}
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                        placeholder="Add tag..."
                        className="px-2.5 py-1 rounded-lg bg-lowveld-900 text-white placeholder-gray-500 text-xs border border-lowveld-700 focus:outline-none focus:border-emerald-400 w-24 sm:w-32"
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="p-1 rounded-lg bg-lowveld-800 hover:bg-lowveld-700 text-gray-300 hover:text-white transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
                placeholder="e.g. 5 Young Brahman Heifers, 50kg Sugar Wholesale, or Custom Tailored Dresses"
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
                  <option value="livestock_agric">Livestock & Agric Produce</option>
                  <option value="grocery_wholesale">Groceries & Food Wholesale (Tuckshops)</option>
                  <option value="clothing_textiles">Clothing, Boutiques & Textiles (Vasoni veHembe)</option>
                  <option value="building_construction">Building, Hardware & Construction</option>
                  <option value="industrial_services">Industrial Trades, Welding & Mechanics</option>
                  <option value="transport_logistics">Haulage, Trucks & Bakkie Hire</option>
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
                    placeholder="e.g. 50"
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
                  WhatsApp Phone Number *
                </label>
                <input
                  type="text"
                  required
                  value={sellerPhone}
                  onChange={(e) => setSellerPhone(e.target.value)}
                  placeholder="+263 77..."
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
      </main>

      {/* WhatsApp Bot Modal */}
      <WhatsAppSimulatorModal
        isOpen={whatsAppOpen}
        onClose={() => setWhatsAppOpen(false)}
        onListingCreated={() => router.push('/')}
      />
    </div>
  );
}
