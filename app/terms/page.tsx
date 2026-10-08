import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Scale, CheckCircle2, AlertTriangle, ArrowLeft, Mail } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Zim Barter & Chiredzi Trade',
  description: 'Terms of Service for Zim Barter platform, multi-currency trade, barter exchange guidelines, and user responsibilities across Zimbabwe.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070d09] text-slate-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex-1 w-full">
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>

        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-lowveld-800/50 shadow-xl space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-3">
              <Scale className="w-3.5 h-3.5" />
              <span>Platform Legal Terms</span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
              Terms of Service
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 mt-2">
              Last updated: October 2026 • Effective Date: October 2026
            </p>
          </div>

          <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-700 dark:text-gray-300 space-y-6 leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using Zim Barter (<span className="font-mono text-emerald-600 dark:text-emerald-400">chiredzi-trade.vercel.app</span>), registering via Google Sign-In, or listing items and services, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use the platform.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                2. Nature of the Marketplace
              </h2>
              <p>
                Zim Barter operates as an open community marketplace and intelligent bilateral barter matchmaking hub connecting farmers, ranchers, artisans, wholesalers, traders, and consumers across Harare, Bulawayo, Mutare, Masvingo, Chiredzi, and nationwide Zimbabwe.
              </p>
              <p>
                <strong>Zim Barter is not an auctioneer, escrow agent, or party to any individual transaction.</strong> All transactions, whether settled in cash (USD, ZWG, ZAR) or executed via direct barter swaps of livestock, produce, solar hardware, or artisan labour, are conducted solely between the buyer and seller.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                3. User Responsibilities & Conduct
              </h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>Accurate Representations:</strong> Sellers must accurately describe the condition, weight, age, or functionality of all listed items (including cattle health certificates, crop harvest status, vehicle titles, and equipment specs).
                </li>
                <li>
                  <strong>Physical Inspection:</strong> Parties are strongly advised to inspect goods, livestock, and machinery in person in safe public locations before handing over funds or exchanging barter assets.
                </li>
                <li>
                  <strong>Prohibited Content:</strong> You may not post stolen property, illegal substances, counterfeit currency, unlicensed weapons, or fraudulent trade offers.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                4. Multi-Currency & Barter Agreements
              </h2>
              <p>
                Users acknowledge that multi-currency trades (USD cash, South African Rand, and Zimbabwe Gold ZiG/ZWG) and bilateral barter swaps carry inherent price volatility. Exchange values and barter ratios negotiated between trading parties are solely the responsibility of those parties. Zim Barter makes no warranties regarding future currency values or barter equivalencies.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                5. Limitation of Liability
              </h2>
              <p>
                To the maximum extent permitted by applicable laws of Zimbabwe, Zim Barter, its founder Prince A. Shumba, and operators shall not be held liable for any direct, indirect, incidental, or consequential damages resulting from transactions, goods defects, non-delivery, payment disputes, or agreements reached between platform users.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                6. Questions & Contact
              </h2>
              <p>
                If you have questions regarding these Terms of Service or wish to report a suspicious listing:
              </p>
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-lowveld-950/70 border border-slate-200 dark:border-lowveld-800 text-xs sm:text-sm space-y-1">
                <p className="font-bold text-slate-900 dark:text-white">Prince A. Shumba</p>
                <p className="text-slate-600 dark:text-gray-400">Founder & Platform Engineer — Zim Barter / Chiredzi Trade</p>
                <p className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 pt-1">
                  <Mail className="w-3.5 h-3.5" />
                  <a href="mailto:princeashumba@gmail.com" className="hover:underline">princeashumba@gmail.com</a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
