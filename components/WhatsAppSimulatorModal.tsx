'use client';

import React from 'react';
import TradeMessengerModal from './TradeMessengerModal';

interface WhatsAppSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onListingCreated?: (listingId: string) => void;
  initialListingId?: string;
}

export default function WhatsAppSimulatorModal({
  isOpen,
  onClose,
  initialListingId,
}: WhatsAppSimulatorModalProps) {
  return (
    <TradeMessengerModal
      isOpen={isOpen}
      onClose={onClose}
      initialListingId={initialListingId}
    />
  );
}
