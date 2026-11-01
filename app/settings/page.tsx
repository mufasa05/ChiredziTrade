'use client';

import React, { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import AuthGate from '@/components/AuthGate';
import { useAuth } from '@/context/AuthContext';
import {
  Settings as SettingsIcon,
  User,
  ShieldCheck,
  CreditCard,
  Bell,
  Scale,
  CheckCircle2,
  Lock,
  Save,
  RefreshCw,
  Building,
  MapPin,
  Phone,
  Mail,
  AlertCircle,
  FileCheck,
  ChevronRight,
  UploadCloud,
  BadgeCheck
} from 'lucide-react';

export default function SettingsPage() {
  const { user, saveProfile } = useAuth();

  const [activeSection, setActiveSection] = useState<'profile' | 'trade' | 'verification' | 'payouts' | 'notifications'>('profile');

  // Form states
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [email, setEmail] = useState(user?.email || '');
  const [locationArea, setLocationArea] = useState(user?.locationArea || 'Harare CBD');
  const [bio, setBio] = useState('');

  // Trade preferences
  const [defaultCurrency, setDefaultCurrency] = useState<'USD' | 'ZAR' | 'ZWG'>('USD');
  const [acceptBarterAuto, setAcceptBarterAuto] = useState(true);
  const [defaultBarterTerms, setDefaultBarterTerms] = useState(
    'Accepting Grade A grain, solar power equipment, fuel vouchers, or livestock swaps with top-up.'
  );
  const [allowInstantMessaging, setAllowInstantMessaging] = useState(true);

  // Payout details
  const [ecocashNumber, setEcocashNumber] = useState('0783237918');
  const [innbucksNumber, setInnbucksNumber] = useState('0783237918');
  const [bankName, setBankName] = useState('Stanbic Bank Zimbabwe');
  const [accountNumber, setAccountNumber] = useState('9140003482190');

  // Notifications
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [emailDigest, setEmailDigest] = useState(false);
  const [priceAlerts, setPriceAlerts] = useState(true);

  // Status
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  // Sync user if changes
  useEffect(() => {
    if (user) {
      if (user.fullName) setFullName(user.fullName);
      if (user.phoneNumber) setPhoneNumber(user.phoneNumber);
      if (user.email) setEmail(user.email);
      if (user.locationArea) setLocationArea(user.locationArea);
    }
  }, [user]);

  // Load custom stored preferences
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('zimbarter_settings');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.defaultCurrency) setDefaultCurrency(parsed.defaultCurrency);
          if (parsed.defaultBarterTerms) setDefaultBarterTerms(parsed.defaultBarterTerms);
          if (parsed.bio) setBio(parsed.bio);
          if (parsed.ecocashNumber) setEcocashNumber(parsed.ecocashNumber);
          if (parsed.innbucksNumber) setInnbucksNumber(parsed.innbucksNumber);
          if (parsed.bankName) setBankName(parsed.bankName);
          if (parsed.accountNumber) setAccountNumber(parsed.accountNumber);
        }
      } catch (e) {
        console.warn('Failed to load settings:', e);
      }
    }
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      if (saveProfile) {
        await saveProfile({
          fullName,
          phoneNumber,
          locationArea,
        });
      }

      if (typeof window !== 'undefined') {
        const settingsToStore = {
          fullName,
          phoneNumber,
          email,
          locationArea,
          bio,
          defaultCurrency,
          acceptBarterAuto,
          defaultBarterTerms,
          allowInstantMessaging,
          ecocashNumber,
          innbucksNumber,
          bankName,
          accountNumber,
          whatsappAlerts,
          emailDigest,
          priceAlerts,
        };
        localStorage.setItem('zimbarter_settings', JSON.stringify(settingsToStore));
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const navItems = [
    { id: 'profile', label: 'Profile & Contact', icon: User },
    { id: 'trade', label: 'Barter & Currency', icon: Scale },
    { id: 'verification', label: 'Artisan & KYC Verification', icon: ShieldCheck },
    { id: 'payouts', label: 'Payout Methods', icon: CreditCard },
    { id: 'notifications', label: 'Notifications & Alerts', icon: Bell },
  ] as const;

  return (
    <AppShell activeNav="Settings">
      <AuthGate
        featureName="Account Settings"
        description="Manage your KYC verification, payout accounts, and trader notification preferences. Sign in to customize your profile."
        icon={SettingsIcon}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 w-full space-y-6">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#062A22] p-6 rounded-3xl border border-slate-200 dark:border-[#0e4337] shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#059669] mb-1">
              <SettingsIcon className="w-4 h-4" />
              <span>ACCOUNT CONFIGURATION</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Settings & Preferences
            </h1>
            <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
              Configure your international trade parameters, settlement wallets, and verification badges.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {savedSuccess && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800/40 animate-fade-in">
                <CheckCircle2 className="w-4 h-4" />
                Preferences Saved
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#059669] hover:bg-[#047857] text-white text-sm font-semibold rounded-2xl shadow-sm transition disabled:opacity-50"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Changes</span>
            </button>
          </div>
        </div>

        {/* Main Layout: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Navigation Sidebar */}
          <div className="lg:col-span-1 space-y-2">
            <div className="bg-white dark:bg-[#062A22] rounded-3xl border border-slate-200 dark:border-[#0e4337] p-3 shadow-sm space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition ${
                      active
                        ? 'bg-[#059669] text-white shadow-sm'
                        : 'text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-[#0c1813]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>

            {/* Verification quick status */}
            <div className="bg-emerald-50/60 dark:bg-[#062A22] border border-emerald-200/80 dark:border-[#0e4337] rounded-3xl p-4 text-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-bold">
                <BadgeCheck className="w-4 h-4" />
                <span>Verified Artisan Status</span>
              </div>
              <p className="text-slate-600 dark:text-gray-400 leading-relaxed text-[11px]">
                Your account holds Level 2 Verified Trader credentials with escrow clearance authorization.
              </p>
            </div>
          </div>

          {/* Form Content Area */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSave} className="space-y-6">
              {/* Profile & Contact Section */}
              {activeSection === 'profile' && (
                <div className="bg-white dark:bg-[#062A22] rounded-3xl border border-slate-200 dark:border-[#0e4337] p-6 shadow-sm space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Profile Details</h2>
                    <p className="text-xs text-slate-500 dark:text-gray-400">
                      This information appears on your listings and counterparty trade proposals.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-gray-300">
                        Full Legal Name / Business
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#0c1813] border border-slate-200 dark:border-[#0e4337] rounded-2xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900 dark:text-white"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-gray-300">
                        WhatsApp Trade Contact
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#0c1813] border border-slate-200 dark:border-[#0e4337] rounded-2xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900 dark:text-white"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-gray-300">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#0c1813] border border-slate-200 dark:border-[#0e4337] rounded-2xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-gray-300">
                        Primary Trade Hub / Location
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select
                          value={locationArea}
                          onChange={(e) => setLocationArea(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#0c1813] border border-slate-200 dark:border-[#0e4337] rounded-2xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900 dark:text-white"
                        >
                          <option value="Chiredzi Town / Masvingo">Chiredzi Town / Masvingo</option>
                          <option value="Chiredzi / Triangle">Chiredzi / Triangle</option>
                          <option value="Hippo Valley">Hippo Valley</option>
                          <option value="Harare CBD">Harare CBD</option>
                          <option value="Harare - Borrowdale">Harare - Borrowdale</option>
                          <option value="Harare - Mbare / Machipisa">Harare - Mbare / Machipisa</option>
                          <option value="Bulawayo CBD">Bulawayo CBD</option>
                          <option value="Mutare">Mutare</option>
                          <option value="Gweru">Gweru</option>
                          <option value="Masvingo">Masvingo</option>
                          <option value="Victoria Falls">Victoria Falls</option>
                          <option value="Beitbridge">Beitbridge</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-gray-300">
                      Trader Biography & Business Summary
                    </label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full p-3 bg-slate-50 dark:bg-[#0c1813] border border-slate-200 dark:border-[#0e4337] rounded-2xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900 dark:text-white"
                      placeholder="Brief summary of what you produce, trade, or repair..."
                    />
                  </div>
                </div>
              )}

              {/* Barter & Valuation Section */}
              {activeSection === 'trade' && (
                <div className="bg-white dark:bg-[#062A22] rounded-3xl border border-slate-200 dark:border-[#0e4337] p-6 shadow-sm space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Trade & Barter Preferences</h2>
                    <p className="text-xs text-slate-500 dark:text-gray-400">
                      Define how offers are quoted and terms applied across your catalog.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-gray-300">
                        Default Valuation Currency
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {(['USD', 'ZAR', 'ZWG'] as const).map((curr) => (
                          <button
                            type="button"
                            key={curr}
                            onClick={() => setDefaultCurrency(curr)}
                            className={`p-3 rounded-2xl border text-center text-xs font-bold transition ${
                              defaultCurrency === curr
                                ? 'border-[#059669] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                                : 'border-slate-200 dark:border-[#0e4337] text-slate-600 dark:text-gray-300'
                            }`}
                          >
                            {curr}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-gray-300">
                        Default Barter Terms & Desired Commodities
                      </label>
                      <textarea
                        rows={3}
                        value={defaultBarterTerms}
                        onChange={(e) => setDefaultBarterTerms(e.target.value)}
                        className="w-full p-3 bg-slate-50 dark:bg-[#0c1813] border border-slate-200 dark:border-[#0e4337] rounded-2xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900 dark:text-white"
                        placeholder="What commodities or equipment do you usually accept in exchange?"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#0c1813] rounded-2xl border border-slate-200 dark:border-[#0e4337]">
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          Accept Barter Proposals by Default
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-gray-400">
                          Automatically mark new listings as open to non-cash barter proposals.
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={acceptBarterAuto}
                        onChange={(e) => setAcceptBarterAuto(e.target.checked)}
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Artisan & KYC Verification */}
              {activeSection === 'verification' && (
                <div className="bg-white dark:bg-[#062A22] rounded-3xl border border-slate-200 dark:border-[#0e4337] p-6 shadow-sm space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      Artisan & Trader Verification
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-gray-400">
                      Higher verification tiers unlock higher transaction limits and trusted badge placement.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl border border-emerald-500/40 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                          Level 1
                        </span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">Phone & WhatsApp</h4>
                      <p className="text-[11px] text-slate-500 dark:text-gray-400">
                        Verified via OTP confirmation.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl border border-emerald-500/40 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                          Level 2
                        </span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">Artisan Credential</h4>
                      <p className="text-[11px] text-slate-500 dark:text-gray-400">
                        Trade licence and local hub reference cleared.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-200 dark:border-[#0e4337] bg-slate-50 dark:bg-[#0c1813] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Level 3 (Enterprise)
                        </span>
                        <Lock className="w-4 h-4 text-slate-400" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">Corporate Escrow</h4>
                      <p className="text-[11px] text-slate-500 dark:text-gray-400">
                        Bulk agricultural warehouse receipt bonding.
                      </p>
                    </div>
                  </div>

                  <div className="border border-dashed border-slate-300 dark:border-[#0e4337] rounded-2xl p-6 text-center space-y-3">
                    <UploadCloud className="w-8 h-8 text-slate-400 mx-auto" />
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        Upload ID, Agritex Permit, or Artisan Certificate
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-gray-400">
                        PDF, PNG, JPG up to 10MB
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => alert('Verification document upload portal is active for approved traders.')}
                      className="px-4 py-2 bg-slate-100 dark:bg-[#0c1813] hover:bg-slate-200 dark:hover:bg-[#0e4337] text-slate-700 dark:text-gray-200 text-xs font-semibold rounded-xl border border-slate-200 dark:border-[#0e4337] transition"
                    >
                      Select Document
                    </button>
                  </div>
                </div>
              )}

              {/* Payout Methods Section */}
              {activeSection === 'payouts' && (
                <div className="bg-white dark:bg-[#062A22] rounded-3xl border border-slate-200 dark:border-[#0e4337] p-6 shadow-sm space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Payout & Settlement Methods</h2>
                    <p className="text-xs text-slate-500 dark:text-gray-400">
                      Destination accounts when receiving escrow releases or cash settlements.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-gray-300">
                        EcoCash Mobile Number
                      </label>
                      <input
                        type="text"
                        value={ecocashNumber}
                        onChange={(e) => setEcocashNumber(e.target.value)}
                        className="w-full p-3 bg-slate-50 dark:bg-[#0c1813] border border-slate-200 dark:border-[#0e4337] rounded-2xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-gray-300">
                        InnBucks Account Number
                      </label>
                      <input
                        type="text"
                        value={innbucksNumber}
                        onChange={(e) => setInnbucksNumber(e.target.value)}
                        className="w-full p-3 bg-slate-50 dark:bg-[#0c1813] border border-slate-200 dark:border-[#0e4337] rounded-2xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-gray-300">
                        Commercial Bank Name
                      </label>
                      <input
                        type="text"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="w-full p-3 bg-slate-50 dark:bg-[#0c1813] border border-slate-200 dark:border-[#0e4337] rounded-2xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-gray-300">
                        Account / Nostro Number
                      </label>
                      <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        className="w-full p-3 bg-slate-50 dark:bg-[#0c1813] border border-slate-200 dark:border-[#0e4337] rounded-2xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Section */}
              {activeSection === 'notifications' && (
                <div className="bg-white dark:bg-[#062A22] rounded-3xl border border-slate-200 dark:border-[#0e4337] p-6 shadow-sm space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Notification Channels</h2>
                    <p className="text-xs text-slate-500 dark:text-gray-400">
                      Stay updated on trade proposals, buyer counter-offers, and escrow releases.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#0c1813] rounded-2xl border border-slate-200 dark:border-[#0e4337]">
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          WhatsApp Trade Dispatch Alerts
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-gray-400">
                          Receive instant WhatsApp messages when a counterpart makes a barter offer.
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={whatsappAlerts}
                        onChange={(e) => setWhatsappAlerts(e.target.checked)}
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#0c1813] rounded-2xl border border-slate-200 dark:border-[#0e4337]">
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          Watchlist Price & Barter Alerts
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-gray-400">
                          Get notified when items in your favourites change terms or receive discounts.
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={priceAlerts}
                        onChange={(e) => setPriceAlerts(e.target.checked)}
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#0c1813] rounded-2xl border border-slate-200 dark:border-[#0e4337]">
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          Weekly Lowveld Market Summary Email
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-gray-400">
                          Digest of commodity rates (maize, cattle, fuel, fertilizer).
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={emailDigest}
                        onChange={(e) => setEmailDigest(e.target.checked)}
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom save bar */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#059669] hover:bg-[#047857] text-white text-sm font-semibold rounded-2xl shadow-sm transition disabled:opacity-50"
                >
                  {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save Configuration</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthGate>
  </AppShell>
);
}

