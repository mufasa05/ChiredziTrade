'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  Send,
  CheckCheck,
  ShieldCheck,
  Phone,
  MessageCircle,
  MapPin,
  RefreshCw,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Paperclip,
  Check,
  Building2,
  Clock,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export interface TradeMessage {
  id: string;
  sender: 'user' | 'counterparty';
  text: string;
  time: string;
  isOfferPill?: boolean;
  offerDetails?: {
    offeredItem: string;
    cashTopUp?: string;
  };
}

export interface TradeConversation {
  id: string;
  counterpartyName: string;
  counterpartyRole: string;
  counterpartyLocation: string;
  counterpartyPhone: string;
  counterpartyAvatar: string;
  verified: boolean;
  unreadCount: number;
  tradeType: 'barter' | 'buy' | 'support';
  listing?: {
    id: string;
    title: string;
    price: string;
    image: string;
    status: string;
  };
  messages: TradeMessage[];
}

const INITIAL_CONVERSATIONS: TradeConversation[] = [
  {
    id: 'conv-1',
    counterpartyName: 'Simba Chauke',
    counterpartyRole: 'Verified Livestock & Grain Producer',
    counterpartyLocation: 'Triangle Estate, Lowveld',
    counterpartyPhone: '+263783237918',
    counterpartyAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    verified: true,
    unreadCount: 1,
    tradeType: 'barter',
    listing: {
      id: 'zim-broiler-01',
      title: 'Broiler farming (Metra Poultry)',
      price: '$6.00 USD • Open to Barter',
      image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800&auto=format&fit=crop&q=80',
      status: 'Active',
    },
    messages: [
      {
        id: 'm1-1',
        sender: 'counterparty',
        text: 'Hello Prince, I saw your broiler chicken listing. Are they available for collection this weekend at Triangle Estate?',
        time: '10:30 AM',
      },
      {
        id: 'm1-2',
        sender: 'user',
        text: 'Yes Simba, the current batch is healthy, vaccinated, and ready for pickup at our Triangle depot.',
        time: '10:45 AM',
      },
      {
        id: 'm1-3',
        sender: 'counterparty',
        text: 'I have 2 sealed bags of Compound D fertilizer and 50kg maize grain. Can we swap with a $10 USD cash top-up?',
        time: '11:15 AM',
        isOfferPill: true,
        offerDetails: {
          offeredItem: '2 Bags Compound D Fertilizer + 50kg Grain',
          cashTopUp: '+$10.00 USD',
        },
      },
      {
        id: 'm1-4',
        sender: 'counterparty',
        text: 'Let me know if this works so we can confirm the collection hub and inspect.',
        time: '11:16 AM',
      },
    ],
  },
  {
    id: 'conv-2',
    counterpartyName: 'Tinashe Musarurwa',
    counterpartyRole: 'Certified Solar Systems Engineer',
    counterpartyLocation: 'Harare CBD',
    counterpartyPhone: '+263783237918',
    counterpartyAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    verified: true,
    unreadCount: 0,
    tradeType: 'barter',
    listing: {
      id: 'zim-solar-03',
      title: 'Solar Inverter & Lithium Battery (5kVA)',
      price: '$1,250.00 USD • Open to Barter',
      image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80',
      status: 'Active',
    },
    messages: [
      {
        id: 'm2-1',
        sender: 'counterparty',
        text: 'Good day. Is the 5kVA hybrid solar system in stock with factory warranty certificates?',
        time: 'Yesterday',
      },
      {
        id: 'm2-2',
        sender: 'user',
        text: 'Good day Tinashe. Yes, brand new in crate with 2-year warranty, Wi-Fi dongle, and pre-wired protection box.',
        time: 'Yesterday',
      },
      {
        id: 'm2-3',
        sender: 'counterparty',
        text: 'I have logged a swap proposal offering a 1.5HP borehole submersible pump plus $450 USD cash top-up.',
        time: '2 hours ago',
      },
    ],
  },
  {
    id: 'conv-3',
    counterpartyName: 'Farai Ncube',
    counterpartyRole: 'Masvingo Registered Butchery & Rancher',
    counterpartyLocation: 'Masvingo Urban',
    counterpartyPhone: '+263783237918',
    counterpartyAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    verified: true,
    unreadCount: 0,
    tradeType: 'buy',
    listing: {
      id: 'zim-broiler-01',
      title: 'Broiler farming (Metra Poultry)',
      price: '$6.00 USD',
      image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800&auto=format&fit=crop&q=80',
      status: 'Active',
    },
    messages: [
      {
        id: 'm3-1',
        sender: 'counterparty',
        text: 'Hi Prince, we require 60 dressed broilers weekly for our Masvingo depot. Can you supply consistently?',
        time: 'Oct 28',
      },
      {
        id: 'm3-2',
        sender: 'user',
        text: 'Greetings Farai. Yes, we run rolling hatch cycles every 14 days and can guarantee 60-100 units weekly.',
        time: 'Oct 28',
      },
    ],
  },
  {
    id: 'conv-support',
    counterpartyName: 'ZimBarter Trade Protection Desk',
    counterpartyRole: 'Official Escrow & Verification Desk',
    counterpartyLocation: 'Zimbabwe Operations',
    counterpartyPhone: '+263783237918',
    counterpartyAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    verified: true,
    unreadCount: 0,
    tradeType: 'support',
    messages: [
      {
        id: 'ms-1',
        sender: 'counterparty',
        text: 'Welcome to the ZimBarter Trade Protection Desk. We oversee trade escrow holds, verified goods handovers, and dispute resolution across all 10 provinces. Direct Hotline & WhatsApp: +263 78 323 7918 (0783237918). How can we assist your transaction today?',
        time: 'Oct 25',
      },
    ],
  },
];

interface TradeMessengerProps {
  initialListingId?: string;
  onClose?: () => void;
  isModal?: boolean;
}

export default function TradeMessenger({
  initialListingId,
  onClose,
  isModal = false,
}: TradeMessengerProps) {
  const [conversations, setConversations] = useState<TradeConversation[]>(INITIAL_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState<string>('conv-1');
  const [filterType, setFilterType] = useState<'all' | 'barter' | 'buy' | 'support'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Load local conversations if stored
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('zimbarter_trade_conversations_v3');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Force all demo numbers and support desk to user's phone +263783237918
            const sanitized = parsed.map((c: TradeConversation) => ({
              ...c,
              counterpartyPhone: '+263783237918',
            }));
            setConversations(sanitized);
            return;
          }
        }
        // Purge old stale keys from browser cache
        localStorage.removeItem('zimbarter_trade_conversations');
        localStorage.removeItem('zimbarter_trade_conversations_v2');
        localStorage.setItem('zimbarter_trade_conversations_v3', JSON.stringify(INITIAL_CONVERSATIONS));
        setConversations(INITIAL_CONVERSATIONS);
      } catch (e) {
        console.warn('Failed to load local conversations:', e);
      }
    }
  }, []);

  // Save to localStorage when updated
  const saveConversations = (updated: TradeConversation[]) => {
    const sanitized = updated.map((c) => ({
      ...c,
      counterpartyPhone: '+263783237918',
    }));
    setConversations(sanitized);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('zimbarter_trade_conversations_v3', JSON.stringify(sanitized));
      } catch (e) {
        console.warn('Failed to save conversations:', e);
      }
    }
  };

  // Scroll to bottom on new message
  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConvId, conversations, isTyping]);

  const activeConversation = useMemo(() => {
    return conversations.find((c) => c.id === activeConvId) || conversations[0];
  }, [conversations, activeConvId]);

  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      if (filterType !== 'all' && c.tradeType !== filterType) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inName = c.counterpartyName.toLowerCase().includes(q);
        const inItem = (c.listing?.title || '').toLowerCase().includes(q);
        const inLoc = c.counterpartyLocation.toLowerCase().includes(q);
        if (!inName && !inItem && !inLoc) return false;
      }
      return true;
    });
  }, [conversations, filterType, searchQuery]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || !activeConversation) return;

    const newMsg: TradeMessage = {
      id: `m-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = conversations.map((c) => {
      if (c.id === activeConversation.id) {
        return {
          ...c,
          messages: [...c.messages, newMsg],
        };
      }
      return c;
    });

    saveConversations(updated);
    setInputMessage('');
    setIsTyping(true);

    // Contextual Counterparty response after 1.2s
    setTimeout(() => {
      setIsTyping(false);
      let replyText = 'Thank you for confirming. I have marked this in my handover schedule.';
      if (text.toLowerCase().includes('hub') || text.toLowerCase().includes('meet')) {
        replyText = `Understood. Let's meet at ${activeConversation.counterpartyLocation} Trade Hub. I will bring the items for inspection.`;
      } else if (text.toLowerCase().includes('accept') || text.toLowerCase().includes('agree')) {
        replyText = 'Deal confirmed! Looking forward to closing this trade with you.';
      } else if (text.toLowerCase().includes('police') || text.toLowerCase().includes('clearance')) {
        replyText = 'Stock theft clearance and brand inspection papers are stamped and ready.';
      }

      const replyMsg: TradeMessage = {
        id: `m-${Date.now() + 1}`,
        sender: 'counterparty',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const withReply = updated.map((c) => {
        if (c.id === activeConversation.id) {
          return {
            ...c,
            messages: [...c.messages, replyMsg],
          };
        }
        return c;
      });

      saveConversations(withReply);
    }, 1200);
  };

  const handleSelectConversation = (id: string) => {
    setActiveConvId(id);
    // Clear unread count
    const updated = conversations.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c));
    saveConversations(updated);
  };

  return (
    <div className={`w-full flex flex-col md:flex-row bg-white dark:bg-[#07130e] text-slate-900 dark:text-gray-100 overflow-hidden ${isModal ? 'h-[85vh] rounded-3xl' : 'h-[calc(100vh-5rem)] border border-slate-200 dark:border-[#0e4337] rounded-3xl shadow-xl'}`}>
      {/* LEFT PANE: CONVERSATION LIST */}
      <div className="w-full md:w-80 lg:w-96 shrink-0 border-r border-slate-200 dark:border-[#0e4337] flex flex-col bg-slate-50/60 dark:bg-[#051a14]/60">
        {/* Pane Header */}
        <div className="p-4 border-b border-slate-200 dark:border-[#0e4337] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-[#059669]" />
              <h2 className="font-display font-bold text-base text-slate-900 dark:text-white">
                Trade Messages
              </h2>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
              Verified Chats
            </span>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search trader, item, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white dark:bg-[#07130e] border border-slate-200 dark:border-[#0e4337] text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {(['all', 'barter', 'buy', 'support'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all capitalize whitespace-nowrap ${
                  filterType === type
                    ? 'bg-[#059669] text-white shadow-sm'
                    : 'bg-white dark:bg-[#07130e] text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-[#0e4337]'
                }`}
              >
                {type === 'all' ? 'All Chats' : type === 'barter' ? 'Barter Swaps' : type === 'buy' ? 'Cash Orders' : 'Support'}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-[#0e4337]/50">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 dark:text-gray-400">
              No trade conversations match your search.
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isSelected = conv.id === activeConversation?.id;
              const lastMsg = conv.messages[conv.messages.length - 1];

              return (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-emerald-500/10 dark:bg-emerald-950/40 border-l-4 border-l-[#059669]'
                      : 'hover:bg-white dark:hover:bg-[#07130e]/80'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={conv.counterpartyAvatar}
                      alt={conv.counterpartyName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-[#0e4337]"
                    />
                    {conv.verified && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#059669] text-white flex items-center justify-center border-2 border-white dark:border-[#07130e]">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {conv.counterpartyName}
                      </h4>
                      <span className="text-[10px] text-slate-400 dark:text-gray-500 shrink-0 font-mono">
                        {lastMsg ? lastMsg.time : ''}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-gray-400 truncate mt-0.5">
                      {conv.listing ? (
                        <span className="font-medium text-[#059669] dark:text-emerald-400">
                          {conv.listing.title}:{' '}
                        </span>
                      ) : null}
                      {lastMsg ? lastMsg.text : 'Start discussion'}
                    </p>

                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[10px] text-slate-400 dark:text-gray-500 flex items-center gap-0.5">
                        <MapPin className="w-2.5 h-2.5 text-[#059669]" />
                        <span>{conv.counterpartyLocation}</span>
                      </span>
                      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                        {conv.counterpartyPhone}
                      </span>
                      {conv.unreadCount > 0 && (
                        <span className="ml-auto w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT PANE: ACTIVE CONVERSATION THREAD */}
      {activeConversation ? (
        <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#07130e]">
          {/* Thread Header */}
          <div className="p-4 border-b border-slate-200 dark:border-[#0e4337] flex items-center justify-between gap-3 bg-slate-50/40 dark:bg-[#051a14]/40">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={activeConversation.counterpartyAvatar}
                alt={activeConversation.counterpartyName}
                className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-[#0e4337] shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                    {activeConversation.counterpartyName}
                  </h3>
                  {activeConversation.verified && (
                    <span className="px-1.5 py-0.2 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold flex items-center gap-0.5 shrink-0">
                      <ShieldCheck className="w-3 h-3 text-[#059669]" />
                      <span>Verified Trader</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-gray-400 truncate">
                  <span>{activeConversation.counterpartyRole} • {activeConversation.counterpartyLocation}</span>
                  <span>•</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {activeConversation.counterpartyPhone}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={`https://wa.me/${activeConversation.counterpartyPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                  `Hi ${activeConversation.counterpartyName}, following up on our ZimBarter chat regarding ${activeConversation.listing?.title || 'trade'}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-[#005c4b] hover:bg-[#00705b] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>

              {onClose && (
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-[#0a3a30] transition-colors"
                  aria-label="Close message window"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Trade Context Card (Item being discussed) */}
          {activeConversation.listing && (
            <div className="p-3 mx-4 mt-3 rounded-2xl bg-slate-50 dark:bg-[#041d18] border border-slate-200 dark:border-[#0e4337] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={activeConversation.listing.image}
                  alt={activeConversation.listing.title}
                  className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-[#0e4337]"
                />
                <div className="min-w-0 text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-gray-400 block">
                    Trade Subject:
                  </span>
                  <p className="font-bold text-slate-900 dark:text-white truncate">
                    {activeConversation.listing.title}
                  </p>
                  <p className="text-amber-700 dark:text-[#F5C542] font-semibold text-[11px]">
                    {activeConversation.listing.price}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href="/barter-network"
                  className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-800 dark:text-[#F5C542] text-xs font-bold flex items-center gap-1 transition-colors border border-amber-500/30"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Trade Terms</span>
                </Link>
              </div>
            </div>
          )}

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {activeConversation.messages.map((msg) => {
              const isUser = msg.sender === 'user';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-[#059669] text-white rounded-br-xs shadow-md'
                        : 'bg-slate-100 dark:bg-[#0c2a20] text-slate-900 dark:text-gray-100 border border-slate-200 dark:border-[#0e4337] rounded-bl-xs shadow-sm'
                    }`}
                  >
                    {/* Offer Pill if structured offer */}
                    {msg.isOfferPill && msg.offerDetails && (
                      <div className="mb-2 p-2.5 rounded-xl bg-white/10 dark:bg-black/20 border border-white/20 text-xs space-y-1">
                        <span className="text-[10px] uppercase font-black tracking-wider block opacity-80">
                          Proposed Asset Trade:
                        </span>
                        <p className="font-bold">{msg.offerDetails.offeredItem}</p>
                        {msg.offerDetails.cashTopUp && (
                          <p className="font-extrabold text-amber-300 dark:text-[#F5C542]">
                            Cash Adjustment: {msg.offerDetails.cashTopUp}
                          </p>
                        )}
                      </div>
                    )}

                    <p>{msg.text}</p>

                    <div
                      className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                        isUser ? 'text-emerald-100' : 'text-slate-500 dark:text-gray-400'
                      }`}
                    >
                      <span>{msg.time}</span>
                      {isUser && <CheckCheck className="w-3.5 h-3.5 text-emerald-200" />}
                    </div>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-gray-400 italic">
                <span className="w-2 h-2 rounded-full bg-[#059669] animate-ping" />
                <span>{activeConversation.counterpartyName} is typing...</span>
              </div>
            )}

            <div ref={chatScrollRef} />
          </div>

          {/* Quick Action Shortcuts */}
          <div className="px-4 py-2 border-t border-slate-100 dark:border-[#0e4337]/60 flex items-center gap-2 overflow-x-auto no-scrollbar bg-slate-50/50 dark:bg-[#051a14]/30">
            <button
              onClick={() => handleSendMessage('Can we confirm the pickup location at the trade hub?')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#07130e] border border-slate-200 dark:border-[#0e4337] text-[11px] text-slate-700 dark:text-gray-300 hover:text-[#059669] whitespace-nowrap transition-colors"
            >
              Confirm Trade Hub
            </button>
            <button
              onClick={() => handleSendMessage('I accept the trade proposal. Let us arrange handover inspection.')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#07130e] border border-slate-200 dark:border-[#0e4337] text-[11px] text-slate-700 dark:text-gray-300 hover:text-[#059669] whitespace-nowrap transition-colors"
            >
              Accept Proposal
            </button>
            <button
              onClick={() => handleSendMessage('Please ensure police anti-stock theft clearance papers are stamped.')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#07130e] border border-slate-200 dark:border-[#0e4337] text-[11px] text-slate-700 dark:text-gray-300 hover:text-[#059669] whitespace-nowrap transition-colors"
            >
              Request Police Clearance
            </button>
          </div>

          {/* Message Input Footer */}
          <div className="p-3.5 border-t border-slate-200 dark:border-[#0e4337] bg-white dark:bg-[#07130e]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder={`Message ${activeConversation.counterpartyName}... (Press Enter to send)`}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#041d18] border border-slate-200 dark:border-[#0e4337] text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="p-2.5 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

