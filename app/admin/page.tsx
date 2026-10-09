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
  DollarSign
} from 'lucide-react';
import { Listing, BarterProposal, TradeOrder, AdminPlatformStats } from '@/lib/types';
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
                    <span className="text-xs font-semibold">Total Users</span>
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
                    <span className="text-xs font-semibold">Barter Proposals</span>
                    <RefreshCw className="w-4 h-4 text-amber-500" />
                  </div>
                  <p className="font-display font-black text-2xl text-slate-900 dark:text-white">{stats.totalProposals}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-lowveld-950/80 border border-slate-200 dark:border-lowveld-800 shadow-sm">
                  <div className="flex items-center justify-between text-slate-500 dark:text-gray-400 mb-2">
                    <span className="text-xs font-semibold">Cash Orders</span>
                    <ShoppingBag className="w-4 h-4 text-blue-500" />
                  </div>
                  <p className="font-display font-black text-2xl text-slate-900 dark:text-white">{stats.totalOrders}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-lowveld-950/80 border border-slate-200 dark:border-lowveld-800 shadow-sm col-span-2 md:col-span-1">
                  <div className="flex items-center justify-between text-slate-500 dark:text-gray-400 mb-2">
                    <span className="text-xs font-semibold">Order Volume</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="font-display font-black text-2xl text-emerald-600 dark:text-emerald-400">${stats.grossOrderVolumeUSD}</p>
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
                <span>Trade Activity</span>
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
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-lowveld-800/60">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-slate-500 dark:text-gray-400">
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
                            <td className="p-3.5">⭐ {u.rating || 5.0} ({u.tradeCount || 0} trades)</td>
                            <td className="p-3.5 text-slate-500 dark:text-gray-400 font-mono text-[11px]">
                              {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Active'}
                            </td>
                            <td className="p-3.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                u.verifiedArtisan ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-slate-200 dark:bg-lowveld-900 text-slate-600 dark:text-gray-300'
                              }`}>
                                {u.verifiedArtisan ? 'Verified' : 'Active Trader'}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: TRADE ACTIVITY & PROPOSALS */}
            {activeTab === 'proposals' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Barter Proposals */}
                <div className="space-y-3">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-amber-500" />
                    <span>Barter Proposals ({proposals.length})</span>
                  </h3>
                  <div className="space-y-2">
                    {proposals.length === 0 ? (
                      <div className="p-6 rounded-2xl bg-white dark:bg-lowveld-950 border border-slate-200 dark:border-lowveld-800 text-center text-xs text-slate-500 dark:text-gray-400">
                        No barter proposals recorded yet.
                      </div>
                    ) : (
                      proposals.map((p) => (
                        <div key={p.id} className="p-3.5 rounded-2xl bg-white dark:bg-lowveld-950 border border-slate-200 dark:border-lowveld-800 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="font-bold text-slate-900 dark:text-white">{p.proposerName} ({p.proposerPhone})</p>
                            <button
                              onClick={() => handleExecuteAction('delete_proposal', p.id)}
                              className="text-red-500 hover:text-red-400 font-bold"
                            >
                              Delete
                            </button>
                          </div>
                          <p className="text-amber-600 dark:text-amber-400 font-semibold">Offered: {p.offeredItemTitle}</p>
                          <p className="text-slate-500 dark:text-gray-400">{p.offeredDescription}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Cash Orders */}
                <div className="space-y-3">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-emerald-500" />
                    <span>Cash Purchase Orders ({orders.length})</span>
                  </h3>
                  <div className="space-y-2">
                    {orders.length === 0 ? (
                      <div className="p-6 rounded-2xl bg-white dark:bg-lowveld-950 border border-slate-200 dark:border-lowveld-800 text-center text-xs text-slate-500 dark:text-gray-400">
                        No cash purchase orders placed yet.
                      </div>
                    ) : (
                      orders.map((o) => (
                        <div key={o.id} className="p-3.5 rounded-2xl bg-white dark:bg-lowveld-950 border border-slate-200 dark:border-lowveld-800 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="font-bold text-slate-900 dark:text-white">{o.buyerName} ({o.buyerPhone})</p>
                            <button
                              onClick={() => handleExecuteAction('delete_order', o.id)}
                              className="text-red-500 hover:text-red-400 font-bold"
                            >
                              Delete
                            </button>
                          </div>
                          <p className="text-emerald-600 dark:text-emerald-400 font-semibold">Total: {o.currencyChoice} ${o.totalPrice} ({o.quantity} qty)</p>
                          <p className="text-slate-500 dark:text-gray-400">Pickup: {o.pickupLocation}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
