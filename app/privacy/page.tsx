import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Shield, Lock, Eye, FileText, ArrowLeft, Mail } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Zim Barter & Chiredzi Trade',
  description: 'Privacy Policy for Zim Barter platform, Google OAuth, user data protection, and WhatsApp trade communications across Zimbabwe.',
};

export default function PrivacyPage() {
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
              <Shield className="w-3.5 h-3.5" />
              <span>Platform Legal & Data Protection</span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 mt-2">
              Last updated: October 2026 • Effective Date: October 2026
            </p>
          </div>

          <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-700 dark:text-gray-300 space-y-6 leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                1. Overview & Scope
              </h2>
              <p>
                Zim Barter (accessible at <span className="font-mono text-emerald-600 dark:text-emerald-400">chiredzi-trade.vercel.app</span>) is an online marketplace designed to facilitate peer-to-peer commerce, barter swaps, livestock trading, artisan contracts, and multi-currency transactions across Zimbabwe. This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our website, mobile progressive web app (PWA), and associated WhatsApp integrations.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                2. Information We Collect
              </h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>Google Authentication Data:</strong> When you choose to sign in via Google OAuth, we receive your basic profile information consisting of your name, verified email address, and profile picture URL. We use this strictly to identify your account and personalize your marketplace profile.
                </li>
                <li>
                  <strong>Contact & Trading Details:</strong> When you post a listing or propose a trade, we collect listing details, item descriptions, price or barter terms, town/location, and WhatsApp contact phone numbers provided by you.
                </li>
                <li>
                  <strong>Device and Usage Information:</strong> We may collect standard technical data including browser type, operating system, and IP address for diagnostic and anti-fraud monitoring.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                3. How We Use Your Information
              </h2>
              <p>We use the collected information for the following purposes:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>To authenticate your identity via Google Sign-In and maintain your user session.</li>
                <li>To display your marketplace listings to prospective buyers and barter counterparties across Zimbabwe.</li>
                <li>To enable bilateral communication and trade agreements directly via WhatsApp.</li>
                <li>To prevent fraud, spam, malicious activity, and unauthorized administrative access.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                4. Information Sharing & Third Parties
              </h2>
              <p>
                <strong>We do not sell, rent, or monetize your personal data.</strong> Your information is only shared under these strict circumstances:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>Marketplace Counterparties:</strong> Contact numbers you attach to public listings are visible to users to allow them to contact you directly on WhatsApp or phone.
                </li>
                <li>
                  <strong>Infrastructure Providers:</strong> We utilize secure third-party cloud infrastructure including Google Cloud (for Google Single Sign-On authentication), Vercel (for application hosting), and Supabase (for database persistence).
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                5. Data Retention & Deletion Rights
              </h2>
              <p>
                You have the right to request deletion of your account and all associated marketplace listings at any time. To request removal of your profile, email, or listing records, please contact our support team at <a href="mailto:princeashumba@gmail.com" className="text-emerald-600 dark:text-emerald-400 hover:underline">princeashumba@gmail.com</a>.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                6. Contact Information
              </h2>
              <p>
                For any questions or inquiries concerning this Privacy Policy or data handling practices, please contact:
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
