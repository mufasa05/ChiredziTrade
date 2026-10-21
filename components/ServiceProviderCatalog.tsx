'use client';

import React, { useState } from 'react';
import {
  Wrench,
  ShieldCheck,
  MapPin,
  Star,
  CheckCircle2,
  Phone,
  MessageCircle,
  RefreshCw,
  Coins,
  ArrowRight,
  Filter,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { formatServiceInquiryUrl } from '@/lib/whatsapp-messages';

export interface ServiceProvider {
  id: string;
  name: string;
  businessName: string;
  category: string;
  locationArea: string;
  verifiedArtisan: boolean;
  rating: number;
  completedJobs: number;
  phone: string;
  headline: string;
  availability: 'Available Today' | 'Next Day' | 'Booked this Week';
  rates: {
    item: string;
    price: string;
    unit?: string;
  }[];
  barterAccepted: string;
  portfolioImages: string[];
}

export const INITIAL_PROVIDERS: ServiceProvider[] = [
  {
    id: 'sp-1',
    name: 'Tavonga Hove',
    businessName: 'Lowveld Tractor Hire & Tilling',
    category: 'agric_machinery',
    locationArea: 'Chiredzi / Triangle',
    verifiedArtisan: true,
    rating: 4.9,
    completedJobs: 88,
    phone: '+263779012345',
    headline: '4x4 Tractor Disc Ploughing, Sugarcane Haulage & Land Clearing',
    availability: 'Available Today',
    rates: [
      { item: 'Field Diagnostics & Call-out', price: '$10' },
      { item: 'Disc Ploughing & Harrowing', price: '$45', unit: 'per hectare' },
      { item: '10t Trailer Cane Haulage', price: '$1.20', unit: 'per km' },
    ],
    barterAccepted: 'Diesel fuel drums, cattle feed, or seed maize',
    portfolioImages: [
      'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&auto=format&fit=crop&q=80',
    ],
  },
  {
    id: 'sp-2',
    name: 'Munyaradzi Mutasa',
    businessName: 'Mutasa Solar & Borehole Engineering',
    category: 'solar_borehole',
    locationArea: 'Harare - Borrowdale',
    verifiedArtisan: true,
    rating: 5.0,
    completedJobs: 95,
    phone: '+263770123456',
    headline: 'Certified Solar Submersible Pumps, 5kVA-10kVA Inverter Systems',
    availability: 'Available Today',
    rates: [
      { item: 'Solar Borehole Pump Installation', price: '$180' },
      { item: '5kVA Hybrid Inverter Setup', price: '$120' },
      { item: 'Complete Solar + Battery Commissioning', price: '$280' },
    ],
    barterAccepted: 'Building cement bags, steel roofing sheets, or fertilizer',
    portfolioImages: [
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&auto=format&fit=crop&q=80',
    ],
  },
  {
    id: 'sp-3',
    name: 'Blessing Sithole',
    businessName: 'Lowveld Heavy Hydraulics & Diesel Workshop',
    category: 'industrial_mechanics',
    locationArea: 'Chiredzi Town',
    verifiedArtisan: true,
    rating: 4.9,
    completedJobs: 64,
    phone: '+263776789012',
    headline: 'Tractor, Sugarcane Harvester & Heavy Truck Hydraulic Rebuilds',
    availability: 'Available Today',
    rates: [
      { item: 'Emergency Mobile Call-out', price: '$20' },
      { item: 'Hydraulic Cylinder & Hose Replacement', price: '$35' },
      { item: 'Full Diesel Engine Overhaul', price: '$200' },
    ],
    barterAccepted: 'Workshop hand tools, heavy batteries, or goats',
    portfolioImages: [
      'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=80',
    ],
  },
  {
    id: 'sp-4',
    name: 'Prince A. Shumba',
    businessName: 'Shumba Tech & Web Systems',
    category: 'it_digital',
    locationArea: 'Harare CBD',
    verifiedArtisan: true,
    rating: 5.0,
    completedJobs: 110,
    phone: '+263778901234',
    headline: 'Custom Web Apps, WhatsApp Trading Bots & Mobile Payment Integration',
    availability: 'Available Today',
    rates: [
      { item: 'SME Business Website & Catalog', price: '$50' },
      { item: 'WhatsApp Automated Ordering Bot', price: '$80' },
      { item: 'Full Custom Marketplace Portal', price: '$250' },
    ],
    barterAccepted: 'Groceries wholesale, farm produce, or hardware materials',
    portfolioImages: [
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&auto=format&fit=crop&q=80',
    ],
  },
  {
    id: 'sp-5',
    name: 'Simba Chauke',
    businessName: 'Chauke Cold Haulage & Livestock Logistics',
    category: 'transport_logistics',
    locationArea: 'Masvingo & Chiredzi',
    verifiedArtisan: true,
    rating: 4.8,
    completedJobs: 72,
    phone: '+263774567890',
    headline: 'Refrigerated Meat Transport, Cattle Trucking & Lowveld Deliveries',
    availability: 'Available Today',
    rates: [
      { item: 'Local Chiredzi Town Dispatch', price: '$25' },
      { item: 'Masvingo - Chiredzi Supply Run', price: '$90' },
      { item: 'Livestock Truck Hire (up to 20 cattle)', price: '$150' },
    ],
    barterAccepted: 'Slaughter stock, maize bags, or diesel coupons',
    portfolioImages: [
      'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=400&auto=format&fit=crop&q=80',
    ],
  },
];

export default function ServiceProviderCatalog() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [barterOnly, setBarterOnly] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'agric_machinery', label: 'Tractor & Agric Hire' },
    { id: 'solar_borehole', label: 'Solar & Borehole Pumps' },
    { id: 'industrial_mechanics', label: 'Heavy Mechanics & Hydraulics' },
    { id: 'it_digital', label: 'IT & Digital Services' },
    { id: 'transport_logistics', label: 'Haulage & Livestock Transport' },
  ];

  const filteredProviders = INITIAL_PROVIDERS.filter((p) => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (selectedLocation !== 'all' && !p.locationArea.toLowerCase().includes(selectedLocation.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#062A22] via-[#041d18] to-[#0a3a30] text-white border border-[#0e4337] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-[#4ade80] text-xs font-bold border border-emerald-500/30">
            <Wrench className="w-3.5 h-3.5" />
            <span>Verified Zimbabwean Artisans & Service Directory</span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
            Service Providers Catalog
          </h2>
          <p className="text-xs sm:text-sm text-gray-200/90 leading-relaxed">
            Directly hire verified local technicians, mechanics, borehole specialists, and machinery operators with clear rate cards and barter terms.
          </p>
        </div>

        <a
          href="/post"
          className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all hover:scale-105 shrink-0"
        >
          <span>+ Register as Service Provider</span>
        </a>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === c.id
                ? 'bg-[#059669] text-white shadow-md'
                : 'bg-white dark:bg-[#0c1813] text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-[#12241d] border border-[#E2E8E4] dark:border-[#0e4337]'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Provider Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredProviders.map((provider) => {
          const directWhatsAppUrl = formatServiceInquiryUrl({
            providerPhone: provider.phone,
            providerName: provider.name,
            tradeCategory: provider.businessName,
            locationHub: provider.locationArea,
            requestedService: provider.headline,
          });

          return (
            <div
              key={provider.id}
              className="bg-white dark:bg-[#0c1813] rounded-3xl border border-[#E2E8E4] dark:border-[#0e4337] p-5 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Header: Name, Verified Badge, Location */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white font-black text-base flex items-center justify-center shadow-md">
                      {provider.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                          {provider.name}
                        </h3>
                        {provider.verifiedArtisan && (
                          <span title="Verified Artisan">
                            <ShieldCheck className="w-4 h-4 text-[#059669]" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-gray-400 font-medium">
                        {provider.businessName}
                      </p>
                    </div>
                  </div>

                  <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-[#059669] border border-emerald-500/20 whitespace-nowrap">
                    {provider.availability}
                  </span>
                </div>

                {/* Rating & Location Area */}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-gray-400 pb-3 mb-3 border-b border-slate-100 dark:border-[#0e4337]/60">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#059669]" />
                    <span>{provider.locationArea}</span>
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-gray-300">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{provider.rating} ({provider.completedJobs} jobs)</span>
                  </span>
                </div>

                {/* Headline */}
                <p className="text-xs text-slate-700 dark:text-gray-300 font-medium leading-relaxed mb-4">
                  {provider.headline}
                </p>

                {/* Service Menu & Rate Cards (The Core Catalog Feature) */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#041d18] border border-slate-200 dark:border-[#0e4337] space-y-2 mb-4">
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-gray-400 tracking-wider block">
                    Service Rates & Menu
                  </span>
                  <div className="space-y-1.5">
                    {provider.rates.map((rate, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs py-1 border-b border-slate-200/60 dark:border-[#0e4337]/40 last:border-0"
                      >
                        <span className="text-slate-800 dark:text-gray-200 font-medium truncate pr-2">
                          {rate.item}
                        </span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-black shrink-0">
                          {rate.price} {rate.unit ? <span className="text-[10px] font-normal text-slate-500">/{rate.unit}</span> : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Barter Accepted terms */}
                <div className="text-xs p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-500/30 text-amber-900 dark:text-[#F5C542] mb-4 flex items-start gap-2">
                  <RefreshCw className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600 dark:text-[#F5C542]" />
                  <div>
                    <span className="font-bold">Barter Accepted: </span>
                    <span>{provider.barterAccepted}</span>
                  </div>
                </div>

                {/* Portfolio Preview */}
                {provider.portfolioImages.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {provider.portfolioImages.map((img, i) => (
                      <div key={i} className="aspect-video rounded-xl overflow-hidden bg-slate-100">
                        <img src={img} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                <a
                  href={directWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#005c4b] hover:bg-[#00735e] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:scale-[1.02]"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-300" />
                  <span>Request WhatsApp Quote</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
