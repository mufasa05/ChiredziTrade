'use client';

import React from 'react';
import Link from 'next/link';
import { LayoutGrid, ArrowRight } from 'lucide-react';
import { SectorCategory } from '@/lib/types';

interface CategoryGridProps {
  selectedCategory: SectorCategory | 'all';
  onSelectCategory: (cat: SectorCategory | 'all') => void;
}

export default function CategoryPills({
  selectedCategory,
  onSelectCategory,
}: CategoryGridProps) {
  // Realistic category representations matching international standards
  const categories = [
    {
      id: 'livestock_agric',
      label: 'Agriculture',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=160&auto=format&fit=crop&q=80',
    },
    {
      id: 'electronics',
      label: 'Electronics',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=160&auto=format&fit=crop&q=80',
    },
    {
      id: 'clothing_textiles',
      label: 'Fashion & Apparel',
      image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=160&auto=format&fit=crop&q=80',
    },
    {
      id: 'home_living',
      label: 'Home & Living',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=160&auto=format&fit=crop&q=80',
    },
    {
      id: 'transport_logistics',
      label: 'Vehicles',
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=160&auto=format&fit=crop&q=80',
    },
    {
      id: 'properties',
      label: 'Properties',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=160&auto=format&fit=crop&q=80',
    },
    {
      id: 'industrial_services',
      label: 'Services',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=160&auto=format&fit=crop&q=80',
    },
    {
      id: 'education',
      label: 'Education',
      image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=160&auto=format&fit=crop&q=80',
    },
    {
      id: 'jobs',
      label: 'Jobs',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=160&auto=format&fit=crop&q=80',
    },
    {
      id: 'all',
      label: 'More',
      isMore: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mb-6 items-stretch">
      {/* 10 Category Cards (9 cols on large desktop) */}
      <div className="lg:col-span-9 bg-white dark:bg-[#0c1813] p-2.5 sm:p-3 rounded-2xl border border-[#E2E8E4] dark:border-[#0e4337] shadow-sm flex items-center overflow-x-auto no-scrollbar gap-2 sm:gap-2.5">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id as any)}
              className={`flex flex-col items-center justify-between p-2 rounded-xl min-w-[70px] sm:min-w-[78px] shrink-0 transition-all duration-150 group border ${
                isSelected
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-[#059669] shadow-sm scale-105'
                  : 'bg-white dark:bg-[#062A22]/30 border-slate-100 dark:border-[#0e4337] hover:border-slate-300 dark:hover:border-emerald-600'
              }`}
            >
              {/* Product Thumbnail / Graphic */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg overflow-hidden flex items-center justify-center bg-slate-50 dark:bg-[#041d18] mb-1 group-hover:scale-105 transition-transform">
                {cat.isMore ? (
                  <LayoutGrid className="w-5 h-5 text-slate-700 dark:text-gray-300" />
                ) : (
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="w-full h-full object-cover rounded-md"
                    loading="lazy"
                  />
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[10px] sm:text-[11px] font-semibold text-center leading-tight whitespace-nowrap line-clamp-1 ${
                  isSelected
                    ? 'text-[#059669] dark:text-emerald-400 font-bold'
                    : 'text-slate-800 dark:text-gray-200'
                }`}
              >
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right Promo Banner Card (3 cols on large desktop) */}
      <div className="lg:col-span-3 rounded-2xl bg-[#062A22] text-white p-3.5 sm:p-4 flex items-center justify-between border border-[#0e4337] shadow-md relative overflow-hidden group">
        <div className="space-y-1 relative z-10 pr-2">
          <p className="text-xs sm:text-sm font-bold text-white leading-tight">
            Turn What You Have Into What You Need
          </p>
          <p className="text-[10px] text-emerald-400 font-medium">
            List • Trade • Grow
          </p>
        </div>

        <Link
          href="/post"
          className="relative z-10 w-9 h-9 rounded-full bg-[#10b981] hover:bg-[#059669] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform shrink-0"
          aria-label="Start Trading"
        >
          <ArrowRight className="w-4 h-4" />
        </Link>

        {/* Realistic harvest basket image in background */}
        <div className="absolute right-0 top-0 bottom-0 w-28 opacity-30 pointer-events-none overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&auto=format&fit=crop&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
