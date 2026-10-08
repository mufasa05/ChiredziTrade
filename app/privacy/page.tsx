import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Shield, 
  Lock, 
  Eye, 
  FileText, 
  ArrowLeft, 
  Mail, 
  CheckCircle2, 
  AlertCircle, 
  Database, 
  Trash2,
  Server,
  GlobeLock
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy & Data Protection | Zim Barter & Chiredzi Trade',
  description: 'Comprehensive Privacy Policy and statutory data protection statement for Zim Barter platform under Zimbabwe Cyber & Data Protection Act [Chapter 12:07] and Google API Limited Use Policy.',
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
              <span>Statutory Data Protection & Compliance</span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
              Privacy Policy & Data Governance
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 mt-2">
              Last revised: October 2026 • Governing Law: Cyber & Data Protection Act [Chapter 12:07] (Zimbabwe)
            </p>
          </div>

          <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-700 dark:text-gray-300 space-y-7 leading-relaxed">
            
            {/* 1. Introduction & Data Controller */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <GlobeLock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                1. Platform Overview & Data Controller
              </h2>
              <p>
                Zim Barter (operating online at <span className="font-mono text-emerald-600 dark:text-emerald-400">chiredzi-trade.vercel.app</span> and across associated Progressive Web Applications) is a community trade directory and bilateral barter matching engine for Zimbabwe.
              </p>
              <p>
                The designated <strong>Data Controller</strong> responsible for processing your personal information is:
              </p>
              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-lowveld-950/70 border border-slate-200 dark:border-lowveld-800 text-xs">
                <p className="font-bold text-slate-900 dark:text-white">Prince A. Shumba (Founder & Platform Engineer)</p>
                <p className="text-slate-600 dark:text-gray-400">Zim Barter / Chiredzi Trade Platform Operations</p>
                <p className="text-emerald-600 dark:text-emerald-400">Email: princeashumba@gmail.com</p>
              </div>
            </section>

            {/* 2. Legal Basis for Processing */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                2. Legal Basis for Processing
              </h2>
              <p>
                In strict adherence to the <strong>Cyber and Data Protection Act [Chapter 12:07]</strong> of Zimbabwe, we process personal data exclusively under the following lawful bases:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Consent:</strong> Freely given when you authenticate via Google Sign-In or post a marketplace listing.</li>
                <li><strong>Contractual Performance:</strong> Necessary to display your trade offers and enable bilateral negotiations between trading parties.</li>
                <li><strong>Legitimate Interests:</strong> To detect fraudulent listings, prevent spam, and maintain platform security.</li>
                <li><strong>Compliance with Legal Obligations:</strong> To comply with statutory law enforcement directives when lawfully requested by Zimbabwean authorities.</li>
              </ul>
            </section>

            {/* 3. Categories of Data Collected */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                3. Categories of Data Collected
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Google Authentication Data:</strong> When you sign in using Google Single Sign-On (OAuth 2.0), we receive your Google ID token containing your full name, verified email address, Google account ID, and profile picture avatar. We do <em>not</em> access your Google password, contacts, Google Drive, emails, or calendar.
                </li>
                <li>
                  <strong>Public Marketplace Listing Content:</strong> Information you affirmatively choose to broadcast to other users, including item descriptions, barter exchange preferences, agricultural produce specs, cattle details, pricing (USD, ZWG, ZAR), photos, town/district, and designated WhatsApp/Econet/NetOne contact phone numbers.
                </li>
                <li>
                  <strong>Technical Diagnostics:</strong> Standard non-identifying telemetry including browser user agent, device screen dimensions, general IP region, and error logs collected solely to maintain application stability.
                </li>
              </ul>
            </section>

            {/* 4. Google API Services User Data Policy / Limited Use */}
            <section className="space-y-3 p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/30">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                4. Google API User Data & Limited Use Disclosure
              </h2>
              <p>
                Zim Barter&apos;s use and transfer to any other app of information received from Google APIs will adhere to the{' '}
                <a 
                  href="https://developers.google.com/terms/api-services-user-data-policy" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Google API Services User Data Policy
                </a>, including the Limited Use requirements:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                <li>We only use your Google profile info to authenticate you and display your name on trade listings you author.</li>
                <li>We <strong>do not sell</strong> user data obtained through Google APIs to any third party.</li>
                <li>We <strong>do not use or transfer</strong> Google user data for serving advertisements (retargeting, personalized ads, or data brokering).</li>
                <li>We <strong>do not use</strong> Google user data to train generalized artificial intelligence or machine learning models without explicit affirmative consent.</li>
                <li>No humans read your Google account data unless you have given prior consent for technical support or it is strictly necessary for legal compliance.</li>
              </ul>
            </section>

            {/* 5. Zero Commercial Sale of Data */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                5. Zero Sale or Commercial Leasing of User Data
              </h2>
              <p>
                <strong>We will never sell, rent, monetize, or lease your personal data or phone numbers to third-party telemarketers, credit bureaus, or advertising networks.</strong> Your contact details are only visible to the extent you publish them in public marketplace listings to enable other Zimbabwean traders to contact you via WhatsApp.
              </p>
            </section>

            {/* 6. WhatsApp & Off-Platform Communications */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                6. WhatsApp & Off-Platform Interaction Disclaimer
              </h2>
              <p>
                When you click a trader&apos;s WhatsApp link or contact button, you leave the Zim Barter application and transition into the third-party WhatsApp service (operated by Meta Platforms, Inc.). 
              </p>
              <p>
                Any messages, audio notes, photos, national ID documents, or mobile money payments exchanged directly between users over WhatsApp are end-to-end encrypted under Meta&apos;s Terms of Service. Zim Barter does not monitor, record, store, or accept liability for private off-platform WhatsApp conversations.
              </p>
            </section>

            {/* 7. Third-Party Infrastructure */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                7. Trusted Cloud Infrastructure Providers
              </h2>
              <p>
                To provide high-availability hosting and cryptographic authentication, we transmit encrypted data only through SOC 2 / ISO 27001 compliant cloud infrastructure:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Google Cloud Identity (GSI):</strong> Cryptographic authentication token issuance.</li>
                <li><strong>Vercel, Inc.:</strong> Global Edge CDN and Next.js hosting.</li>
                <li><strong>Supabase Inc.:</strong> Encrypted PostgreSQL database and Realtime WebSocket persistence.</li>
              </ul>
            </section>

            {/* 8. Cookies & Local Storage */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                8. Cookies & Local Storage
              </h2>
              <p>
                We do not employ intrusive tracking cookies or cross-site tracking pixels. We use standard browser <code className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-lowveld-900 font-mono text-xs">localStorage</code> solely to remember your UI theme (Light/Dark mode), language selection (English/Shona/Ndebele), and temporary offline drafts of your marketplace posts.
              </p>
            </section>

            {/* 9. Data Retention & Erasure Rights */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-red-500" />
                9. User Rights & Data Erasure (&quot;Right to be Forgotten&quot;)
              </h2>
              <p>
                Under Section 21 of the Cyber and Data Protection Act of Zimbabwe, you hold fundamental rights regarding your data:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Right of Access:</strong> You may request an export of all personal data held about you.</li>
                <li><strong>Right to Rectification:</strong> You may update or correct any inaccurate listing details.</li>
                <li><strong>Right to Erasure:</strong> You may request permanent deletion of your profile, email records, and all listings.</li>
              </ul>
              <p>
                To exercise any of these statutory rights, email <a href="mailto:princeashumba@gmail.com" className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">princeashumba@gmail.com</a> with the subject line <em>&quot;Data Deletion Request&quot;</em>. All verified deletion requests are permanently honored within <strong>14 calendar days</strong>.
              </p>
            </section>

            {/* 10. Protection of Minors */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                10. Protection of Minors (Age 18+ Requirement)
              </h2>
              <p>
                Zim Barter is strictly intended for individuals who are 18 years of age or older and legally capable of entering into binding commercial contracts in Zimbabwe. We do not knowingly collect personal information from individuals under the age of 18. If we discover a minor has posted listings or created an account, all associated data will be expunged immediately.
              </p>
            </section>

            {/* 11. Security & Statutory Disclosures */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                11. Security Measures & Statutory Disclosures
              </h2>
              <p>
                We enforce industry-standard HTTPS encryption (TLS 1.3), hashed admin credentials, and strict CSP headers. However, please remember that no Internet transmission is 100% immune from unauthorized access. We will notify affected users and regulatory authorities promptly in the unlikely event of a verified data breach.
              </p>
            </section>

            {/* 12. Contact */}
            <section className="space-y-3 pt-4 border-t border-slate-200 dark:border-lowveld-800">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                12. Legal Inquiries & Data Protection Contact
              </h2>
              <p>
                If you have questions, complaints, or compliance concerns regarding this Privacy Policy:
              </p>
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-lowveld-950/70 border border-slate-200 dark:border-lowveld-800 text-xs sm:text-sm space-y-1">
                <p className="font-bold text-slate-900 dark:text-white">Prince A. Shumba</p>
                <p className="text-slate-600 dark:text-gray-400">Founder & Platform Engineer — Zim Barter / Chiredzi Trade</p>
                <p className="text-slate-600 dark:text-gray-400">Chiredzi, Masvingo Province, Zimbabwe</p>
                <p className="pt-1">
                  Email: <a href="mailto:princeashumba@gmail.com" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">princeashumba@gmail.com</a>
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
