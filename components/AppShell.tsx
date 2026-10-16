'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import MobileNav from '@/components/MobileNav';
import WhatsAppSimulatorModal from '@/components/WhatsAppSimulatorModal';
import { X } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
  activeNav?: string;
  onSelectNav?: (item: string) => void;
  searchTerm?: string;
  onSearchChange?: (val: string) => void;
  selectedLocation?: string;
  onSelectLocation?: (loc: string) => void;
  favoritesCount?: number;
}

export default function AppShell({
  children,
  activeNav,
  onSelectNav,
  searchTerm = '',
  onSearchChange,
  selectedLocation = 'Harare',
  onSelectLocation,
  favoritesCount = 0,
}: AppShellProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#F5F7F5] dark:bg-[#070d09] text-slate-900 dark:text-gray-100 transition-colors duration-300">
      {/* Desktop Fixed Left Sidebar */}
      <div className="hidden lg:block sticky top-0 h-screen z-30">
        <Sidebar
          activeNav={activeNav}
          onSelectNav={onSelectNav}
          onOpenMessages={() => setWhatsAppModalOpen(true)}
          favoritesCount={favoritesCount}
        />
      </div>

      {/* Mobile Slide-over Drawer for Sidebar */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative z-10 w-64 max-w-[85vw] bg-[#062A22] h-full shadow-2xl flex flex-col justify-between">
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute top-4 right-3 p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-[#0a3a30]"
              aria-label="Close Sidebar"
            >
              <X className="w-5 h-5" />
            </button>
            <Sidebar
              activeNav={activeNav}
              onSelectNav={(item) => {
                setMobileSidebarOpen(false);
                if (onSelectNav) onSelectNav(item);
              }}
              onOpenMessages={() => {
                setMobileSidebarOpen(false);
                setWhatsAppModalOpen(true);
              }}
              favoritesCount={favoritesCount}
            />
          </div>
        </div>
      )}

      {/* Right Column: TopBar + Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation Bar */}
        <TopBar
          onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          selectedLocation={selectedLocation}
          onSelectLocation={onSelectLocation}
        />

        {/* Page Content */}
        <main className="flex-1 pb-20 lg:pb-10">
          {children}
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <MobileNav onOpenMessages={() => setWhatsAppModalOpen(true)} />
      </div>

      {/* WhatsApp Messages Simulator Modal */}
      <WhatsAppSimulatorModal
        isOpen={whatsAppModalOpen}
        onClose={() => setWhatsAppModalOpen(false)}
      />
    </div>
  );
}
