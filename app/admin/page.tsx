'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { 
  ShieldCheck, 
  Users, 
  Package, 
  RefreshCw, 
  ShoppingBag, 
  Trash2, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  Search,
  Eye,
  EyeOff,
  Archive,
  Star,
  Activity,
  DollarSign,
  ArrowRightLeft,
  CreditCard,
  ExternalLink,
  Printer,
  Download,
  Check,
  X,
  Clock,
  Phone,
  TrendingUp,
  FileText,
  BadgePercent
} from 'lucide-react';
import { Listing, BarterProposal, TradeOrder, AdminPlatformStats, isUserVerified } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminPage() {
  const { t } = useLanguage();
  const [adminPin, setAdminPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'listings' | 'users' | 'proposals' | 'orders'>('listings');

  // Data states
  const [stats, setStats] = useState<AdminPlatformStats | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [proposals, setProposals] = useState<BarterProposal[]>([]);
  const [orders, setOrders] = useState<TradeOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [tradeTypeFilter, setTradeTypeFilter] = useState<'all' | 'orders' | 'barter'>('all');
  const [tradeStatusFilter, setTradeStatusFilter] = useState<string>('all');
  const [tradeSearchTerm, setTradeSearchTerm] = useState('');

  const fetchAdminData = async (pin: string) => {
    setLoading(true);
    setAuthError('');
    try {
      const res = await fetch(`/api/admin?pin=${encodeURIComponent(pin)}`);
      const data = await res.json();
      if (data.success) {
        setIsAuthorized(true);
        setStats(data.stats);
        setListings(data.listings);
        setUsers(data.users);
        setProposals(data.proposals);
        setOrders(data.orders);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('zimbarter_admin_pin');
        }
      } else {
        setAuthError(data.error || 'Invalid Admin Security PIN');
      }
    } catch (err) {
      setAuthError('Failed to connect to Admin Command Centre API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('zimbarter_admin_pin');
    }
    setAdminPin('');
    setIsAuthorized(false);
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPin.trim()) return;
    fetchAdminData(adminPin.trim());
  };

  const handleExecuteAction = async (action: string, id: string, extraData?: any) => {
    if (!confirm(`Are you sure you want to perform this action (${action})?`)) return;

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-pin': adminPin,
        },
        body: JSON.stringify({ action, id, ...extraData }),
      });
      const data = await res.json();
      if (data.success) {
        fetchAdminData(adminPin);
      } else {
        alert(`Admin action failed: ${data.error}`);
      }
    } catch (e) {
      alert('Error executing admin action');
    }
  };

  // Filter listings based on search term
  const filteredListings = listings.filter(
    (l) =>
      l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.locationArea.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter users based on search term
  const filteredUsers = users.filter(
    (u) =>
      (u.fullName || '').toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      (u.phoneNumber || '').toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      (u.locationArea || '').toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  const formatWhatsAppUrl = (phone?: string) => {
    if (!phone) return '#';
    let clean = phone.replace(/\D/g, '');
    if (clean.startsWith('0')) clean = '263' + clean.slice(1);
    if (!clean.startsWith('263')) clean = '263' + clean;
    return `https://wa.me/${clean}`;
  };

  // Filter cash orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = tradeStatusFilter === 'all' || o.status === tradeStatusFilter;
    const term = tradeSearchTerm.toLowerCase();
    const matchesSearch =
      !term ||
      (o.buyerName || '').toLowerCase().includes(term) ||
      (o.buyerPhone || '').toLowerCase().includes(term) ||
      (o.sellerName || '').toLowerCase().includes(term) ||
      (o.sellerPhone || '').toLowerCase().includes(term) ||
      (o.listingTitle || '').toLowerCase().includes(term) ||
      (o.transactionRef || '').toLowerCase().includes(term) ||
      (o.pickupLocation || '').toLowerCase().includes(term);
    return matchesStatus && matchesSearch;
  });

  // Filter barter proposals
  const filteredProposals = proposals.filter((p) => {
    const matchesStatus = tradeStatusFilter === 'all' || p.status === tradeStatusFilter;
    const term = tradeSearchTerm.toLowerCase();
    const matchesSearch =
      !term ||
      (p.proposerName || '').toLowerCase().includes(term) ||
      (p.proposerPhone || '').toLowerCase().includes(term) ||
      (p.sellerName || '').toLowerCase().includes(term) ||
      (p.sellerPhone || '').toLowerCase().includes(term) ||
      (p.offeredItemTitle || '').toLowerCase().includes(term) ||
      (p.listingTitle || '').toLowerCase().includes(term) ||
      (p.proposerLocation || '').toLowerCase().includes(term);
    return matchesStatus && matchesSearch;
  });

  const handleDownloadAuditReport = () => {
    const grossVolume = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    const platformRevenue = orders.reduce((sum, o) => sum + (o.platformFee ?? (o.totalPrice || 0) * 0.05), 0);
    const sellerDisbursals = grossVolume - platformRevenue;
    const dateStr = new Date().toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>ZimBarter Official Financial Audit &amp; Settlement Ledger</title>
  <style>
    @page { size: A4 landscape; margin: 12mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; margin: 0; padding: 25px; color: #0f172a; background: #fff; line-height: 1.4; }
    .container { position: relative; max-width: 950px; margin: 0 auto; }
    .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-12deg); width: 450px; height: 450px; opacity: 0.035; pointer-events: none; z-index: 0; }
    .content { position: relative; z-index: 1; }
    .header { text-align: center; border-bottom: 2px solid #059669; padding-bottom: 16px; margin-bottom: 20px; }
    .header h1 { margin: 0 0 4px; font-size: 24px; color: #062A22; }
    .header h1 span { color: #D97706; }
    .header p { margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: 700; color: #059669; }
    .metrics { display: flex; gap: 12px; margin-bottom: 20px; }
    .metric-card { flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; }
    .metric-title { font-size: 10px; font-weight: 700; text-transform: uppercase; color: #64748b; margin-bottom: 4px; }
    .metric-val { font-size: 18px; font-weight: 900; color: #0f172a; font-family: ui-monospace, monospace; }
    table { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 20px; }
    th { background: #f1f5f9; color: #475569; font-weight: 800; text-transform: uppercase; font-size: 9px; letter-spacing: 0.5px; padding: 8px 10px; text-align: left; }
    td { padding: 9px 10px; border-top: 1px solid #e2e8f0; color: #1e293b; }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .mono { font-family: ui-monospace, monospace; }
    .footer { border-top: 1px solid #cbd5e1; padding-top: 12px; text-align: center; font-size: 10px; color: #64748b; font-family: ui-monospace, monospace; }
    .no-print { display: flex; justify-content: flex-end; gap: 8px; margin-bottom: 12px; }
    .btn { padding: 6px 12px; border-radius: 6px; background: #059669; color: #fff; font-size: 11px; font-weight: 700; border: none; cursor: pointer; }
    @media print { .no-print { display: none !important; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="no-print">
      <button class="btn" onclick="window.print()">Print Document</button>
    </div>

    <svg class="watermark" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="28" stroke="#10B981" stroke-width="2" stroke-dasharray="3 3" />
      <path d="M 20 22 C 26 15 38 15 44 20 L 46 16 L 47 25 L 38 25 L 41 22 C 36 18 27 18 22 23 Z" fill="#10B981" />
      <path d="M 44 42 C 38 49 26 49 20 44 L 18 48 L 17 39 L 26 39 L 23 42 C 28 46 37 46 42 41 Z" fill="#F5C542" />
      <polygon points="32,23 37,32 32,41 27,32" fill="#10B981" />
      <circle cx="32" cy="32" r="3" fill="#F5C542" />
    </svg>

    <div class="content">
      <div class="header">
        <h1>Zim<span>Barter</span></h1>
        <p>Sovereign Trade Network &bull; Financial Audit &amp; Settlement Ledger</p>
        <div style="font-size: 11px; color: #64748b; margin-top: 4px; font-family: ui-monospace, monospace;">Audit Extraction Date: ${dateStr}</div>
      </div>

      <div class="metrics">
        <div class="metric-card">
          <div class="metric-title">Gross Volume Cleared</div>
          <div class="metric-val" style="color: #059669;">$${grossVolume.toFixed(2)} USD</div>
        </div>
        <div class="metric-card">
          <div class="metric-title">Disbursed to Sellers</div>
          <div class="metric-val" style="color: #0284c7;">$${sellerDisbursals.toFixed(2)} USD</div>
        </div>
        <div class="metric-card">
          <div class="metric-title">ZimBarter Revenue (5%)</div>
          <div class="metric-val" style="color: #d97706;">$${platformRevenue.toFixed(2)} USD</div>
        </div>
        <div class="metric-card">
          <div class="metric-title">Executed Transactions</div>
          <div class="metric-val">${orders.length} Records</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Order Ref &amp; Date</th>
            <th>Buyer</th>
            <th>Seller</th>
            <th>Item Particulars</th>
            <th class="text-right">Gross Paid</th>
            <th class="text-right">Seller Split</th>
            <th class="text-right">ZimBarter 5%</th>
            <th class="text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          ${orders.map((o) => {
            const gross = o.totalPrice || 0;
            const fee = o.platformFee ?? gross * 0.05;
            const sellerNet = gross - fee;
            return `<tr>
              <td class="mono"><strong>#${(o.id || '').slice(0, 8)}</strong><br/><span style="color:#64748b; font-size:9px;">${new Date(o.createdAt || Date.now()).toLocaleDateString()}</span></td>
              <td><strong>${o.buyerName || 'Buyer'}</strong><br/><span class="mono" style="color:#64748b;">${o.buyerPhone || ''}</span></td>
              <td><strong>${o.sellerName || 'Verified Seller'}</strong><br/><span class="mono" style="color:#64748b;">${o.sellerPhone || '+263 78 323 7918'}</span></td>
              <td>${o.listingTitle || 'Trade Item'} (x${o.quantity || 1})</td>
              <td class="text-right mono"><strong>$${gross.toFixed(2)}</strong></td>
              <td class="text-right mono" style="color:#0284c7;">$${sellerNet.toFixed(2)}</td>
              <td class="text-right mono" style="color:#059669;">$${fee.toFixed(2)}</td>
              <td class="text-center"><span style="font-weight:700; text-transform:uppercase; font-size:9px;">${o.status || 'CONFIRMED'}</span></td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>

      <div class="footer">
        <p>CONFIDENTIAL &bull; ZIMBARTER INTERNAL AUDIT TRAIL &bull; CERTIFIED ACCREDITATION</p>
        <p>Security Hash: ZB-FINANCIAL-AUDIT-${new Date().getFullYear()} &bull; Trade Protection Desk Hotline: +263 78 323 7918</p>
      </div>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ZimBarter_Financial_Audit_${new Date().toISOString().slice(0, 10)}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070d09] text-slate-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* PIN Authorization Screen */}
        {!isAuthorized ? (
          <div className="max-w-md mx-auto mt-12 p-8 rounded-3xl bg-white dark:bg-[#0f1913] border border-slate-200 dark:border-emerald-500/40 shadow-2xl text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h2 className="font-display font-black text-2xl text-slate-900 dark:text-white">
              Admin Command Centre
            </h2>
            <p className="text-xs text-slate-600 dark:text-gray-400 mt-1 mb-6">
              Enter Platform Administrator Master Password to manage users, moderation & platform activity across Zimbabwe.
            </p>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  autoComplete="new-password"
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-50 dark:bg-lowveld-950 border border-slate-300 dark:border-lowveld-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500 font-mono tracking-widest text-center"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-gray-300 transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center justify-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-lowveld-600 hover:from-emerald-400 hover:to-lowveld-500 text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-white" />
                <span>{loading ? 'Authenticating...' : 'Access Admin Console'}</span>
              </button>
            </form>
          </div>
        ) : (
          /* Authorized Admin Command Centre Dashboard */
          <div className="space-y-8 animate-fade-in">
            {/* Header Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-lowveld-800">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-2">
                  <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                  <span>Live Platform Command & Control</span>
                </div>
                <h1 className="font-display font-black text-3xl text-slate-900 dark:text-white">
                  Zim Barter Admin Console
                </h1>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchAdminData(adminPin)}
                  disabled={loading}
                  className="px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition-all border border-emerald-500/30 flex items-center gap-1.5"
                  title="Refresh live activity feed"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>{loading ? 'Refreshing...' : 'Refresh Live Data'}</span>
                </button>
                <button
                  onClick={() => {
                    setIsAuthorized(false);
                    setAdminPin('');
                    setShowPassword(false);
                    setStats(null);
                    setListings([]);
                    setUsers([]);
                    setProposals([]);
                    setOrders([]);
                    if (typeof window !== 'undefined') {
                      localStorage.removeItem('zimbarter_admin_pin');
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-lowveld-900 hover:bg-red-500/20 text-slate-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 text-xs font-bold transition-all border border-slate-300 dark:border-lowveld-800"
                >
                  Lock Admin Console
                </button>
              </div>
            </div>

            {/* KPI Metrics Cards */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-lowveld-950/80 border border-slate-200 dark:border-lowveld-800 shadow-sm">
                  <div className="flex items-center justify-between text-slate-500 dark:text-gray-400 mb-2">
                    <span className="text-xs font-semibold">Total Traders</span>
                    <Users className="w-4 h-4 text-emerald-500" />
                  </div>
                  <p className="font-display font-black text-2xl text-slate-900 dark:text-white">{stats.totalUsers}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-lowveld-950/80 border border-slate-200 dark:border-lowveld-800 shadow-sm">
                  <div className="flex items-center justify-between text-slate-500 dark:text-gray-400 mb-2">
                    <span className="text-xs font-semibold">Active Listings</span>
                    <Package className="w-4 h-4 text-emerald-500" />
                  </div>
                  <p className="font-display font-black text-2xl text-slate-900 dark:text-white">{stats.totalListings}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-lowveld-950/80 border border-slate-200 dark:border-lowveld-800 shadow-sm">
                  <div className="flex items-center justify-between text-slate-500 dark:text-gray-400 mb-2">
                    <span className="text-xs font-semibold">Gross Trade Volume</span>
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                  </div>
                  <p className="font-display font-black text-2xl text-emerald-600 dark:text-emerald-400">${stats.grossOrderVolumeUSD}</p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/30 border border-emerald-500/30 shadow-sm">
                  <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-300 mb-2">
                    <span className="text-xs font-bold">Platform Fee (Our Cut)</span>
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                  </div>
                  <p className="font-display font-black text-2xl text-emerald-700 dark:text-emerald-300">
                    ${stats.platformRevenueUSD ?? Number(((stats.grossOrderVolumeUSD || 0) * 0.05).toFixed(2))}
                  </p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-mono">5% Platform Commission</p>
                </div>

                <div className="p-4 rounded-2xl bg-blue-500/10 dark:bg-blue-950/30 border border-blue-500/30 shadow-sm col-span-2 md:col-span-1">
                  <div className="flex items-center justify-between text-blue-700 dark:text-blue-300 mb-2">
                    <span className="text-xs font-bold">Seller Disbursals</span>
                    <CreditCard className="w-4 h-4 text-blue-500" />
                  </div>
                  <p className="font-display font-black text-2xl text-blue-700 dark:text-blue-300">
                    ${stats.netSellerPayoutUSD ?? Number(((stats.grossOrderVolumeUSD || 0) * 0.95).toFixed(2))}
                  </p>
                  <p className="text-[10px] text-blue-600 dark:text-blue-400 mt-1 font-mono">Paid / Payable to Sellers</p>
                </div>
              </div>
            )}

            {/* Admin Console Tabs */}
            <div className="flex p-1.5 rounded-2xl bg-slate-200 dark:bg-lowveld-950 border border-slate-300 dark:border-lowveld-800 max-w-xl">
              <button
                onClick={() => setActiveTab('listings')}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'listings'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Listings Moderation</span>
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'users'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Registered Users ({users.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('proposals')}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'proposals'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <RefreshCw className="w-4 h-4" />
                <span>Trade Activity ({orders.length + proposals.length})</span>
              </button>
            </div>

            {/* TAB 1: LISTINGS MODERATION CONSOLE */}
            {activeTab === 'listings' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search listings by title, seller, or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-lowveld-950 border border-slate-300 dark:border-lowveld-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <span className="text-xs text-slate-500 dark:text-gray-400 font-mono">
                    {filteredListings.length} items listed
                  </span>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-lowveld-800 bg-white dark:bg-lowveld-950 shadow-sm">
                  <table className="w-full text-left text-xs text-slate-700 dark:text-gray-300">
                    <thead className="bg-slate-100 dark:bg-lowveld-900 border-b border-slate-200 dark:border-lowveld-800 text-slate-900 dark:text-white font-bold">
                      <tr>
                        <th className="p-3.5">Item Title & Seller</th>
                        <th className="p-3.5">Category</th>
                        <th className="p-3.5">Location</th>
                        <th className="p-3.5">Price / Terms</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Moderation Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-lowveld-800/60">
                      {filteredListings.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-500 dark:text-gray-400">
                            No listings found on the platform yet.
                          </td>
                        </tr>
                      ) : (
                        filteredListings.map((l) => (
                          <tr key={l.id} className="hover:bg-slate-50 dark:hover:bg-lowveld-900/50 transition-colors">
                            <td className="p-3.5">
                              <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{l.title}</p>
                              <p className="text-[11px] text-emerald-600 dark:text-emerald-400">{l.user.fullName} • {l.user.phoneNumber}</p>
                            </td>
                            <td className="p-3.5 uppercase text-[10px] font-mono">{l.category}</td>
                            <td className="p-3.5">{l.locationArea}</td>
                            <td className="p-3.5 font-bold">
                              {l.currency === 'BARTER' ? 'BARTER ONLY' : `${l.currency} ${l.price || 0}`}
                            </td>
                            <td className="p-3.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                l.status === 'active' ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-red-500/20 text-red-700 dark:text-red-300'
                              }`}>
                                {l.status}
                              </span>
                            </td>
                            <td className="p-3.5 text-right space-x-2">
                              <button
                                onClick={() => handleExecuteAction('update_listing_status', l.id, { status: l.status === 'active' ? 'archived' : 'active' })}
                                className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-lowveld-900 hover:bg-slate-300 dark:hover:bg-lowveld-800 text-xs font-semibold"
                              >
                                {l.status === 'active' ? 'Archive' : 'Activate'}
                              </button>
                              <button
                                onClick={() => handleExecuteAction('delete_listing', l.id)}
                                className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/30 text-xs font-bold"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: REGISTERED USERS CONSOLE */}
            {activeTab === 'users' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search users by name, email, WhatsApp, or location..."
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-lowveld-950 border border-slate-300 dark:border-lowveld-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <span className="text-xs text-slate-500 dark:text-gray-400 font-mono">
                    {filteredUsers.length} traders registered
                  </span>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-lowveld-800 bg-white dark:bg-lowveld-950 shadow-sm">
                  <table className="w-full text-left text-xs text-slate-700 dark:text-gray-300">
                    <thead className="bg-slate-100 dark:bg-lowveld-900 border-b border-slate-200 dark:border-lowveld-800 text-slate-900 dark:text-white font-bold">
                      <tr>
                        <th className="p-3.5">Trader / Business</th>
                        <th className="p-3.5">Email Address</th>
                        <th className="p-3.5">WhatsApp Phone</th>
                        <th className="p-3.5">Location Hub</th>
                        <th className="p-3.5">Rating & Trades</th>
                        <th className="p-3.5">Joined Date</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Moderation Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-lowveld-800/60">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="p-8 text-center text-slate-500 dark:text-gray-400">
                            No registered users found on the platform yet.
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((u) => (
                          <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-lowveld-900/50">
                            <td className="p-3.5">
                              <div className="flex items-center gap-2">
                                {u.avatarUrl ? (
                                  <img src={u.avatarUrl} alt="" className="w-6 h-6 rounded-full object-cover" />
                                ) : (
                                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold text-[10px]">
                                    {(u.fullName || 'T').charAt(0)}
                                  </div>
                                )}
                                <span className="font-bold text-slate-900 dark:text-white">{u.fullName}</span>
                              </div>
                            </td>
                            <td className="p-3.5 font-mono text-slate-600 dark:text-gray-300">
                              {u.email || <span className="text-slate-400 italic">No email</span>}
                            </td>
                            <td className="p-3.5 font-mono text-emerald-600 dark:text-emerald-400">
                              {u.phoneNumber}
                            </td>
                            <td className="p-3.5">{u.locationArea}</td>
                            <td className="p-3.5 font-medium">
                              {u.rating && u.rating > 0 ? (
                                <span className="text-amber-600 dark:text-amber-400 font-bold">⭐ {u.rating} ({u.tradeCount || 0} trades)</span>
                              ) : (
                                <span className="text-slate-400 dark:text-gray-500 italic text-xs">New Trader ({u.tradeCount || 0} trades)</span>
                              )}
                            </td>
                            <td className="p-3.5 text-slate-500 dark:text-gray-400 font-mono text-[11px]">
                              {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Active'}
                            </td>
                            <td className="p-3.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                isUserVerified(u) ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-slate-200 dark:bg-lowveld-900 text-slate-600 dark:text-gray-300'
                              }`}>
                                {isUserVerified(u) ? (Number(u.tradeCount || 0) >= 25 ? 'Verified (25+ Trades)' : 'Verified (Admin)') : 'Unverified'}
                              </span>
                            </td>
                            <td className="p-3.5 text-right space-x-2">
                              <button
                                onClick={() => handleExecuteAction('toggle_user_verification', u.id, { verifiedArtisan: !u.verifiedArtisan })}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                                  u.verifiedArtisan
                                    ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 hover:bg-amber-500/30'
                                    : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/30'
                                }`}
                              >
                                {u.verifiedArtisan ? 'Revoke Verification' : 'Verify Trader'}
                              </button>
                              <button
                                onClick={() => handleExecuteAction('delete_user', u.id)}
                                className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/30 text-xs font-bold inline-flex items-center gap-1 transition-colors"
                                title="Permanently delete user and their listings"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete Trader</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: UPGRADED TRADE ACTIVITY & FINANCIAL SETTLEMENT PLATFORM */}
            {activeTab === 'proposals' && (
              <div className="space-y-6">
                {/* Financial Command & Transparency Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-white dark:bg-lowveld-950 border border-slate-200 dark:border-lowveld-800 shadow-sm">
                    <div className="flex items-center justify-between text-slate-500 dark:text-gray-400 mb-1">
                      <span className="text-xs font-semibold">Gross Trade Volume (GMV)</span>
                      <DollarSign className="w-4 h-4 text-emerald-500" />
                    </div>
                    <p className="font-display font-black text-2xl text-slate-900 dark:text-white">
                      ${stats?.grossOrderVolumeUSD || 0}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-1">
                      Total customer payments across {orders.length} orders
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/30 shadow-sm">
                    <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-300 mb-1">
                      <span className="text-xs font-bold">ZimBarter Revenue (Our Cut)</span>
                      <BadgePercent className="w-4 h-4 text-emerald-500" />
                    </div>
                    <p className="font-display font-black text-2xl text-emerald-700 dark:text-emerald-300">
                      ${stats?.platformRevenueUSD ?? Number(((stats?.grossOrderVolumeUSD || 0) * 0.05).toFixed(2))}
                    </p>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                      5% platform escrow & trade protection fee
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-500/10 dark:bg-blue-950/40 border border-blue-500/30 shadow-sm">
                    <div className="flex items-center justify-between text-blue-700 dark:text-blue-300 mb-1">
                      <span className="text-xs font-bold">Net Seller Disbursals</span>
                      <CreditCard className="w-4 h-4 text-blue-500" />
                    </div>
                    <p className="font-display font-black text-2xl text-blue-700 dark:text-blue-300">
                      ${stats?.netSellerPayoutUSD ?? Number(((stats?.grossOrderVolumeUSD || 0) * 0.95).toFixed(2))}
                    </p>
                    <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-1 font-medium">
                      Disbursed or payable directly to sellers
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/30 shadow-sm">
                    <div className="flex items-center justify-between text-amber-700 dark:text-amber-300 mb-1">
                      <span className="text-xs font-bold">In Handover / Escrow</span>
                      <Clock className="w-4 h-4 text-amber-500" />
                    </div>
                    <p className="font-display font-black text-2xl text-amber-700 dark:text-amber-300">
                      ${stats?.pendingDisbursalsUSD ?? 0}
                    </p>
                    <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 font-medium">
                      Funds awaiting buyer collection verification
                    </p>
                  </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="p-4 rounded-2xl bg-white dark:bg-lowveld-950 border border-slate-200 dark:border-lowveld-800 shadow-sm space-y-3">
                  <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                    {/* Sub-Tab Filter: All vs Cash Orders vs Barter Swaps */}
                    <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-lowveld-900 border border-slate-200 dark:border-lowveld-800 text-xs">
                      <button
                        onClick={() => setTradeTypeFilter('all')}
                        className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                          tradeTypeFilter === 'all'
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        All Activity ({orders.length + proposals.length})
                      </button>
                      <button
                        onClick={() => setTradeTypeFilter('orders')}
                        className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                          tradeTypeFilter === 'orders'
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        Cash Orders & Transfers ({orders.length})
                      </button>
                      <button
                        onClick={() => setTradeTypeFilter('barter')}
                        className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                          tradeTypeFilter === 'barter'
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        Barter Swaps ({proposals.length})
                      </button>
                    </div>

                    {/* Status & Search Filters */}
                    <div className="flex flex-wrap items-center gap-2 flex-1 max-w-xl justify-end">
                      <select
                        value={tradeStatusFilter}
                        onChange={(e) => setTradeStatusFilter(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-lowveld-900 border border-slate-300 dark:border-lowveld-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-medium"
                      >
                        <option value="all">All Trade Statuses</option>
                        <option value="pending">Pending Handover / Escrow</option>
                        <option value="confirmed">Payment In Escrow</option>
                        <option value="delivered">Disbursed to Seller / Settled</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search Buyer, Seller, Item, WhatsApp, Ref..."
                          value={tradeSearchTerm}
                          onChange={(e) => setTradeSearchTerm(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-lowveld-900 border border-slate-300 dark:border-lowveld-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <button
                        onClick={handleDownloadAuditReport}
                        className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                        title="Download Official Watermarked Financial Audit File"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Export Audit (HTML)</span>
                      </button>

                      <button
                        onClick={() => window.print()}
                        className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-lowveld-900 hover:bg-slate-200 dark:hover:bg-lowveld-800 text-slate-700 dark:text-gray-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-300 dark:border-lowveld-800 transition-colors cursor-pointer"
                        title="Print Trade Activity Ledger for Records"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Print Ledger</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* CASH PURCHASE ORDERS & DISBURSEMENTS LEDGER */}
                {tradeTypeFilter !== 'barter' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-emerald-500" />
                        <span>Cash Purchase Orders & Escrow Settlements ({filteredOrders.length})</span>
                      </h3>
                      <span className="text-xs text-slate-500 dark:text-gray-400">
                        Exact financial split between Buyer, Seller & ZimBarter
                      </span>
                    </div>

                    {filteredOrders.length === 0 ? (
                      <div className="p-8 rounded-2xl bg-white dark:bg-lowveld-950 border border-slate-200 dark:border-lowveld-800 text-center text-xs text-slate-500 dark:text-gray-400">
                        No orders match the current filter criteria.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4">
                        {filteredOrders.map((o) => {
                          const grossPaid = Number(o.totalPrice || 0);
                          const feeAmount = Number((o.platformFee ?? grossPaid * 0.05).toFixed(2));
                          const netSeller = Number((o.sellerPayout ?? Math.max(0, grossPaid - feeAmount)).toFixed(2));

                          return (
                            <div
                              key={o.id}
                              className="p-5 rounded-2xl bg-white dark:bg-lowveld-950 border border-slate-200 dark:border-lowveld-800 shadow-sm hover:border-emerald-500/40 transition-all space-y-4"
                            >
                              {/* Top Bar: Order ID, Timestamp, Payment Method, Status Badge */}
                              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-lowveld-800/80 text-xs">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-mono font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-lowveld-900 px-2 py-0.5 rounded">
                                    {o.transactionRef || o.id}
                                  </span>
                                  <span className="text-slate-400 dark:text-gray-500 text-[11px]">
                                    {o.createdAt ? new Date(o.createdAt).toLocaleString() : 'Recent'}
                                  </span>
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-lowveld-900 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-lowveld-800">
                                    {o.paymentMethod || 'Direct Transfer / COD'}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span
                                    className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${
                                      o.status === 'delivered'
                                        ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                                        : o.status === 'confirmed'
                                        ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300'
                                        : o.status === 'cancelled'
                                        ? 'bg-red-500/20 text-red-700 dark:text-red-300'
                                        : 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                                    }`}
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                    {o.status === 'delivered'
                                      ? 'Disbursed to Seller'
                                      : o.status === 'confirmed'
                                      ? 'Payment In Escrow'
                                      : o.status === 'cancelled'
                                      ? 'Cancelled'
                                      : 'Pending Handover'}
                                  </span>
                                </div>
                              </div>

                              {/* Main Grid: Item Info, Buyer & Seller Breakdown, Financial Settlement */}
                              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                                {/* Item Details (col 1-4) */}
                                <div className="md:col-span-4 space-y-1">
                                  <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-gray-500 tracking-wider">
                                    Purchased Item
                                  </span>
                                  <p className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2">
                                    {o.listingTitle || 'Platform Trade Listing'}
                                  </p>
                                  <p className="text-slate-600 dark:text-gray-300">
                                    Quantity: <span className="font-bold">{o.quantity} unit(s)</span>
                                  </p>
                                  <p className="text-slate-500 dark:text-gray-400 text-[11px]">
                                    Pickup Hub: <span className="font-medium text-slate-700 dark:text-gray-300">{o.pickupLocation || 'Harare CBD'}</span>
                                  </p>
                                </div>

                                {/* Buyer & Seller Information (col 5-8) */}
                                <div className="md:col-span-4 space-y-3">
                                  <div>
                                    <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-gray-500 tracking-wider">
                                      Payer (Buyer)
                                    </span>
                                    <p className="font-bold text-slate-900 dark:text-white">{o.buyerName}</p>
                                    <a
                                      href={formatWhatsAppUrl(o.buyerPhone)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-emerald-600 dark:text-emerald-400 hover:underline font-mono inline-flex items-center gap-1 text-[11px]"
                                    >
                                      <Phone className="w-3 h-3" />
                                      <span>{o.buyerPhone}</span>
                                    </a>
                                  </div>

                                  <div>
                                    <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-gray-500 tracking-wider">
                                      Payee / Recipient (Seller)
                                    </span>
                                    <p className="font-bold text-slate-900 dark:text-white">
                                      {o.sellerName || 'Registered Merchant'}
                                    </p>
                                    <a
                                      href={formatWhatsAppUrl(o.sellerPhone)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-emerald-600 dark:text-emerald-400 hover:underline font-mono inline-flex items-center gap-1 text-[11px]"
                                    >
                                      <Phone className="w-3 h-3" />
                                      <span>{o.sellerPhone || '+263 78 323 7918'}</span>
                                    </a>
                                  </div>
                                </div>

                                {/* Financial Split Card ("What amount goes to who.. including us") (col 9-12) */}
                                <div className="md:col-span-4 p-3.5 rounded-xl bg-slate-50 dark:bg-lowveld-900/60 border border-slate-200 dark:border-lowveld-800 space-y-2">
                                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-lowveld-800">
                                    <span className="text-slate-600 dark:text-gray-400 font-medium">Buyer Paid (Gross):</span>
                                    <span className="font-black text-slate-900 dark:text-white font-mono">
                                      {o.currencyChoice} ${grossPaid.toFixed(2)}
                                    </span>
                                  </div>

                                  <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400">
                                    <span className="font-medium flex items-center gap-1">
                                      <span>Platform Cut (Us 5%):</span>
                                    </span>
                                    <span className="font-black font-mono">+${feeAmount.toFixed(2)}</span>
                                  </div>

                                  <div className="flex items-center justify-between text-blue-700 dark:text-blue-400 pt-1 border-t border-slate-200 dark:border-lowveld-800 font-bold">
                                    <span>Net Seller Payout:</span>
                                    <span className="font-black font-mono">${netSeller.toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Action Footer: Change Status, Mark Disbursed, Delete */}
                              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-lowveld-800/80 text-xs">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-[11px] text-slate-500 dark:text-gray-400 font-semibold">
                                    Update Trade Status:
                                  </span>

                                  {o.status !== 'confirmed' && o.status !== 'delivered' && (
                                    <button
                                      onClick={() => handleExecuteAction('update_order_status', o.id, { status: 'confirmed' })}
                                      className="px-2.5 py-1 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 text-blue-700 dark:text-blue-300 font-bold transition-colors"
                                    >
                                      Confirm Escrow
                                    </button>
                                  )}

                                  {o.status !== 'delivered' && (
                                    <button
                                      onClick={() => handleExecuteAction('update_order_status', o.id, { status: 'delivered' })}
                                      className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold transition-colors flex items-center gap-1"
                                    >
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      <span>Mark Disbursed to Seller</span>
                                    </button>
                                  )}

                                  {o.status !== 'cancelled' && (
                                    <button
                                      onClick={() => handleExecuteAction('update_order_status', o.id, { status: 'cancelled' })}
                                      className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-lowveld-900 hover:bg-slate-300 text-slate-700 dark:text-gray-300 font-semibold transition-colors"
                                    >
                                      Cancel Trade
                                    </button>
                                  )}
                                </div>

                                <button
                                  onClick={() => handleExecuteAction('delete_order', o.id)}
                                  className="px-2.5 py-1 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-600 dark:text-red-400 font-bold transition-colors inline-flex items-center gap-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete Order</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* BARTER PROPOSALS LEDGER */}
                {tradeTypeFilter !== 'orders' && (
                  <div className="space-y-3 pt-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 text-amber-500" />
                        <span>Barter Proposals & Cross-Swap Agreements ({filteredProposals.length})</span>
                      </h3>
                      <span className="text-xs text-slate-500 dark:text-gray-400">
                        Goods & services barter trades
                      </span>
                    </div>

                    {filteredProposals.length === 0 ? (
                      <div className="p-8 rounded-2xl bg-white dark:bg-lowveld-950 border border-slate-200 dark:border-lowveld-800 text-center text-xs text-slate-500 dark:text-gray-400">
                        No barter proposals match the current filter criteria.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredProposals.map((p) => (
                          <div
                            key={p.id}
                            className="p-5 rounded-2xl bg-white dark:bg-lowveld-950 border border-slate-200 dark:border-lowveld-800 shadow-sm hover:border-amber-500/40 transition-all space-y-4 text-xs"
                          >
                            {/* Proposal Header */}
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-lowveld-800/80">
                              <span className="font-mono font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-lowveld-900 px-2 py-0.5 rounded text-[11px]">
                                {p.id}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                  p.status === 'accepted'
                                    ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                                    : p.status === 'declined'
                                    ? 'bg-red-500/20 text-red-700 dark:text-red-300'
                                    : 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                                }`}
                              >
                                {p.status}
                              </span>
                            </div>

                            {/* Barter Swap Matrix: Offering vs Requested */}
                            <div className="space-y-3">
                              <div className="p-3 rounded-xl bg-amber-500/10 dark:bg-amber-950/20 border border-amber-500/20 space-y-1">
                                <span className="text-[10px] font-bold uppercase text-amber-700 dark:text-amber-300 tracking-wider">
                                  Proposer Offering:
                                </span>
                                <p className="font-bold text-sm text-slate-900 dark:text-white">
                                  {p.offeredItemTitle}
                                </p>
                                <p className="text-slate-600 dark:text-gray-300 text-[11px]">
                                  {p.offeredDescription || 'No extra terms described'}
                                </p>
                                <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500 dark:text-gray-400">
                                  <span>{p.proposerName} ({p.proposerLocation})</span>
                                  <a
                                    href={formatWhatsAppUrl(p.proposerPhone)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-emerald-600 dark:text-emerald-400 hover:underline font-mono"
                                  >
                                    {p.proposerPhone}
                                  </a>
                                </div>
                              </div>

                              <div className="p-3 rounded-xl bg-slate-50 dark:bg-lowveld-900/60 border border-slate-200 dark:border-lowveld-800 space-y-1">
                                <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-gray-500 tracking-wider">
                                  Wanted Listing & Seller:
                                </span>
                                <p className="font-bold text-sm text-slate-900 dark:text-white">
                                  {p.listingTitle || 'Target Listing'}
                                </p>
                                <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500 dark:text-gray-400">
                                  <span>{p.sellerName || 'Listing Owner'} ({p.sellerLocation || 'Chiredzi'})</span>
                                  <a
                                    href={formatWhatsAppUrl(p.sellerPhone)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-emerald-600 dark:text-emerald-400 hover:underline font-mono"
                                  >
                                    {p.sellerPhone || '+263 78 323 7918'}
                                  </a>
                                </div>
                              </div>

                              {p.cashTopUp && (
                                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold text-center text-xs">
                                  Cash Top-Up Included: ${p.cashTopUp} USD
                                </div>
                              )}
                            </div>

                            {/* Barter Moderation Footer */}
                            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-lowveld-800/80">
                              <div className="flex items-center gap-1.5">
                                {p.status !== 'accepted' && (
                                  <button
                                    onClick={() => handleExecuteAction('update_proposal_status', p.id, { status: 'accepted' })}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold transition-colors"
                                  >
                                    Accept Swap
                                  </button>
                                )}
                                {p.status !== 'declined' && (
                                  <button
                                    onClick={() => handleExecuteAction('update_proposal_status', p.id, { status: 'declined' })}
                                    className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-lowveld-900 hover:bg-slate-300 text-slate-700 dark:text-gray-300 font-semibold transition-colors"
                                  >
                                    Decline
                                  </button>
                                )}
                              </div>

                              <button
                                onClick={() => handleExecuteAction('delete_proposal', p.id)}
                                className="px-2 py-1 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-600 dark:text-red-400 font-bold transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
