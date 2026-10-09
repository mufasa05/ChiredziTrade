'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import WhatsAppSimulatorModal from '@/components/WhatsAppSimulatorModal';
import { SectorCategory, TradeCurrency, ConditionGrade, LowveldLocation } from '@/lib/types';
import { ZIMBABWE_TRADE_HUBS } from '@/lib/constants';
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
  Trash2,
  MapPin,
  Star
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

export default function PostListingPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { user, isAuthenticated, authLoading, needsProfile, openAuthModal } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<SectorCategory>('livestock_agric');
  const [currency, setCurrency] = useState<TradeCurrency>('USD');
  const [price, setPrice] = useState<string>('');
  const [barterTerms, setBarterTerms] = useState('');
  const [locationArea, setLocationArea] = useState<string>('Chiredzi Town');
  const [isCustomLocation, setIsCustomLocation] = useState(false);
  const [customLocation, setCustomLocation] = useState('');
  const [conditionGrade, setConditionGrade] = useState<ConditionGrade>('New');
  const [harvestReady, setHarvestReady] = useState(false);
  const [openToBarter, setOpenToBarter] = useState(true);
  const [sellerName, setSellerName] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');

  // Multi-Photo State: support at least 5 photos (up to 8)
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
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
      if (user.locationArea) {
        if (ZIMBABWE_TRADE_HUBS.includes(user.locationArea as any)) {
          setLocationArea(user.locationArea);
          setIsCustomLocation(false);
        } else {
          setIsCustomLocation(true);
          setCustomLocation(user.locationArea);
        }
      }
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

  const handleImageFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setAnalyzingImage(true);
    try {
      const compressedList = await Promise.all(files.map((file) => compressImage(file)));
      setImageUrls((prev) => {
        const combined = [...prev, ...compressedList].slice(0, 8);
        return combined;
      });

      // Intelligent AI Vision Appraisal on first photo if title is empty
      if (files[0] && !title) {
        try {
          const res = await fetch('/api/ai/vision-tag', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              imageBase64: compressedList[0],
              fileName: files[0].name,
            }),
          });

          const data = await res.json();
          if (data.success && data.analysis) {
            const { suggestedTitle, category: cat, tags, conditionGrade: grade, confidence } = data.analysis;
            if (suggestedTitle && !title) setTitle(suggestedTitle);
            if (cat) setCategory(cat);
            if (Array.isArray(tags) && tags.length > 0) setAiTags(tags);
            if (grade) setConditionGrade(grade);
            setAiConfidence(confidence);
          }
        } catch (aiErr) {
          console.warn('AI Vision tagging non-fatal:', aiErr);
        }
      }
    } catch (err) {
      console.error('Error handling image upload:', err);
    } finally {
      setAnalyzingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (cameraInputRef.current) cameraInputRef.current.value = '';
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
    setAiTags(aiTags.filter((t) => t !== tagToRemove));
  };

  const handleRemovePhoto = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
    if (activeImageIdx >= index && activeImageIdx > 0) {
      setActiveImageIdx((prev) => prev - 1);
    }
  };

  const handleSetCoverPhoto = (index: number) => {
    if (index === 0) return;
    setImageUrls((prev) => {
      const target = prev[index];
      const rest = prev.filter((_, i) => i !== index);
      return [target, ...rest];
    });
    setActiveImageIdx(0);
  };

  const sampleGalleryPhotos = [
    { title: 'Boer Goats', url: 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?w=800&auto=format&fit=crop&q=80' },
    { title: 'Maize Sacks', url: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&auto=format&fit=crop&q=80' },
    { title: 'Solar Pump', url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80' },
    { title: 'Welding Machine', url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=80' },
    { title: 'Cane Truck', url: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&auto=format&fit=crop&q=80' },
  ];

  const handleSelectSamplePhoto = async (sampleUrl: string) => {
    setImageUrls((prev) => [...prev, sampleUrl].slice(0, 8));
    setAnalyzingImage(true);
    try {
      const res = await fetch('/api/ai/vision-tag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: sampleUrl,
          fileName: 'sample.jpg',
        }),
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        const { suggestedTitle, category: cat, tags, conditionGrade: grade, confidence } = data.analysis;
        if (suggestedTitle && !title) setTitle(suggestedTitle);
        if (cat) setCategory(cat);
        if (Array.isArray(tags) && tags.length > 0) setAiTags(tags);
        if (grade) setConditionGrade(grade);
        setAiConfidence(confidence);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzingImage(false);
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

    const finalSellerName = sellerName.trim() || user?.fullName || '';
    const finalSellerPhone = sellerPhone.trim() || user?.phoneNumber || '';
    const effectiveLocation = isCustomLocation ? (customLocation.trim() || 'Chiredzi Town') : locationArea;
    const finalImages = imageUrls.length > 0 ? imageUrls : [defaultCategoryImages[category] || 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800'];
    const finalDescription = description.trim();

    if (!user) {
      openAuthModal('Please sign in to post a listing.');
      return;
    }

    if (title.trim().length < 2) {
      alert('Please enter a descriptive listing title.');
      return;
    }

    if (finalDescription.length < 10) {
      alert('Please add a short description (at least 10 characters).');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        userId: user.id,
        user: {
          id: user.id,
          phoneNumber: finalSellerPhone,
          fullName: finalSellerName,
          locationArea: effectiveLocation,
          verifiedArtisan: false,
          rating: 0,
          tradeCount: 0,
        },
        title: title.trim(),
        description: finalDescription,
        category,
        currency,
        price: currency === 'BARTER' ? null : (parseFloat(price) || 0),
        barterTerms: (openToBarter || currency === 'BARTER') ? barterTerms.trim() : null,
        locationArea: effectiveLocation,
        imageUrls: finalImages,
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
        try {
          const stored = localStorage.getItem('zimbarter_live_listings');
          const currentListings = stored ? JSON.parse(stored) : [];
          localStorage.setItem('zimbarter_live_listings', JSON.stringify([data.listing, ...currentListings]));
        } catch (e) {
          console.warn('Local listing cache write failed:', e);
        }

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

  // Page-level gate: visitors can browse freely, but only signed-in traders with a
  // completed profile can open the listing form.
  if (authLoading) {
    return (
      <main className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070d09]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <RefreshCw className="w-6 h-6 animate-spin text-emerald-500" />
        </div>
      </main>
    );
  }

  if (!isAuthenticated || needsProfile) {
    return (
      <main className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070d09] text-slate-900 dark:text-gray-100">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="max-w-md w-full text-center glass-panel rounded-3xl p-8 border border-slate-200 dark:border-lowveld-800 shadow-xl">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="font-display font-black text-2xl text-slate-900 dark:text-white mb-2">
              {needsProfile ? 'Complete Your Trader Profile' : 'Sign In to Post a Listing'}
            </h1>
            <p className="text-sm text-slate-600 dark:text-gray-400 mb-6 leading-relaxed">
              {needsProfile
                ? 'Add your WhatsApp number and location so buyers can reach you.'
                : 'Browsing is free for everyone. To protect buyers, only verified traders can post listings, place orders, or propose swaps.'}
            </p>
            <button
              onClick={() => openAuthModal(needsProfile ? '' : 'Please sign in to post a listing.')}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-lowveld-600 hover:from-emerald-400 hover:to-lowveld-500 text-white font-black text-sm shadow-md transition-all inline-flex items-center justify-center gap-2"
            >
              <span>{needsProfile ? 'Complete Profile' : 'Sign In / Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => router.push('/')}
              className="mt-3 text-xs font-semibold text-slate-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400"
            >
              Continue browsing the marketplace
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070d09] text-slate-900 dark:text-gray-100 flex flex-col selection:bg-emerald-500 selection:text-white transition-colors duration-300">
      <Navbar onOpenWhatsApp={() => setWhatsAppOpen(true)} />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 w-full">
        <div className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span>Lowveld Multi-Currency & Barter Marketplace</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-slate-900 dark:text-white">
            {t.postListing} on <span className="text-emerald-600 dark:text-emerald-400">ChiredziTrade</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400 mt-2">
            Connect directly with outgrowers, ranchers, artisans, wholesalers, and traders across the Lowveld.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* STEP 1: PHOTO & CAMERA UPLOAD (AT LEAST 5 PHOTOS) */}
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-200 dark:border-lowveld-800/80 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <Camera className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>1. Product Photos & Media</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                    At least 5 recommended
                  </span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-gray-400 mt-1">
                  Upload 5 or more photos showing multiple angles, details, tags, and condition to build buyer trust.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                  imageUrls.length >= 5 
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/40' 
                    : imageUrls.length > 0 
                    ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/40' 
                    : 'bg-slate-200 dark:bg-lowveld-900 text-slate-700 dark:text-gray-400 border-slate-300 dark:border-lowveld-800'
                }`}>
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>{imageUrls.length} / 8 photos</span>
                  {imageUrls.length >= 5 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                </span>

                {aiConfidence && (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Quality Verified</span>
                  </span>
                )}
              </div>
            </div>

            {/* Native file input for gallery / device file picker (supports multiple selection) */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              multiple
              onChange={handleImageFilesChange}
              className="hidden"
            />

            {/* Native file input for live camera capture */}
            <input
              type="file"
              ref={cameraInputRef}
              accept="image/*"
              capture="environment"
              onChange={handleImageFilesChange}
              className="hidden"
            />

            {/* Photo Upload / Preview Zone */}
            {imageUrls.length === 0 ? (
              <div className="border-2 border-dashed border-emerald-500/40 hover:border-emerald-500 bg-slate-100/70 dark:bg-lowveld-950/60 rounded-3xl p-6 sm:p-10 text-center transition-all">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                  <ImageIcon className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg mb-1">
                  Upload Product Photos (At least 5 recommended)
                </h4>
                <p className="text-xs text-slate-600 dark:text-gray-400 max-w-sm mx-auto mb-6">
                  Select multiple photos from your device gallery, camera roll, files, or snap live camera shots.
                </p>

                {/* Primary Upload Actions */}
                <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-white" />
                    <span>Choose Photos (Select Multiple)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-200 dark:bg-lowveld-900 hover:bg-slate-300 dark:hover:bg-lowveld-800 text-slate-800 dark:text-gray-200 font-bold text-xs border border-slate-300 dark:border-lowveld-700 shadow-md transition-all cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Take Live Camera Photo</span>
                  </button>
                </div>

                {/* Quick Select Sample Gallery Photos */}
                <div className="pt-4 border-t border-slate-200 dark:border-lowveld-800/80">
                  <p className="text-[11px] font-semibold text-slate-500 dark:text-gray-400 mb-3">
                    Or select sample item photos to test:
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {sampleGalleryPhotos.map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectSamplePhoto(sample.url)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-lowveld-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 border border-slate-200 dark:border-lowveld-800 text-slate-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-300 text-xs transition-all shadow-sm"
                      >
                        <img src={sample.url} alt={sample.title} className="w-4 h-4 rounded-full object-cover" />
                        <span>{sample.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Main Active Photo View */}
                <div className="relative h-64 sm:h-96 rounded-2xl overflow-hidden bg-slate-100 dark:bg-lowveld-950 border border-slate-200 dark:border-lowveld-800 group shadow-xl">
                  <img
                    src={imageUrls[activeImageIdx] || imageUrls[0]}
                    alt={`Product Preview ${activeImageIdx + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {analyzingImage && (
                    <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center text-emerald-400 gap-2">
                      <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
                      <span className="text-xs font-bold font-mono">Analyzing Photo with AI Vision...</span>
                    </div>
                  )}

                  {/* Badges on main image */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    {activeImageIdx === 0 ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600/90 text-white text-xs font-bold shadow-md backdrop-blur-md">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>Cover Photo (Listing Thumbnail)</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSetCoverPhoto(activeImageIdx)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 hover:bg-emerald-600 text-white text-xs font-semibold shadow-md backdrop-blur-md transition-colors"
                      >
                        <Star className="w-3.5 h-3.5" />
                        <span>Set as Cover Photo</span>
                      </button>
                    )}
                  </div>

                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(activeImageIdx)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-300 backdrop-blur-md border border-red-500/40 text-xs font-semibold transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>

                  <div className="absolute bottom-3 left-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 text-gray-200 text-xs font-mono backdrop-blur-md">
                      Photo {activeImageIdx + 1} of {imageUrls.length}
                    </span>
                  </div>
                </div>

                {/* Thumbnails Gallery Grid / Strip */}
                <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-lowveld-950/60 border border-slate-200 dark:border-lowveld-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-gray-200 flex items-center gap-1.5">
                      <span>Listing Gallery ({imageUrls.length}/8)</span>
                      {imageUrls.length < 5 && (
                        <span className="text-[11px] text-amber-600 dark:text-amber-400 font-normal">
                          (Add {5 - imageUrls.length} more to reach 5 photos)
                        </span>
                      )}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-gray-400">
                      Tap photo to view or set as cover
                    </span>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {imageUrls.map((url, idx) => (
                      <div
                        key={idx}
                        onClick={() => setActiveImageIdx(idx)}
                        className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all group ${
                          activeImageIdx === idx 
                            ? 'border-emerald-500 ring-2 ring-emerald-500/30 scale-105 shadow-md' 
                            : 'border-slate-300 dark:border-lowveld-800 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <img src={url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                        {idx === 0 && (
                          <div className="absolute top-1 left-1 bg-emerald-600 text-white rounded p-0.5 shadow">
                            <Star className="w-2.5 h-2.5 fill-current" />
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemovePhoto(idx);
                          }}
                          className="absolute top-1 right-1 p-0.5 rounded-full bg-black/70 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <span className="absolute bottom-1 right-1 px-1 rounded bg-black/60 text-[9px] font-mono text-white">
                          #{idx + 1}
                        </span>
                      </div>
                    ))}

                    {/* Add More Photos Slot */}
                    {imageUrls.length < 8 && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square rounded-xl border-2 border-dashed border-emerald-500/50 hover:border-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10 flex flex-col items-center justify-center text-emerald-600 dark:text-emerald-400 transition-all gap-1 cursor-pointer"
                      >
                        <Plus className="w-5 h-5" />
                        <span className="text-[10px] font-bold">Add</span>
                      </button>
                    )}
                  </div>

                  {/* Actions Bar for Photo Management */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-lowveld-800/80">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={imageUrls.length >= 8}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Photos ({imageUrls.length}/8)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        disabled={imageUrls.length >= 8}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-lowveld-900 hover:bg-slate-300 dark:hover:bg-lowveld-800 disabled:opacity-50 text-slate-800 dark:text-gray-200 text-xs font-semibold transition-all border border-slate-300 dark:border-lowveld-700"
                      >
                        <Camera className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Camera</span>
                      </button>
                    </div>

                    {imageUrls.length < 8 && (
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-gray-400">
                        <span>Quick add:</span>
                        {sampleGalleryPhotos.slice(0, 3).map((sample, sIdx) => (
                          <button
                            key={sIdx}
                            type="button"
                            onClick={() => handleSelectSamplePhoto(sample.url)}
                            className="px-2 py-0.5 rounded-lg bg-white dark:bg-lowveld-900 border border-slate-200 dark:border-lowveld-800 text-[10px] hover:text-emerald-500 transition-colors"
                          >
                            +{sample.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Editable Tags */}
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-lowveld-950/60 border border-slate-200 dark:border-lowveld-800/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700 dark:text-gray-300">Listing Tags (for search & matching):</span>
                    <span className="text-[11px] text-slate-500 dark:text-gray-500">Tap tag to remove</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5 items-center">
                    {aiTags.map((tag) => (
                      <span 
                        key={tag} 
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-xs border border-emerald-500/30"
                      >
                        <span>#{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-red-600 dark:hover:text-red-400 transition-colors ml-0.5"
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
                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-lowveld-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 text-xs border border-slate-300 dark:border-lowveld-700 focus:outline-none focus:border-emerald-400 w-24 sm:w-32"
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="p-1 rounded-lg bg-slate-200 dark:bg-lowveld-800 hover:bg-slate-300 dark:hover:bg-lowveld-700 text-slate-700 dark:text-gray-300 transition-colors"
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
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-200 dark:border-lowveld-800/80 shadow-xl space-y-4">
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              2. Core Listing Details
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">
                Listing Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 5 Young Brahman Heifers, 50kg Sugar Wholesale, or Custom Tailored Dresses"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-lowveld-950 text-slate-900 dark:text-white border border-slate-300 dark:border-lowveld-800 focus:outline-none focus:border-emerald-500 text-xs sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">
                  Economic Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as SectorCategory)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-lowveld-950 text-slate-900 dark:text-white border border-slate-300 dark:border-lowveld-800 focus:outline-none focus:border-emerald-500 text-xs sm:text-sm"
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
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-gray-300 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Trading Location Hub *</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCustomLocation(!isCustomLocation)}
                    className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
                  >
                    {isCustomLocation ? 'Choose from suggested hubs' : '+ Enter custom town / location'}
                  </button>
                </div>

                {isCustomLocation ? (
                  <input
                    type="text"
                    required
                    placeholder="Type town, growth point or street (e.g. Checheche Growth Point, Jerera, Stand 14 Hippo Valley)..."
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-lowveld-950 text-slate-900 dark:text-white border border-emerald-500 dark:border-emerald-400 focus:outline-none text-xs sm:text-sm"
                    autoFocus
                  />
                ) : (
                  <select
                    value={locationArea}
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        setIsCustomLocation(true);
                      } else {
                        setLocationArea(e.target.value);
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-lowveld-950 text-slate-900 dark:text-white border border-slate-300 dark:border-lowveld-800 focus:outline-none focus:border-emerald-500 text-xs sm:text-sm"
                  >
                    {ZIMBABWE_TRADE_HUBS.map((hub) => (
                      <option key={hub} value={hub}>
                        {hub}
                      </option>
                    ))}
                    <option value="__custom__" className="text-emerald-600 font-bold">
                      + Enter Custom Location / Growth Point...
                    </option>
                  </select>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">
                Detailed Description *
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Specify condition, quantities, delivery terms, or harvest timelines..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-lowveld-950 text-slate-900 dark:text-white border border-slate-300 dark:border-lowveld-800 focus:outline-none focus:border-emerald-500 text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* STEP 3: PRICING & BARTER */}
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-200 dark:border-lowveld-800/80 shadow-xl space-y-4">
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              3. Multi-Currency Pricing & Barter Exchange
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">
                  Currency Type *
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as TradeCurrency)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-lowveld-950 text-slate-900 dark:text-white border border-slate-300 dark:border-lowveld-800 focus:outline-none focus:border-emerald-500 text-xs sm:text-sm"
                >
                  <option value="USD">USD ($ Cash)</option>
                  <option value="ZAR">ZAR (SA Rand)</option>
                  <option value="ZWG">ZWG (Zig / Local)</option>
                  <option value="BARTER">BARTER ONLY (Swap)</option>
                </select>
              </div>

              {currency !== 'BARTER' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">
                    Price Amount ({currency}) *
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 50"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-lowveld-950 text-slate-900 dark:text-white border border-amber-500/40 focus:outline-none focus:border-amber-500 text-xs sm:text-sm font-mono font-bold"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">
                  Open to Barter Trade?
                </label>
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="barterToggle"
                    checked={openToBarter || currency === 'BARTER'}
                    onChange={(e) => setOpenToBarter(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-white dark:bg-lowveld-950"
                  />
                  <label htmlFor="barterToggle" className="text-xs text-amber-800 dark:text-amber-200 cursor-pointer font-medium">
                    Accept items / cattle in swap
                  </label>
                </div>
              </div>
            </div>

            {(openToBarter || currency === 'BARTER') && (
              <div className="pt-2">
                <label className="block text-xs font-semibold text-amber-700 dark:text-amber-300 mb-1">
                  What goods / services will you accept in barter? *
                </label>
                <input
                  type="text"
                  value={barterTerms}
                  onChange={(e) => setBarterTerms(e.target.value)}
                  placeholder="e.g. Will swap for 2 Brahman heifers, 20 bags maize, or borehole repair service"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-lowveld-950 text-slate-900 dark:text-white border border-amber-500/60 focus:outline-none focus:border-amber-400 text-xs sm:text-sm"
                />
              </div>
            )}
          </div>

          {/* STEP 4: SELLER PROFILE & CONTACT */}
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-200 dark:border-lowveld-800/80 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                4. Seller Contact & Verification
              </h3>
              {user && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>Linked to {user.fullName}</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">
                  Your Full / Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  placeholder="e.g. Prince A. Shumba"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-lowveld-950 text-slate-900 dark:text-white border border-slate-300 dark:border-lowveld-800 focus:outline-none focus:border-emerald-500 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">
                  WhatsApp Phone Number *
                </label>
                <input
                  type="text"
                  required
                  value={sellerPhone}
                  onChange={(e) => setSellerPhone(e.target.value)}
                  placeholder="+263 77..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-lowveld-950 text-slate-900 dark:text-white border border-slate-300 dark:border-lowveld-800 focus:outline-none focus:border-emerald-500 text-xs sm:text-sm"
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
