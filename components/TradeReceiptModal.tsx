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
  QrCode
} from 'lucide-react';

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
    link.download = `ZimBarter_Receipt_${receipt.orderReference}.html`;
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
      `*ZIMBARTER TRADE NETWORK | OFFICIAL RECEIPT*`,
      `────────────────────────────────────────`,
      `Order Reference: *#${receipt.orderReference}*`,
      `Date: *${receipt.date}*`,
      `Payment Status: *${receipt.paymentStatus.toUpperCase()}*`,
      `Payment Mode: *${receipt.paymentMethod.toUpperCase()}*`,
      ``,
      `*Transaction Particulars:*`,
      `• Item: *${receipt.itemTitle}* (Qty: ${receipt.quantity})`,
      `• Unit Price: *${receipt.currency} $${receipt.unitPrice}*`,
      `• Total Settlement: *${receipt.currency} $${receipt.totalAmount}*`,
      `• Collection Trade Hub: *${receipt.collectionHub}*`,
      ``,
      `*Counterparties:*`,
      `• Buyer: *${receipt.buyerName}* (${receipt.buyerPhone})`,
      `• Seller: *${receipt.sellerName}* (${receipt.sellerPhone})`,
      `────────────────────────────────────────`,
      `_ZimBarter Trade Protection & Escrow Desk | Hotline: +263 78 323 7918_`,
    ].join('\n');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 dark:bg-black/85 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-lg bg-white dark:bg-[#07130e] border border-slate-200 dark:border-emerald-500/30 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-150">
        {/* Top Actions Bar */}
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-[#0e4337] flex items-center justify-between bg-slate-50 dark:bg-[#0a2018]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-800 dark:text-emerald-300 uppercase tracking-wider font-mono">
              Official Trade Document
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrint}
              title="Print Receipt"
              className="p-1.5 rounded-xl text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#0e4337] transition-colors"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownloadHtml}
              title="Download Receipt File"
              className="p-1.5 rounded-xl text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#0e4337] transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              title="Close"
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#0e4337] transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Receipt Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-slate-900 dark:text-gray-100">
          {/* Receipt Brand Banner */}
          <div className="text-center pb-4 border-b border-dashed border-slate-300 dark:border-emerald-500/30">
            <div className="inline-flex items-center gap-1.5 font-display font-black text-xl tracking-tight text-slate-900 dark:text-white">
              <span>Zim</span>
              <span className="text-amber-500">Barter</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-mono ml-1 font-bold">
                ZW • VERIFIED
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5">
              Zimbabwe Multi-Currency Trade &amp; Barter Network
            </p>
            <div className="mt-3 inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 font-mono text-xs font-black text-emerald-700 dark:text-emerald-300">
              REF: {receipt.orderReference}
            </div>
            <p className="text-[10px] text-slate-400 dark:text-gray-500 mt-1 font-mono">
              Issued: {receipt.date}
            </p>
          </div>

          {/* Status Strip */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300 block">
                  Payment Status
                </span>
                <span className="text-xs font-black text-emerald-700 dark:text-emerald-300 font-mono">
                  {receipt.paymentStatus} · {receipt.paymentMethod.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Hub</span>
              <span className="text-xs font-bold text-slate-800 dark:text-white">{receipt.collectionHub}</span>
            </div>
          </div>

          {/* Parties: Seller & Buyer Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0c1e17] border border-slate-200 dark:border-[#0e4337]">
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-gray-400 block mb-1">
                Seller
              </span>
              <p className="font-bold text-slate-900 dark:text-white truncate">{receipt.sellerName}</p>
              <p className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px] mt-0.5">
                {receipt.sellerPhone}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-gray-400 flex items-center gap-1 mt-1 truncate">
                <MapPin className="w-3 h-3 text-emerald-500 shrink-0" />
                <span className="truncate">{receipt.sellerLocation}</span>
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0c1e17] border border-slate-200 dark:border-[#0e4337]">
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-gray-400 block mb-1">
                Buyer
              </span>
              <p className="font-bold text-slate-900 dark:text-white truncate">{receipt.buyerName}</p>
              <p className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px] mt-0.5">
                {receipt.buyerPhone}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-gray-400 flex items-center gap-1 mt-1 truncate">
                <MapPin className="w-3 h-3 text-emerald-500 shrink-0" />
                <span className="truncate">{receipt.collectionHub}</span>
              </p>
            </div>
          </div>

          {/* Itemized Line Items */}
          <div className="border border-slate-200 dark:border-[#0e4337] rounded-2xl overflow-hidden text-xs">
            <div className="grid grid-cols-12 bg-slate-100 dark:bg-[#0a2018] px-3.5 py-2 font-bold text-[11px] text-slate-600 dark:text-gray-300">
              <span className="col-span-6">Item / Description</span>
              <span className="col-span-2 text-center">Qty</span>
              <span className="col-span-4 text-right">Price</span>
            </div>
            <div className="grid grid-cols-12 px-3.5 py-3 border-t border-slate-100 dark:border-[#0e4337] items-center">
              <div className="col-span-6 pr-2">
                <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{receipt.itemTitle}</p>
                <p className="text-[10px] text-slate-400 dark:text-gray-400">{receipt.category || 'Marketplace Item'}</p>
              </div>
              <span className="col-span-2 text-center font-mono font-bold text-slate-700 dark:text-gray-300">
                {receipt.quantity}
              </span>
              <span className="col-span-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                ${receipt.subtotal.toFixed(2)} {receipt.currency}
              </span>
            </div>
          </div>

          {/* Pricing Totals */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0c1e17] border border-slate-200 dark:border-[#0e4337] space-y-1.5 font-mono text-xs">
            <div className="flex justify-between text-slate-500 dark:text-gray-400">
              <span>Item Subtotal:</span>
              <span>${receipt.subtotal.toFixed(2)} {receipt.currency}</span>
            </div>
            {receipt.platformFee !== undefined && receipt.platformFee > 0 && (
              <div className="flex justify-between text-slate-500 dark:text-gray-400 text-[11px]">
                <span>Escrow &amp; Trade Verification:</span>
                <span>${receipt.platformFee.toFixed(2)} {receipt.currency}</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-200 dark:border-[#0e4337] flex justify-between font-bold text-sm text-slate-900 dark:text-white">
              <span>Grand Total:</span>
              <span className="text-emerald-600 dark:text-emerald-400 text-base">
                ${receipt.totalAmount.toFixed(2)} {receipt.currency}
              </span>
            </div>
          </div>

          {/* Barcode & Security Stamp Simulation */}
          <div className="pt-2 pb-1 border-t border-dashed border-slate-200 dark:border-[#0e4337] flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <div>
              <p>VERIFIED ZIMBARTER TRADE</p>
              <p className="text-[9px] text-slate-500">Hash: {receipt.orderReference}-ZW-2026</p>
            </div>
            <div className="flex items-center gap-1.5">
              <QrCode className="w-6 h-6 text-emerald-500" />
              <div className="flex flex-col text-[8px] leading-tight font-mono tracking-widest text-slate-400">
                <span>||||||| | |||||</span>
                <span>{receipt.orderReference}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions Drawer */}
        <div className="p-4 border-t border-slate-200 dark:border-[#0e4337] bg-slate-50 dark:bg-[#0a2018] flex flex-wrap gap-2.5">
          <button
            onClick={handleDownloadHtml}
            className="flex-1 min-w-[130px] py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Receipt</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex-1 min-w-[110px] py-2.5 px-3 rounded-xl bg-slate-200 dark:bg-[#0c1e17] hover:bg-slate-300 dark:hover:bg-[#122c22] text-slate-800 dark:text-gray-200 border border-slate-300 dark:border-[#0e4337] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="py-2.5 px-3 rounded-xl bg-[#005c4b] hover:bg-[#00705b] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-300" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function generatePrintableHtml(r: ReceiptData): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>ZimBarter Receipt - ${r.orderReference}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      padding: 30px;
      max-width: 480px;
      margin: 0 auto;
      color: #1a1a1a;
      background: #ffffff;
      line-height: 1.4;
    }
    .brand {
      text-align: center;
      border-bottom: 2px dashed #059669;
      padding-bottom: 16px;
      margin-bottom: 18px;
    }
    .brand h1 {
      margin: 0;
      font-size: 24px;
      color: #062A22;
      letter-spacing: -0.5px;
    }
    .brand h1 span { color: #F5C542; }
    .brand p { margin: 4px 0 0; font-size: 11px; color: #666; }
    .badge {
      display: inline-block;
      margin-top: 8px;
      background: #ecfdf5;
      color: #059669;
      border: 1px solid #a7f3d0;
      font-weight: bold;
      font-size: 12px;
      padding: 3px 10px;
      border-radius: 9999px;
      font-family: monospace;
    }
    .row { display: flex; justify-content: space-between; margin-bottom: 7px; font-size: 13px; }
    .row strong { color: #111; }
    .section-title {
      font-size: 11px;
      text-transform: uppercase;
      font-weight: bold;
      color: #059669;
      margin: 14px 0 6px;
      letter-spacing: 0.5px;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 3px;
    }
    .grid { display: flex; gap: 12px; margin-bottom: 12px; }
    .box { flex: 1; padding: 10px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 12px; }
    .total-row {
      border-top: 2px dashed #059669;
      padding-top: 10px;
      margin-top: 10px;
      font-size: 16px;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      color: #062A22;
    }
    .footer {
      text-align: center;
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid #e5e7eb;
      font-size: 11px;
      color: #666;
    }
    @media print {
      body { padding: 10px; max-width: 100%; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="brand">
    <h1>Zim<span>Barter</span></h1>
    <p>Zimbabwe Multi-Currency Trade &amp; Barter Network</p>
    <div class="badge">OFFICIAL TRADE RECEIPT: #${r.orderReference}</div>
    <div style="font-size: 10px; color: #888; margin-top: 4px; font-family: monospace;">Date: ${r.date}</div>
  </div>

  <div class="grid">
    <div class="box">
      <div style="color: #888; font-size: 10px; font-weight: bold; text-transform: uppercase;">Seller</div>
      <div style="font-weight: bold; font-size: 13px;">${r.sellerName}</div>
      <div style="color: #059669; font-family: monospace;">${r.sellerPhone}</div>
      <div style="color: #666; font-size: 11px;">Location: ${r.sellerLocation}</div>
    </div>
    <div class="box">
      <div style="color: #888; font-size: 10px; font-weight: bold; text-transform: uppercase;">Buyer</div>
      <div style="font-weight: bold; font-size: 13px;">${r.buyerName}</div>
      <div style="color: #059669; font-family: monospace;">${r.buyerPhone}</div>
      <div style="color: #666; font-size: 11px;">Hub: ${r.collectionHub}</div>
    </div>
  </div>

  <div class="section-title">Itemized Purchase</div>
  <div class="row">
    <span>Item:</span>
    <strong>${r.itemTitle} (x${r.quantity})</strong>
  </div>
  <div class="row">
    <span>Payment Method:</span>
    <strong>${r.paymentMethod.toUpperCase()}</strong>
  </div>
  <div class="row">
    <span>Trade Status:</span>
    <strong style="color: #059669;">${r.paymentStatus}</strong>
  </div>

  <div class="row" style="margin-top: 10px;">
    <span>Subtotal:</span>
    <span>$${r.subtotal.toFixed(2)} ${r.currency}</span>
  </div>
  ${r.platformFee ? `<div class="row" style="font-size: 11px; color: #666;"><span>Trade Verification & Escrow:</span><span>$${r.platformFee.toFixed(2)} ${r.currency}</span></div>` : ''}

  <div class="total-row">
    <span>Grand Total:</span>
    <span>$${r.totalAmount.toFixed(2)} ${r.currency}</span>
  </div>

  <div class="footer">
    <p><strong>Thank you for trading on ZimBarter!</strong></p>
    <p>Please present this receipt when collecting your items at <strong>${r.collectionHub}</strong>.</p>
    <p style="font-family: monospace; font-size: 9px; color: #999;">Security Verification Hash: ${r.orderReference}-ZW-2026</p>
  </div>
</body>
</html>`;
}
