'use client';

import React, { useEffect } from 'react';
import TradeMessenger from './TradeMessenger';
import { X } from 'lucide-react';

interface TradeMessengerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialListingId?: string;
}

export default function TradeMessengerModal({
  isOpen,
  onClose,
  initialListingId,
}: TradeMessengerModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/75 backdrop-blur-md animate-fade-in"
    >
      <div className="relative w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-[#0e4337] bg-white dark:bg-[#07130e]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 dark:bg-[#0a2e24] text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          aria-label="Close message window"
        >
          <X className="w-5 h-5" />
        </button>

        <TradeMessenger
          initialListingId={initialListingId}
          onClose={onClose}
          isModal={true}
        />
      </div>
    </div>
  );
}

