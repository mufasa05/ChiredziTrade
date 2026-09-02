'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Sparkles, 
  Tractor, 
  Phone, 
  Video, 
  MoreVertical, 
  Paperclip, 
  Smile, 
  Mic, 
  Check, 
  CheckCheck,
  RefreshCw,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  createdListingId?: string;
  quickReplies?: string[];
}

interface WhatsAppSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onListingCreated?: (listingId: string) => void;
}

export default function WhatsAppSimulatorModal({
  isOpen,
  onClose,
  onListingCreated,
}: WhatsAppSimulatorModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'bot',
      text: `Welcome to ChiredziTrade WhatsApp Bot\nLowveld Multi-Currency and Barter Marketplace\n\nType SELL to list livestock, goods, or artisan services.\nType what you need to SEARCH (e.g. "Welder in Tshovani" or "30t haulage").`,
      time: '19:00',
      quickReplies: ['SELL', 'Nditsvagirewo Welder', 'Find Brahman Heifers', '30t Cane Truck'],
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userPhone, setUserPhone] = useState('263772849102');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const sendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Send message to our Webhook Handler
      const response = await fetch('/api/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: userPhone,
          body: text,
          senderName: 'Tinashe Artisan (Demo)',
        }),
      });

      const data = await response.json();
      setIsTyping(false);

      if (data.reply) {
        const botReply: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: data.reply.text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          createdListingId: data.reply.createdListingId,
          quickReplies: data.reply.quickReplies,
        };
        setMessages((prev) => [...prev, botReply]);

        if (data.reply.createdListingId && onListingCreated) {
          onListingCreated(data.reply.createdListingId);
        }
      }
    } catch (err) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'bot',
          text: '⚠️ Network timeout connecting to ChiredziTrade webhook.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  const handleResetSession = async () => {
    sendMessage('SELL');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md h-[90vh] max-h-[720px] rounded-3xl overflow-hidden shadow-2xl flex flex-col bg-[#0b141a] border border-[#202c33]">
        {/* WhatsApp Top Green Header */}
        <div className="bg-[#202c33] px-3.5 py-3 flex items-center justify-between text-white border-b border-[#2a3942]">
          <div className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 rounded-full bg-emerald-700 flex items-center justify-center text-white font-bold text-sm shadow-md">
              <Tractor className="w-5 h-5 text-white" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#202c33]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-sm text-gray-100 leading-tight">
                  ChiredziTrade Bot
                </h4>
                <span className="text-[9px] bg-[#005c4b] text-emerald-300 px-1 rounded font-mono font-bold">
                  OFFICIAL
                </span>
              </div>
              <p className="text-[11px] text-emerald-400 font-medium">
                {isTyping ? 'typing...' : 'online • Lowveld Trade Engine'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-gray-300">
            <button
              onClick={handleResetSession}
              title="Reset Conversation (SELL)"
              className="p-1.5 rounded-full hover:bg-[#374248] text-amber-400 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#374248] text-gray-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* WhatsApp Chat Wallpaper & Scrollable Feed */}
        <div 
          className="flex-1 overflow-y-auto p-3.5 space-y-3"
          style={{
            backgroundImage: `radial-gradient(#182229 1px, transparent 1px)`,
            backgroundSize: '16px 16px',
            backgroundColor: '#0b141a',
          }}
        >
          {/* Encryption Notice */}
          <div className="text-center my-2">
            <span className="inline-block px-3 py-1 rounded-lg bg-[#182229] text-[#ffd279] text-[10px] shadow-sm border border-[#2a3942]/60">
              🔒 Messages are routed to ChiredziTrade Webhook Engine with multi-currency & barter parser.
            </span>
          </div>

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] px-3.5 py-2.5 shadow-md text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.sender === 'user' ? 'wa-bubble-out' : 'wa-bubble-in'
                }`}
              >
                {/* Parse Markdown bold formatting inside WhatsApp messages */}
                <div>{msg.text}</div>

                {/* If listing was created, show rich card link */}
                {msg.createdListingId && (
                  <div className="mt-2.5 pt-2 border-t border-emerald-400/30">
                    <a
                      href={`/listing/${msg.createdListingId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all"
                    >
                      <span>Open Listing Page</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

                <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-gray-400">
                  <span>{msg.time}</span>
                  {msg.sender === 'user' && (
                    <CheckCheck className="w-3.5 h-3.5 text-cyan-400" />
                  )}
                </div>
              </div>

              {/* Quick Reply Pills */}
              {msg.quickReplies && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {msg.quickReplies.map((qr, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(qr)}
                      className="px-2.5 py-1 rounded-full bg-[#202c33] hover:bg-[#005c4b] text-emerald-300 hover:text-white border border-[#2a3942] text-xs font-medium transition-all shadow-sm flex items-center gap-1"
                    >
                      <span>{qr}</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#202c33] text-gray-400 text-xs w-24">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]"></span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Simulator Prompts */}
        <div className="px-3 py-1.5 bg-[#111b21] border-t border-[#202c33] flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
          <span className="text-gray-400 shrink-0 font-medium">Test prompts:</span>
          <button
            onClick={() => sendMessage('SELL')}
            className="px-2 py-0.5 rounded bg-[#202c33] hover:bg-emerald-900 text-emerald-300 border border-[#2a3942] shrink-0"
          >
            SELL (Post Wizard)
          </button>
          <button
            onClick={() => sendMessage('Borehole pump repair in Tshovani')}
            className="px-2 py-0.5 rounded bg-[#202c33] hover:bg-emerald-900 text-gray-300 shrink-0"
          >
            "Pump Repair"
          </button>
          <button
            onClick={() => sendMessage('Barter: Swap for 2 Boer goats')}
            className="px-2 py-0.5 rounded bg-[#202c33] hover:bg-amber-900 text-amber-300 shrink-0"
          >
            "Barter Terms"
          </button>
          <button
            onClick={() => sendMessage('Nditsvagirewo cane haulage truck')}
            className="px-2 py-0.5 rounded bg-[#202c33] hover:bg-blue-900 text-blue-300 shrink-0"
          >
            "Search Cane Truck"
          </button>
        </div>

        {/* WhatsApp Bottom Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="bg-[#202c33] px-3 py-2.5 flex items-center gap-2 border-t border-[#2a3942]"
        >
          <div className="flex-1 flex items-center bg-[#2a3942] rounded-2xl px-3 py-1.5 text-white">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message or command (SELL)..."
              className="w-full bg-transparent text-xs sm:text-sm text-gray-100 placeholder-gray-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={!input.trim()}
            className="w-10 h-10 rounded-full bg-[#00a884] hover:bg-[#008f70] text-[#111b21] flex items-center justify-center font-bold transition-all disabled:opacity-40 disabled:hover:bg-[#00a884]"
          >
            <Send className="w-4 h-4 text-[#111b21]" />
          </button>
        </form>
      </div>
    </div>
  );
}
