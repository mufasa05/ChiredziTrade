'use client';

import React from 'react';
import { SectorCategory } from '@/lib/types';
import { 
  Sprout, 
  Wrench, 
  Truck, 
  Store, 
  Shirt, 
  Building2, 
  Sparkles,
  Layers 
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface CategoryPillsProps {
  selectedCategory: SectorCategory | 'all';
  onSelectCategory: (cat: SectorCategory | 'all') => void;
  counts?: Record<string, number>;
}

export default function CategoryPills({
  selectedCategory,
  onSelectCategory,
  counts,
}: CategoryPillsProps) {
  const { t } = useLanguage();

  const categoryDefinitions: {
    id: SectorCategory | 'all';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    colorClass: string;
  }[] = [
    {
      id: 'all',
      label: t.allSectors,
      icon: Layers,
      colorClass: 'text-gray-300 border-gray-600',
    },
    {
      id: 'livestock_agric',
      label: t.livestockAgric,
      icon: Sprout,
      colorClass: 'text-emerald-400 border-emerald-500/40',
    },
    {
      id: 'grocery_wholesale',
      label: t.groceryWholesale,
      icon: Store,
      colorClass: 'text-amber-400 border-amber-500/40',
    },
    {
      id: 'clothing_textiles',
      label: t.clothingTextiles,
      icon: Shirt,
      colorClass: 'text-pink-400 border-pink-500/40',
    },
    {
      id: 'building_construction',
      label: t.buildingConstruction,
      icon: Building2,
      colorClass: 'text-orange-400 border-orange-500/40',
    },
    {
      id: 'industrial_services',
      label: t.industrialTrades,
      icon: Wrench,
      colorClass: 'text-yellow-400 border-yellow-500/40',
    },
    {
      id: 'transport_logistics',
      label: t.haulageTransport,
      icon: Truck,
      colorClass: 'text-blue-400 border-blue-500/40',
    },
    {
      id: 'general_services',
      label: t.generalServices,
      icon: Sparkles,
      colorClass: 'text-purple-400 border-purple-500/40',
    },
  ];

  return (
    <div className="w-full py-2.5 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-2 sm:gap-2.5 min-w-max pb-1">
        {categoryDefinitions.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          const count = counts ? counts[cat.id] : undefined;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 shrink-0 ${
                isSelected
                  ? 'bg-gradient-to-r from-emerald-600 to-lowveld-700 text-white shadow-lg shadow-emerald-950/60 border border-emerald-400/50 scale-[1.02]'
                  : 'bg-lowveld-950/60 hover:bg-lowveld-900/80 text-gray-300 border border-lowveld-800/60 hover:border-lowveld-700'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : cat.colorClass.split(' ')[0]}`} />
              <span>{cat.label}</span>
              {typeof count === 'number' && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-lowveld-800 text-gray-400'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
