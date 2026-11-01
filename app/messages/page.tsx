'use client';

import React from 'react';
import AppShell from '@/components/AppShell';
import AuthGate from '@/components/AuthGate';
import TradeMessenger from '@/components/TradeMessenger';
import { MessageCircle } from 'lucide-react';

export default function MessagesPage() {
  return (
    <AppShell activeNav="Messages">
      <AuthGate
        featureName="Messages & Trade Chats"
        description="Private trade negotiations and escrow dispute channels are restricted to verified members. Sign in to chat directly with sellers and buyers."
        icon={MessageCircle}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 w-full">
          <TradeMessenger isModal={false} />
        </div>
      </AuthGate>
    </AppShell>
  );
}

