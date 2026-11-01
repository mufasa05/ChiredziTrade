'use client';

import React from 'react';
import Link from 'next/link';

interface LogoProps {
  variant?: 'full' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withLink?: boolean;
  className?: string;
}

export default function Logo({
  variant = 'full',
  size = 'md',
  withLink = false,
  className = '',
}: LogoProps) {
  const emblemSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base sm:text-lg',
    lg: 'text-xl sm:text-2xl',
    xl: 'text-2xl sm:text-3xl',
  };

  const subtextSizes = {
    sm: 'text-[8px]',
    md: 'text-[9.5px]',
    lg: 'text-[11px]',
    xl: 'text-xs',
  };

  const Emblem = (
    <div
      className={`relative ${emblemSizes[size]} shrink-0 rounded-2xl p-[1.5px] bg-gradient-to-tr from-[#059669] via-[#10B981] to-[#F5C542] shadow-sm flex items-center justify-center transition-transform group-hover:scale-105`}
    >
      <div className="w-full h-full rounded-[14px] bg-[#041d18] flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full p-1">
          <defs>
            <linearGradient id="compZimGreen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="compZimGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#F5C542" />
            </linearGradient>
          </defs>

          {/* Dotted orbital ring */}
          <circle cx="32" cy="32" r="23" stroke="#F5C542" strokeWidth="1.2" strokeOpacity="0.35" strokeDasharray="2.5 2.5" />

          {/* Upper Exchange Arrow Arc (Emerald) */}
          <path
            d="M 21 23 C 27 16 37 16 43 21 L 45 17 L 46 26 L 37 26 L 40 23 C 35 19 27 19 23 24 Z"
            fill="url(#compZimGreen)"
          />

          {/* Lower Exchange Arrow Arc (Gold) */}
          <path
            d="M 43 41 C 37 48 27 48 21 43 L 19 47 L 18 38 L 27 38 L 24 41 C 29 45 37 45 41 40 Z"
            fill="url(#compZimGold)"
          />

          {/* Central Great Zimbabwe Diamond / Star */}
          <polygon points="32,24 38,32 32,40 26,32" fill="#FFFFFF" fillOpacity="0.95" />
          <circle cx="32" cy="32" r="3" fill="#F5C542" />
        </svg>
      </div>
    </div>
  );

  const Content = (
    <div className={`flex items-center gap-2.5 ${className} group select-none`}>
      {Emblem}

      {variant === 'full' && (
        <div className="flex flex-col justify-center leading-tight">
          <div className={`font-display font-black tracking-tight ${textSizes[size]} text-slate-900 dark:text-white`}>
            <span>Zim</span>
            <span className="text-emerald-600 dark:text-[#F5C542]">Barter</span>
          </div>
          <p className={`${subtextSizes[size]} text-emerald-600 dark:text-emerald-400/90 font-bold tracking-wider uppercase`}>
            Trade • Swap • Grow
          </p>
        </div>
      )}
    </div>
  );

  if (withLink) {
    return (
      <Link href="/" className="inline-flex items-center focus:outline-none">
        {Content}
      </Link>
    );
  }

  return Content;
}

