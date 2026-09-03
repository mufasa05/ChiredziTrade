'use client';

import React from 'react';
import { MapPin, RefreshCw, Sparkles, X } from 'lucide-react';
import { TradeCurrency } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';

interface FilterBarProps {
  selectedLocation: string;
  onSelectLocation: (loc: string) => void;
  selectedCurrency: TradeCurrency | 'all';
  onSelectCurrency: (curr: TradeCurrency | 'all') => void;
  barterOnly: boolean;
  onToggleBarterOnly: (val: boolean) => void;
  harvestReady: boolean;
  onToggleHarvestReady: (val: boolean) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const LOWVELD_LOCATIONS = [
  'All Locations',
  'Tshovani',
  'Chiredzi Light Industry',
  'Triangle Estate',
  'Hippo Valley',
  'Mkwasine',
  'Buffalo Range',
  'Chipiwa Outgrowers',
  'Malipati',
  'Mwenezi / Rutenga',
];

export default function FilterBar({
  selectedLocation,
  onSelectLocation,
  selectedCurrency,
  onSelectCurrency,
  barterOnly,
  onToggleBarterOnly,
  harvestReady,
  onToggleHarvestReady,
  onResetFilters,
  hasActiveFilters,
}: FilterBarProps) {
  const { t } = useLanguage();

  return (
    <div className="w-full py-3 px-3 sm:px-4 rounded-2xl glass-panel border border-lowveld-800/40 mb-6 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* Location Dropdown */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-lowveld-950/70 border border-lowveld-800/70 text-gray-300">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <select
            value={selectedLocation}
            onChange={(e) => onSelectLocation(e.target.value)}
            className="bg-transparent text-gray-200 focus:outline-none cursor-pointer text-xs sm:text-sm"
          >
            {LOWVELD_LOCATIONS.map((loc) => (
              <option key={loc} value={loc === 'All Locations' ? 'all' : loc} className="bg-lowveld-950 text-white">
                {loc === 'All Locations' ? t.allLocations : loc}
              </option>
            ))}
          </select>
        </div>

        {/* Currency Segment Filter */}
        <div className="flex items-center bg-lowveld-950/70 p-1 rounded-xl border border-lowveld-800/70">
          <button
            onClick={() => onSelectCurrency('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
              selectedCurrency === 'all'
                ? 'bg-emerald-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {t.allCurrencies}
          </button>
          <button
            onClick={() => onSelectCurrency('USD')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
              selectedCurrency === 'USD'
                ? 'bg-emerald-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            USD ($)
          </button>
          <button
            onClick={() => onSelectCurrency('ZAR')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
              selectedCurrency === 'ZAR'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            ZAR (R)
          </button>
          <button
            onClick={() => onSelectCurrency('ZWG')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
              selectedCurrency === 'ZWG'
                ? 'bg-amber-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            ZWG (ZiG)
          </button>
        </div>

        {/* Barter Switch Toggle */}
        <button
          onClick={() => onToggleBarterOnly(!barterOnly)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
            barterOnly
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm shadow-amber-950'
              : 'bg-lowveld-950/70 text-gray-400 border-lowveld-800/70 hover:text-gray-200'
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${barterOnly ? 'text-amber-400 animate-spin' : ''}`} />
          <span>{t.barterAccepted}</span>
        </button>

        {/* Sugarcane Harvest Ready Toggle */}
        <button
          onClick={() => onToggleHarvestReady(!harvestReady)}
          className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
            harvestReady
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
              : 'bg-lowveld-950/70 text-gray-400 border-lowveld-800/70 hover:text-gray-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>{t.caneHarvestReady}</span>
        </button>
      </div>

      {/* Reset Filter Button */}
      {hasActiveFilters && (
        <button
          onClick={onResetFilters}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors ml-auto"
        >
          <X className="w-3.5 h-3.5" />
          <span>{t.clearFilters}</span>
        </button>
      )}
    </div>
  );
}
