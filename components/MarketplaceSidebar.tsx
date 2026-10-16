'use client';

import React from 'react';
import Link from 'next/link';
import {
  Wheat,
  Smartphone,
  Home,
  Wrench,
  Car,
  Shirt,
  Briefcase,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { SectorCategory } from '@/lib/types';

interface MarketplaceSidebarProps {
  onSelectCategory?: (cat: SectorCategory | 'all') => void;
  selectedCategory?: SectorCategory | 'all';
}

export default function MarketplaceSidebar({
  onSelectCategory,
  selectedCategory,
}: MarketplaceSidebarProps) {
  const popularCategories = [
    { id: 'livestock_agric', label: 'Agriculture', count: '1,284', icon: Wheat, color: 'text-amber-500' },
    { id: 'electronics', label: 'Electronics', count: '892', icon: Smartphone, color: 'text-blue-500' },
    { id: 'properties', label: 'Properties', count: '647', icon: Home, color: 'text-emerald-500' },
    { id: 'industrial_services', label: 'Services', count: '521', icon: Wrench, color: 'text-yellow-500' },
    { id: 'transport_logistics', label: 'Vehicles', count: '398', icon: Car, color: 'text-sky-500' },
    { id: 'clothing_textiles', label: 'Fashion & Apparel', count: '312', icon: Shirt, color: 'text-rose-500' },
    { id: 'jobs', label: 'Jobs', count: '268', icon: Briefcase, color: 'text-teal-500' },
    { id: 'education', label: 'Education', count: '203', icon: GraduationCap, color: 'text-indigo-500' },
  ];

  return (
    <div className="space-y-5">
      {/* Popular Categories Card */}
      <div className="bg-white dark:bg-[#0c1813] rounded-3xl p-5 border border-[#E2E8E4] dark:border-[#0e4337] shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
            Popular Categories
          </h3>
          <button
            onClick={() => onSelectCategory && onSelectCategory('all')}
            className="text-xs font-semibold text-[#059669] hover:underline"
          >
            View all
          </button>
        </div>

        <div className="space-y-1.5">
          {popularCategories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory && onSelectCategory(cat.id as any)}
                className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-colors ${
                  isSelected
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-[#059669] font-bold'
                    : 'text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-[#12241d]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-[#041d18] flex items-center justify-center shrink-0">
                    <Icon className={`w-3.5 h-3.5 ${cat.color}`} />
                  </div>
                  <span className="truncate">{cat.label}</span>
                </div>
                <span className="text-[11px] text-slate-400 dark:text-gray-500 font-medium">
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ZimBarter Promo Card */}
      <div className="rounded-3xl bg-gradient-to-br from-[#062A22] via-[#041d18] to-[#021410] text-white p-5 border border-[#0e4337] shadow-xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -right-8 -top-8 w-28 h-28 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
              ZB
            </div>
            <div>
              <p className="font-display font-black text-sm text-white leading-tight">
                Zim<span className="text-[#F5C542]">Barter</span>
              </p>
              <p className="text-[10px] text-emerald-400 font-medium">Trade Without Limits</p>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-gray-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
              <span>Safe & Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
              <span>Verified Users</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
              <span>Local Support</span>
            </div>
          </div>

          <Link
            href="/post"
            className="w-full py-2.5 px-4 rounded-xl bg-[#F5C542] hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md hover:scale-[1.02]"
          >
            <span>Start Trading</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
