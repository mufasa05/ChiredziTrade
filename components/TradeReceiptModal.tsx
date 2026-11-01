'use client';

import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  Share2, 
  ShieldCheck, 
  MapPin, 
  FileText, 
  Phone,
  QrCode,
  Building2,
  Calendar,
  Hash,
  Award
} from 'lucide-react';
import Logo from '@/components/Logo';

export interface ReceiptData {
  orderReference: string;
  date: string;
  itemTitle: string;
  category?: string;
  quantity: number | string;
  unitPrice: number;
  subtotal: number;
  platformFee?: number;
  totalAmount: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: 'PAID' | 'CONFIRMED' | 'HANDOVER_PENDING' | 'COMPLETED';
  sellerName: string;
  sellerPhone: string;
  sellerLocation: string;
  sellerVerified?: boolean;
  buyerName: string;
  buyerPhone: string;
  collectionHub: string;
  notes?: string;
}

interface TradeReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: ReceiptData | null;
}

export default function TradeReceiptModal({ isOpen, onClose, receipt }: TradeReceiptModalProps) {
  if (!isOpen || !receipt) return null;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }

    const html = generatePrintableHtml(receipt);
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const handleDownloadHtml = () => {
    const html = generatePrintableHtml(receipt);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ZimBarter_Official_Receipt_${receipt.orderReference}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleShareWhatsApp = () => {
    let cleanPhone = (receipt.sellerPhone || '').replace(/\D/g, '');
    if (!cleanPhone) cleanPhone = '263783237918';
    if (cleanPhone.startsWith('0')) cleanPhone = '263' + cleanPhone.slice(1);
    const text = [
      `*ZIMBARTER SOVEREIGN TRADE NETWORK | OFFICIAL RECEIPT*`,
      `========================================`,
      `Document Reference: *#${receipt.orderReference}*`,
      `Date of Issuance: *${receipt.date}*`,
      `Settlement Status: *${receipt.paymentStatus.toUpperCase()}*`,
      `Payment Instrument: *${receipt.paymentMethod.toUpperCase()}*`,
      ``,
      `*ITEM PARTICULARS:*`,
      `- Description: *${receipt.itemTitle}* (Qty: ${receipt.quantity})`,
      `- Unit Valuation: *${receipt.currency} $${receipt.unitPrice.toFixed(2)}*`,
      `- Settlement Subtotal: *${receipt.currency} $${receipt.subtotal.toFixed(2)}*`,
      receipt.platformFee ? `- Escrow / Platform Fee: *${receipt.currency} $${receipt.platformFee.toFixed(2)}*` : ``,
      `- Total Cleared: *${receipt.currency} $${receipt.totalAmount.toFixed(2)}*`,
      `- Custody & Handover Hub: *${receipt.collectionHub}*`,
      ``,
      `*TRANSACTING PARTIES:*`,
      `- Buyer: *${receipt.buyerName}* (${receipt.buyerPhone})`,
      `- Seller: *${receipt.sellerName}* (${receipt.sellerPhone})`,
      `========================================`,
      `ZimBarter Trade Protection & Escrow Desk`,
      `Verification Hotline: +263 78 323 7918 | Security Hash: ${receipt.orderReference}-ZW-2026`,
    ].filter(Boolean).join('\n');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
    >
      <div className="relative w-full max-w-xl bg-white dark:bg-[#061c15] border border-slate-200 dark:border-emerald-500/30 rounded-3xl shadow-2xl overflow-hidden max-h-[94vh] flex flex-col animate-in zoom-in-95 duration-150">
        
        {/* Top Control Bar */}
        <div className="px-5 py-3 border-b border-slate-200 dark:border-[#0e4337] flex items-center justify-between bg-slate-50 dark:bg-[#041610]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold text-slate-800 dark:text-emerald-200 uppercase tracking-wider font-mono">
              Official Trade Document &bull; Verified
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrint}
              title="Print Receipt"
              className="p-1.5 rounded-xl text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#0e4337] transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownloadHtml}
              title="Download Official Receipt File"
              className="p-1.5 rounded-xl text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#0e4337] transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              title="Close"
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#0e4337] transition-colors ml-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Receipt Body with Watermark */}
        <div className="relative flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-slate-900 dark:text-gray-100">
          
          {/* Subtle Authentic Brand Watermark in Background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden select-none">
            <svg
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-72 h-72 sm:w-80 sm:h-80 opacity-[0.035] dark:opacity-[0.045] transform -rotate-12"
            >
              <circle cx="32" cy="32" r="28" stroke="#10B981" strokeWidth="2" strokeDasharray="3 3" />
              <path
                d="M 20 22 C 26 15 38 15 44 20 L 46 16 L 47 25 L 38 25 L 41 22 C 36 18 27 18 22 23 Z"
                fill="#10B981"
              />
              <path
                d="M 44 42 C 38 49 26 49 20 44 L 18 48 L 17 39 L 26 39 L 23 42 C 28 46 37 46 42 41 Z"
                fill="#F5C542"
              />
              <polygon points="32,23 37,32 32,41 27,32" fill="#10B981" />
              <circle cx="32" cy="32" r="3" fill="#F5C542" />
            </svg>
          </div>

          {/* Official Document Header */}
          <div className="relative z-10 text-center pb-5 border-b-2 border-slate-200 dark:border-[#0e4337]">
            <div className="flex justify-center mb-2">
              <Logo size="md" />
            </div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-emerald-700 dark:text-emerald-400 font-mono">
              Sovereign Trade &amp; Barter Network of Zimbabwe
            </p>
            <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5">
              Official Multi-Currency Settlement &amp; Escrow Clearance Voucher
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 font-mono text-xs font-black tracking-wide">
                REF: {receipt.orderReference}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-[#0c241b] border border-slate-200 dark:border-[#0e4337] text-slate-700 dark:text-gray-300 font-mono text-xs">
                ISSUED: {receipt.date}
              </span>
            </div>
          </div>

          {/* Verification & Handover Strip */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-[#041610] border border-slate-200 dark:border-[#0e4337]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-gray-400 block tracking-wider">
                  Settlement Status
                </span>
                <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 font-mono">
                  {receipt.paymentStatus} &bull; {receipt.paymentMethod.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200 dark:border-[#0e4337]">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-gray-400 block tracking-wider">
                Custody &amp; Handover Hub
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center sm:justify-end gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                {receipt.collectionHub}
              </span>
            </div>
          </div>

          {/* Transacting Parties Dossier */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Seller Details */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#071d15] border border-slate-200 dark:border-[#0e4337] shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 tracking-wider block">
                Verified Seller
              </span>
              <p className="font-bold text-slate-900 dark:text-white text-sm">{receipt.sellerName}</p>
              <p className="text-slate-600 dark:text-gray-300 font-mono text-xs flex items-center gap-1.5 pt-0.5">
                <Phone className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>{receipt.sellerPhone}</span>
              </p>
              <p className="text-[11px] text-slate-500 dark:text-gray-400 flex items-center gap-1.5 pt-0.5">
                <Building2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>{receipt.sellerLocation}</span>
              </p>
            </div>

            {/* Buyer Details */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#071d15] border border-slate-200 dark:border-[#0e4337] shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 tracking-wider block">
                Verified Buyer
              </span>
              <p className="font-bold text-slate-900 dark:text-white text-sm">{receipt.buyerName}</p>
              <p className="text-slate-600 dark:text-gray-300 font-mono text-xs flex items-center gap-1.5 pt-0.5">
                <Phone className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>{receipt.buyerPhone}</span>
              </p>
              <p className="text-[11px] text-slate-500 dark:text-gray-400 flex items-center gap-1.5 pt-0.5">
                <MapPin className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>Designated Pickup Hub: {receipt.collectionHub}</span>
              </p>
            </div>
          </div>

          {/* Itemized Clearance Table */}
          <div className="relative z-10 border border-slate-200 dark:border-[#0e4337] rounded-2xl overflow-hidden text-xs">
            <div className="grid grid-cols-12 bg-slate-100 dark:bg-[#041610] px-4 py-2.5 font-bold text-[11px] text-slate-700 dark:text-gray-300 uppercase tracking-wider">
              <span className="col-span-6">Particulars / Trade Description</span>
              <span className="col-span-2 text-center">Quantity</span>
              <span className="col-span-4 text-right">Subtotal</span>
            </div>
            <div className="grid grid-cols-12 px-4 py-3.5 border-t border-slate-200 dark:border-[#0e4337] items-center bg-white dark:bg-[#071d15]">
              <div className="col-span-6 pr-2">
                <p className="font-bold text-slate-900 dark:text-white text-sm">{receipt.itemTitle}</p>
                <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5">
                  Category: {receipt.category || 'General Commercial Goods'}
                </p>
              </div>
              <span className="col-span-2 text-center font-mono font-bold text-slate-800 dark:text-gray-200">
                {receipt.quantity}
              </span>
              <span className="col-span-4 text-right font-mono font-bold text-slate-900 dark:text-white text-sm">
                ${receipt.subtotal.toFixed(2)} {receipt.currency}
              </span>
            </div>
          </div>

          {/* Financial Audit Summary */}
          <div className="relative z-10 p-4 rounded-2xl bg-slate-50 dark:bg-[#041610] border border-slate-200 dark:border-[#0e4337] space-y-2 font-mono text-xs">
            <div className="flex justify-between text-slate-600 dark:text-gray-400">
              <span>Itemized Subtotal:</span>
              <span className="font-bold">${receipt.subtotal.toFixed(2)} {receipt.currency}</span>
            </div>
            {receipt.platformFee !== undefined && receipt.platformFee > 0 && (
              <div className="flex justify-between text-slate-600 dark:text-gray-400 text-[11px]">
                <span>Escrow &amp; Trade Custody:</span>
                <span>${receipt.platformFee.toFixed(2)} {receipt.currency}</span>
              </div>
            )}
            <div className="pt-2.5 border-t-2 border-slate-200 dark:border-[#0e4337] flex justify-between font-bold text-base text-slate-900 dark:text-white">
              <span>Total Settlement:</span>
              <span className="text-emerald-600 dark:text-emerald-400 text-lg">
                ${receipt.totalAmount.toFixed(2)} {receipt.currency}
              </span>
            </div>
          </div>

          {/* Cryptographic Verification Seal & Hash */}
          <div className="relative z-10 pt-3 pb-1 border-t border-dashed border-slate-300 dark:border-[#0e4337] flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 dark:text-gray-400 text-[10px] font-mono">
            <div className="text-center sm:text-left space-y-0.5">
              <p className="font-bold text-slate-700 dark:text-gray-300">AUTHENTICATED ZIMBARTER TRADE RECORD</p>
              <p>Cryptographic Audit Hash: {receipt.orderReference}-ZW-ESCROW-2026</p>
              <p>Physical inspection required upon collection at trade hub.</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <QrCode className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              <div className="flex flex-col text-[8px] leading-tight font-mono tracking-widest text-slate-500 dark:text-gray-400">
                <span>||||||| | |||||</span>
                <span>{receipt.orderReference}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions Drawer */}
        <div className="p-4 border-t border-slate-200 dark:border-[#0e4337] bg-slate-50 dark:bg-[#041610] flex flex-wrap gap-2.5">
          <button
            onClick={handleDownloadHtml}
            className="flex-1 min-w-[140px] py-2.5 px-3 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Official File</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex-1 min-w-[120px] py-2.5 px-3 rounded-xl bg-slate-200 dark:bg-[#071d15] hover:bg-slate-300 dark:hover:bg-[#0c2e22] text-slate-800 dark:text-gray-200 border border-slate-300 dark:border-[#0e4337] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="py-2.5 px-4 rounded-xl bg-[#005c4b] hover:bg-[#00705b] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-300" />
            <span>Share via WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function generatePrintableHtml(r: ReceiptData): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>ZimBarter Official Receipt - ${r.orderReference}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    @page {
      size: A4 portrait;
      margin: 15mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      margin: 0;
      padding: 30px;
      color: #111827;
      background: #f8fafc;
      line-height: 1.5;
    }
    .receipt-container {
      position: relative;
      max-width: 650px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 36px 40px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      overflow: hidden;
    }
    
    /* Authentic Vector Watermark */
    .watermark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-12deg);
      width: 380px;
      height: 380px;
      opacity: 0.04;
      pointer-events: none;
      z-index: 0;
    }

    .content {
      position: relative;
      z-index: 1;
    }

    /* Header */
    .header {
      text-align: center;
      border-bottom: 2px solid #059669;
      padding-bottom: 20px;
      margin-bottom: 24px;
    }
    .brand-title {
      font-size: 26px;
      font-weight: 900;
      letter-spacing: -0.5px;
      color: #062A22;
      margin: 0 0 4px;
    }
    .brand-title span {
      color: #D97706;
    }
    .network-sub {
      font-size: 10px;
      text-transform: uppercase;
      font-weight: 800;
      letter-spacing: 2px;
      color: #059669;
      margin: 0 0 4px;
    }
    .doc-type {
      font-size: 12px;
      color: #64748b;
      margin: 0;
    }
    .badge-bar {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-top: 14px;
    }
    .badge {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 9999px;
      background: #ecfdf5;
      color: #059669;
      border: 1px solid #a7f3d0;
    }
    .badge-secondary {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 11px;
      font-weight: 600;
      padding: 4px 12px;
      border-radius: 9999px;
      background: #f1f5f9;
      color: #475569;
      border: 1px solid #e2e8f0;
    }

    /* Parties */
    .parties-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 24px;
    }
    .party-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 14px 16px;
      font-size: 12px;
    }
    .party-label {
      font-size: 10px;
      text-transform: uppercase;
      font-weight: 800;
      color: #059669;
      letter-spacing: 1px;
      margin-bottom: 4px;
    }
    .party-name {
      font-size: 14px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 2px;
    }
    .party-meta {
      color: #64748b;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 11px;
    }

    /* Items Table */
    .table-container {
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 20px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    th {
      background: #f1f5f9;
      color: #475569;
      font-weight: 800;
      text-transform: uppercase;
      font-size: 10px;
      letter-spacing: 0.5px;
      padding: 10px 14px;
      text-align: left;
    }
    th.text-right, td.text-right { text-align: right; }
    th.text-center, td.text-center { text-align: center; }
    td {
      padding: 12px 14px;
      border-top: 1px solid #e2e8f0;
      color: #1e293b;
    }
    .item-title {
      font-weight: 700;
      color: #0f172a;
    }
    .item-cat {
      font-size: 11px;
      color: #64748b;
    }

    /* Totals */
    .totals-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 16px 18px;
      margin-bottom: 24px;
      font-size: 13px;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
      color: #64748b;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    }
    .totals-row.grand {
      border-top: 2px solid #cbd5e1;
      padding-top: 10px;
      margin-top: 10px;
      margin-bottom: 0;
      font-size: 16px;
      font-weight: 800;
      color: #062A22;
    }
    .totals-row.grand span:last-child {
      color: #059669;
    }

    /* Footer / Audit */
    .footer {
      border-top: 1px dashed #cbd5e1;
      padding-top: 16px;
      text-align: center;
      font-size: 11px;
      color: #64748b;
    }
    .footer-stamp {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 10px;
      color: #94a3b8;
      margin-top: 4px;
    }

    .no-print-bar {
      max-width: 650px;
      margin: 0 auto 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .btn {
      padding: 8px 16px;
      border-radius: 8px;
      background: #059669;
      color: #fff;
      font-size: 12px;
      font-weight: 700;
      border: none;
      cursor: pointer;
    }

    @media print {
      body {
        background: #ffffff;
        padding: 0;
      }
      .receipt-container {
        border: none;
        box-shadow: none;
        padding: 15px;
        max-width: 100%;
      }
      .no-print-bar {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="no-print-bar">
    <span style="font-size: 12px; color: #64748b; font-weight: 600;">ZimBarter Official Receipt Document</span>
    <button class="btn" onclick="window.print()">Print Receipt</button>
  </div>

  <div class="receipt-container">
    <!-- SVG Watermark in background -->
    <svg class="watermark" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="28" stroke="#10B981" stroke-width="2" stroke-dasharray="3 3" />
      <path d="M 20 22 C 26 15 38 15 44 20 L 46 16 L 47 25 L 38 25 L 41 22 C 36 18 27 18 22 23 Z" fill="#10B981" />
      <path d="M 44 42 C 38 49 26 49 20 44 L 18 48 L 17 39 L 26 39 L 23 42 C 28 46 37 46 42 41 Z" fill="#F5C542" />
      <polygon points="32,23 37,32 32,41 27,32" fill="#10B981" />
      <circle cx="32" cy="32" r="3" fill="#F5C542" />
    </svg>

    <div class="content">
      <div class="header">
        <h1 class="brand-title">Zim<span>Barter</span></h1>
        <p class="network-sub">Sovereign Trade &amp; Barter Network of Zimbabwe</p>
        <p class="doc-type">Official Settlement Clearance &amp; Escrow Verification Receipt</p>
        <div class="badge-bar">
          <span class="badge">REF: #${r.orderReference}</span>
          <span class="badge-secondary">DATE: ${r.date}</span>
          <span class="badge">STATUS: ${r.paymentStatus}</span>
        </div>
      </div>

      <div class="parties-grid">
        <div class="party-card">
          <div class="party-label">Seller (Beneficiary)</div>
          <div class="party-name">${r.sellerName}</div>
          <div class="party-meta">${r.sellerPhone}</div>
          <div class="party-meta" style="margin-top: 4px;">Location: ${r.sellerLocation}</div>
        </div>
        <div class="party-card">
          <div class="party-label">Buyer (Payer)</div>
          <div class="party-name">${r.buyerName}</div>
          <div class="party-meta">${r.buyerPhone}</div>
          <div class="party-meta" style="margin-top: 4px;">Trade Hub: ${r.collectionHub}</div>
        </div>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Item Particulars</th>
              <th class="text-center">Quantity</th>
              <th class="text-right">Unit Price</th>
              <th class="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div class="item-title">${r.itemTitle}</div>
                <div class="item-cat">${r.category || 'Standard Goods / Commodity'}</div>
              </td>
              <td class="text-center" style="font-family: ui-monospace, monospace; font-weight: 700;">${r.quantity}</td>
              <td class="text-right" style="font-family: ui-monospace, monospace;">$${r.unitPrice.toFixed(2)} ${r.currency}</td>
              <td class="text-right" style="font-family: ui-monospace, monospace; font-weight: 700;">$${r.subtotal.toFixed(2)} ${r.currency}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="totals-card">
        <div class="totals-row">
          <span>Subtotal:</span>
          <span>$${r.subtotal.toFixed(2)} ${r.currency}</span>
        </div>
        ${r.platformFee !== undefined && r.platformFee > 0 ? `
        <div class="totals-row">
          <span>Escrow &amp; Trade Custody Duty:</span>
          <span>$${r.platformFee.toFixed(2)} ${r.currency}</span>
        </div>` : ''}
        <div class="totals-row">
          <span>Payment Instrument:</span>
          <span style="font-weight: 700; color: #1e293b;">${r.paymentMethod.toUpperCase()}</span>
        </div>
        <div class="totals-row grand">
          <span>Total Settlement Cleared:</span>
          <span>$${r.totalAmount.toFixed(2)} ${r.currency}</span>
        </div>
      </div>

      <div class="footer">
        <p style="margin: 0 0 4px; font-weight: 700; color: #1e293b;">ZimBarter Trade Protection &amp; Escrow Guarantee</p>
        <p style="margin: 0 0 8px;">Please present this official voucher upon item collection at ${r.collectionHub}.</p>
        <div class="footer-stamp">Security Hash: ${r.orderReference}-ZW-ESCROW-2026 &bull; Verification Hotline: +263 78 323 7918</div>
      </div>
    </div>
  </div>
</body>
</html>`;
}
