'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ShieldCheck, Lock, ArrowRight, ShoppingBag, Loader2 } from 'lucide-react';

interface AuthGateProps {
  featureName: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}

export default function AuthGate({
  featureName,
  description,
  icon: Icon = Lock,
  children,
}: AuthGateProps) {
  const { isAuthenticated, authLoading, openAuthModal } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-3" />
        <p className="text-xs text-slate-500 dark:text-gray-400 font-medium">
          Verifying trader session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center animate-fade-in">
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#0c1813] border border-slate-200 dark:border-[#0e4337] shadow-xl text-center space-y-5">
          {/* Icon Badge */}
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/30 shadow-inner">
            <Icon className="w-8 h-8" />
          </div>

          {/* Heading */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Trader Authentication Required</span>
            </div>
            <h2 className="font-display font-black text-2xl text-slate-900 dark:text-white">
              Sign In to Access {featureName}
            </h2>
            <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed max-w-sm mx-auto">
              {description ||
                `Guest visitors cannot access ${featureName.toLowerCase()}. Sign in or create a verified account to manage your trades, inventory, and communications.`}
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={() => openAuthModal(`Please sign in to access ${featureName}.`)}
              className="w-full py-3.5 px-5 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>Sign In / Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              href="/marketplace"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-[#062A22]/50 hover:bg-slate-200 dark:hover:bg-[#062A22] text-slate-700 dark:text-gray-300 text-xs font-bold transition-colors flex items-center justify-center gap-2 border border-slate-200 dark:border-[#0e4337]"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-slate-500" />
              <span>Browse Public Marketplace</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

