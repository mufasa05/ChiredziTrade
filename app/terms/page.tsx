import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { 
  Scale, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowLeft, 
  Mail, 
  ShieldAlert, 
  Coins, 
  FileCheck, 
  HelpCircle,
  Truck,
  Building,
  Gavel
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service & Trade Disclaimer | Zim Barter & Chiredzi Trade',
  description: 'Legally binding terms of service, peer-to-peer barter disclaimer, livestock clearance rules, multi-currency terms, and limitation of liability for Zim Barter Zimbabwe.',
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
              <span>Legally Binding Agreement</span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
              Terms of Service &amp; Trade Disclaimer
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 mt-2">
              Last updated: October 2026 • Governed by the Laws of the Republic of Zimbabwe
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs sm:text-sm text-amber-900 dark:text-amber-200 space-y-2 leading-relaxed">
            <div className="flex items-center gap-2 font-bold text-amber-700 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>IMPORTANT NOTICE — PLEASE READ CAREFULLY BEFORE USING THIS PLATFORM</span>
            </div>
            <p>
              Zim Barter is a <strong>free, open communications noticeboard and bilateral matching directory</strong>. We do not inspect goods, do not verify livestock ownership, do not hold escrow funds, and are not party to any transaction. All trades and cash exchanges are strictly at your own risk under the principle of <em>Caveat Emptor</em> (Buyer/Trader Beware).
            </p>
          </div>

          <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-700 dark:text-gray-300 space-y-7 leading-relaxed">
            
            {/* 1. Acceptance */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Gavel className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                1. Acceptance of Terms &amp; Capacity to Contract
              </h2>
              <p>
                By accessing, browsing, registering via Google Sign-In, or posting listings on Zim Barter (<span className="font-mono text-emerald-600 dark:text-emerald-400">chiredzi-trade.vercel.app</span>), you agree to be legally bound by these Terms of Service.
              </p>
              <p>
                You represent and warrant that you are at least <strong>18 years of age</strong> and possess the full legal power and authority to enter into legally enforceable contracts under Zimbabwean law.
              </p>
            </section>

            {/* 2. Platform Intermediary Role */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                2. Platform Role: Communications Intermediary Only
              </h2>
              <p>
                Zim Barter functions exclusively as a technological venue and matching directory that connects independent Zimbabwean farmers, ranchers, traders, artisans, and consumers.
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>No Merchant of Record:</strong> Zim Barter does not own, store, possess, inspect, ship, or sell any items listed on the website.</li>
                <li><strong>No Financial Institution / Escrow:</strong> We do not accept deposits, process card payments, hold escrow funds, or act as an exchange bureau.</li>
                <li><strong>No Employment Relationship:</strong> Independent artisans, builders, welders, and haulage drivers listed on the platform are not employees, agents, or contractors of Zim Barter.</li>
                <li><strong>No Warranty of Counterparty:</strong> We do not guarantee the honesty, solvency, identity, or delivery capability of any platform user.</li>
              </ul>
            </section>

            {/* 3. Livestock & Cattle Regulations */}
            <section className="space-y-3 p-4 rounded-2xl bg-slate-100 dark:bg-lowveld-950/70 border border-slate-200 dark:border-lowveld-800">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                3. Mandatory Livestock Regulations &amp; Anti-Stock Theft Compliance
              </h2>
              <p>
                Given the vital importance of cattle, goats, and livestock across Masvingo, Chiredzi, Matabeleland, and nationwide Zimbabwe:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>Sellers&apos; Warranty:</strong> Any user listing livestock represents and warrants that all animals are legally owned, properly branded, free from disease or quarantine restrictions, and possess valid <strong>Zimbabwe Republic Police (ZRP) Anti-Stock Theft clearance certificates</strong> and <strong>Department of Veterinary Services animal movement permits</strong>.
                </li>
                <li>
                  <strong>Buyer Due Diligence:</strong> Buyers and barter counterparties must physically verify brand registrations, ear tags, and police clearances prior to loading or paying for livestock.
                </li>
                <li>
                  <strong>Absolute Disclaimer:</strong> Zim Barter assumes <strong>zero legal or financial liability</strong> for stolen, quarantined, diseased, or unauthorized livestock. Any verified listings of stolen stock will be handed directly to the ZRP Anti-Stock Theft Unit.
                </li>
              </ul>
            </section>

            {/* 4. Multi-Currency & Barter Valuation */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Coins className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                4. Multi-Currency (USD, ZAR, ZWG/ZiG) &amp; Barter Valuation
              </h2>
              <p>
                Transactions may be settled in United States Dollars (USD), South African Rand (ZAR), Zimbabwe Gold (ZWG / ZiG), or bilateral commodity swaps (barter):
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>Autonomous Pricing:</strong> All exchange rates, barter ratios (e.g., grain bags swapped for cattle or solar hardware), and payment modalities (cash, EcoCash, Mukuru, Innbucks) are independently decided between trading parties.
                </li>
                <li>
                  <strong>No Currency Guarantees:</strong> Zim Barter does not set currency exchange rates, does not guarantee currency stability, and bears no responsibility for exchange rate fluctuations.
                </li>
                <li>
                  <strong>Finality of Barter Swaps:</strong> Once two parties inspect, agree upon, and exchange physical goods or services, the barter swap is legally binding between those parties. Zim Barter does not entertain complaints regarding post-trade regret or unequal valuations.
                </li>
              </ul>
            </section>

            {/* 5. Physical Inspection & Safety Advisory */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                5. Mandatory Physical Inspection &amp; Safe Meeting Protocols
              </h2>
              <p>
                To avoid fraud, counterfeit goods, or misrepresentation:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>No Advance Payments:</strong> Never send advance mobile money deposits or cash before seeing and physically verifying the item in person.</li>
                <li><strong>Safe Public Locations:</strong> Always conduct in-person exchanges and cash handovers in broad daylight in public, populated locations (such as near a police station, busy bank branch, or commercial shopping center).</li>
                <li><strong>Bring an Escort:</strong> Especially when evaluating high-value machinery, vehicles, solar arrays, or livestock.</li>
              </ul>
            </section>

            {/* 6. Prohibited Listings */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                6. Strictly Prohibited Listings &amp; Activities
              </h2>
              <p>Users are expressly forbidden from listing, proposing, or swapping:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Stolen property or items without clear title ownership.</li>
                <li>Counterfeit banknotes or currency manipulation schemes.</li>
                <li>Illicit mineral trade (unlicensed raw gold panning contraband, uncertified rough diamonds).</li>
                <li>Endangered wildlife, poached game meat, or ivory products.</li>
                <li>Prescription narcotics, unregistered veterinary pharmaceuticals, or toxic chemicals.</li>
                <li>Unlicensed firearms, ammunition, or offensive weapons.</li>
              </ul>
              <p className="pt-1 text-xs text-slate-500 dark:text-gray-400">
                Zim Barter reserves the unilateral right to delete any listing and permanently block any user violating these terms without prior notice.
              </p>
            </section>

            {/* 7. AS-IS Disclaimer */}
            <section className="space-y-3 p-4 rounded-2xl bg-slate-100 dark:bg-lowveld-950/70 border border-slate-200 dark:border-lowveld-800">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                7. Comprehensive &quot;AS IS, WHERE IS&quot; Warranty Disclaimer
              </h2>
              <p className="font-semibold uppercase text-xs tracking-wider text-slate-900 dark:text-white">
                ALL SERVICES, SOFTWARE, AND COMMUNITY LISTINGS ARE PROVIDED STRICTLY ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS WITH ALL FAULTS.
              </p>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED UNDER APPLICABLE ZIMBABWEAN LAW, ZIM BARTER AND ITS FOUNDER EXPRESSLY DISCLAIM ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING WITHOUT LIMITATION THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, ACCURACY, AND NON-INFRINGEMENT.
              </p>
            </section>

            {/* 8. Limitation of Liability */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                8. Limitation of Liability &amp; Maximum Damages Cap
              </h2>
              <p>
                UNDER NO CIRCUMSTANCES SHALL ZIM BARTER, ITS FOUNDER PRINCE A. SHUMBA, OPERATORS, OR DEVELOPERS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES (INCLUDING LOSS OF PROFITS, REVENUE, LIVESTOCK, CROPS, DATA, OR GOODWILL) ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE PLATFORM OR ANY TRANSACTION CONDUCTED THROUGH IT.
              </p>
              <p>
                IN ALL CASES, THE TOTAL AGGREGATE LIABILITY OF ZIM BARTER AND ITS OPERATORS FOR ANY CLAIMS UNDER THESE TERMS SHALL BE STRICTLY LIMITED TO <strong>USD $10.00</strong> (TEN UNITED STATES DOLLARS) OR THE TOTAL AMOUNT PAID BY YOU TO THE PLATFORM IN THE PRECEDING THREE MONTHS, WHICHEVER IS GREATER.
              </p>
            </section>

            {/* 9. Platform Facilitation Fees & Technology Charges */}
            <section className="space-y-3 p-4 rounded-2xl bg-slate-100 dark:bg-lowveld-950/70 border border-slate-200 dark:border-lowveld-800">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Coins className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                9. Platform Facilitation Fees &amp; Technology Charges (5%)
              </h2>
              <p>
                To maintain high-availability server infrastructure, anti-fraud algorithms, AI vision appraisal, and direct WhatsApp trade integration across Zimbabwe:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                <li>
                  <strong>Buyer Facilitation Fee:</strong> Zim Barter applies a transparent <strong>5% Platform Facilitation &amp; Verification Fee</strong> (subject to a minimum floor of USD $0.50 and a maximum cap of USD $20.00) to order transactions initiated on the platform.
                </li>
                <li>
                  <strong>Seller Retains 100%:</strong> Sellers receive 100% of their listed item price, ensuring farmers, ranchers, and artisans retain full earnings without commission deductions from their asking price.
                </li>
                <li>
                  <strong>Buyer Deliverables:</strong> In exchange for the facilitation fee, the buyer receives: (1) a unique <strong>Verified Order Reference</strong> recorded in the ZimBarter trade ledger, (2) an immediate <strong>Direct Seller Connection</strong> (via pre-populated WhatsApp messaging and direct telephony), and (3) an official itemized <strong>Trade Receipt</strong> displaying pickup hubs and breakdown for physical handover verification.
                </li>
                <li>
                  <strong>Non-Custodial Technology Service:</strong> Platform facilitation fees represent compensation for software access, verified introductions, and digital communications services under the Consumer Protection Act (2019). Zim Barter does not operate as an escrow bank, deposit-taking institution, or custodial financial entity.
                </li>
              </ul>
            </section>

            {/* 10. Indemnification */}
            <section className="space-y-3 p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/30">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                10. Indemnification &amp; Hold Harmless Clause
              </h2>
              <p>
                You agree to defend, indemnify, and hold harmless Zim Barter, its founder Prince A. Shumba, and any platform contributors from and against any claims, liabilities, damages, losses, costs, and expenses (including reasonable legal and attorneys&apos; fees) arising out of or in any way connected with:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                <li>Your access to or use of the marketplace and associated WhatsApp links.</li>
                <li>Any listings, offers, content, or representations authored by you.</li>
                <li>Any transaction, barter agreement, delivery dispute, or failure to perform between you and another platform user.</li>
                <li>Your breach of any applicable Zimbabwean laws, veterinary regulations, or third-party rights.</li>
              </ul>
            </section>

            {/* 11. Governing Law */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                11. Governing Law &amp; Dispute Resolution
              </h2>
              <p>
                These Terms of Service and any dispute arising from or related to the platform shall be governed exclusively by and construed in accordance with the <strong>laws of the Republic of Zimbabwe</strong>, without regard to conflict of law principles.
              </p>
              <p>
                Any legal action or proceeding arising under these terms shall be brought exclusively in the courts of competent jurisdiction in Zimbabwe, and all parties hereby consent to personal jurisdiction therein.
              </p>
            </section>

            {/* 12. Contact */}
            <section className="space-y-3 pt-4 border-t border-slate-200 dark:border-lowveld-800">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                12. Contact &amp; Legal Notices
              </h2>
              <p>
                For legal notices, complaints, or inquiries regarding these Terms of Service:
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
    </div>
  );
}
