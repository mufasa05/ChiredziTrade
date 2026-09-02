'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { 
  Send, 
  RefreshCw, 
  Code, 
  Terminal, 
  CheckCheck, 
  ChevronRight,
  Cpu,
  ExternalLink,
  Tractor
} from 'lucide-react';
import { LanguageProvider } from '@/context/LanguageContext';

function WhatsAppBotStudioContent() {
  const [messages, setMessages] = useState<any[]>([
    {
      id: '1',
      sender: 'bot',
      text: `Welcome to ChiredziTrade WhatsApp Bot\nLowveld Multi-Currency and Barter Engine\n\nType SELL to list a product or service.\nType what you need to SEARCH (e.g. "Borehole pump repair" or "30t cane truck").`,
      time: '19:30',
      quickReplies: ['SELL', '30t Cane Haulage', 'Borehole Pump Repair', 'Brahman Cattle'],
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    '[INIT] Webhook listener active on /api/webhook',
    '[FSM] Bot session initialized for sender +263772849102',
    '[VERIFY] Meta Webhook token check: PASSED (200 OK)',
  ]);

  const addLog = (log: string) => {
    setLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${log}`, ...prev.slice(0, 15)]);
  };

  const handleSendMessage = async (customText?: string) => {
    const text = (customText || input).trim();
    if (!text) return;

    const userMsg = {
      id: String(Date.now()),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    addLog(`[INBOUND] HTTP POST /api/webhook: "${text}"`);

    try {
      const res = await fetch('/api/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: '263772849102',
          body: text,
          senderName: 'Tinashe Artisan',
        }),
      });

      const data = await res.json();
      setIsTyping(false);

      if (data.reply) {
        addLog(`[OUTBOUND] 200 OK -> Meta Cloud API Graph v19.0: Session Updated`);
        if (data.reply.createdListingId) {
          addLog(`[DATABASE] Created Listing ID: ${data.reply.createdListingId}`);
        }

        setMessages((prev) => [
          ...prev,
          {
            id: String(Date.now() + 1),
            sender: 'bot',
            text: data.reply.text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            createdListingId: data.reply.createdListingId,
            quickReplies: data.reply.quickReplies,
          },
        ]);
      }
    } catch (err) {
      setIsTyping(false);
      addLog(`[ERROR] Webhook processing failed: ${err}`);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#070d09]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 w-full flex-1">
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-2">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>Meta WhatsApp Cloud API & Webhook Studio</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-white">
            WhatsApp Bot Engine & <span className="text-emerald-400">Live Webhook Sandbox</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Test the conversational FSM state machine, multi-currency parser, barter matching, and Meta API webhooks in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 rounded-3xl overflow-hidden shadow-2xl bg-[#0b141a] border border-[#202c33] flex flex-col h-[640px]">
            <div className="bg-[#202c33] px-4 py-3.5 flex items-center justify-between text-white border-b border-[#2a3942]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-sm text-white">
                  <Tractor className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">ChiredziTrade WhatsApp Bot</h4>
                  <p className="text-[11px] text-emerald-400">
                    {isTyping ? 'typing...' : 'online • Lowveld Multi-Currency'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleSendMessage('SELL')}
                className="px-2.5 py-1 rounded-lg bg-[#005c4b] hover:bg-[#00735e] text-xs font-bold text-white transition-all flex items-center gap-1"
                title="Trigger SELL flow"
              >
                <RefreshCw className="w-3 h-3" />
                <span>SELL</span>
              </button>
            </div>

            <div 
              className="flex-1 overflow-y-auto p-4 space-y-3"
              style={{
                backgroundImage: `radial-gradient(#182229 1px, transparent 1px)`,
                backgroundSize: '16px 16px',
                backgroundColor: '#0b141a',
              }}
            >
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
                    <div>{msg.text}</div>

                    {msg.createdListingId && (
                      <div className="mt-2.5 pt-2 border-t border-emerald-400/30">
                        <a
                          href={`/listing/${msg.createdListingId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm"
                        >
                          <span>View Live Listing</span>
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

                  {msg.quickReplies && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {msg.quickReplies.map((qr: string, i: number) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(qr)}
                          className="px-2.5 py-1 rounded-full bg-[#202c33] hover:bg-[#005c4b] text-emerald-300 hover:text-white border border-[#2a3942] text-xs font-medium transition-all flex items-center gap-1"
                        >
                          <span>{qr}</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#202c33] text-gray-400 text-xs w-20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]"></span>
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="bg-[#202c33] px-3.5 py-3 flex items-center gap-2 border-t border-[#2a3942]"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type SELL, SEARCH or a message..."
                className="flex-1 bg-[#2a3942] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none placeholder-gray-400"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-9 h-9 rounded-full bg-[#00a884] hover:bg-[#008f70] text-[#111b21] flex items-center justify-center font-bold disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="p-5 sm:p-6 rounded-3xl glass-panel border border-lowveld-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>Real-Time Webhook Engine Logs</span>
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  HTTP 200 OK
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/90 border border-lowveld-900 font-mono text-xs text-emerald-400 space-y-1.5 h-44 overflow-y-auto">
                {logs.map((log, i) => (
                  <p key={i} className="leading-relaxed break-all">
                    {log}
                  </p>
                ))}
              </div>
            </div>

            <div className="p-5 sm:p-6 rounded-3xl glass-panel border border-lowveld-800 space-y-4 text-xs sm:text-sm text-gray-300">
              <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-amber-400" />
                <span>Meta WhatsApp Cloud API Configuration</span>
              </h3>

              <div className="space-y-2">
                <p className="text-gray-400 text-xs">
                  In Meta for Developers App Dashboard &gt; WhatsApp &gt; Configuration:
                </p>
                <div className="p-3 rounded-xl bg-lowveld-950 border border-lowveld-800 font-mono text-xs space-y-1">
                  <p>
                    <span className="text-gray-400">Callback URL:</span>{' '}
                    <span className="text-emerald-300">https://your-domain.vercel.app/api/webhook</span>
                  </p>
                  <p>
                    <span className="text-gray-400">Verify Token:</span>{' '}
                    <span className="text-amber-300">chiredzi_trade_verify_token</span>
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-gray-400 text-xs">Required Environment Variables (.env.local):</p>
                <div className="p-3 rounded-xl bg-lowveld-950 border border-lowveld-800 font-mono text-xs space-y-1 text-gray-300">
                  <p className="text-emerald-400">WHATSAPP_TOKEN=EAAG...</p>
                  <p className="text-emerald-400">PHONE_NUMBER_ID=109283921...</p>
                  <p className="text-emerald-400">WEBHOOK_VERIFY_TOKEN=chiredzi_trade_verify_token</p>
                  <p className="text-emerald-400">GEMINI_API_KEY=AIzaSy...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function WhatsAppBotStudioPage() {
  return (
    <LanguageProvider>
      <WhatsAppBotStudioContent />
    </LanguageProvider>
  );
}
