'use client';

import React from 'react';
import AppShell from '@/components/AppShell';
import TradeMessenger from '@/components/TradeMessenger';

export default function MessagesPage() {
  return (
    <AppShell activeNav="Messages">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 w-full">
        <TradeMessenger isModal={false} />
      </div>
    </AppShell>
  );
}

