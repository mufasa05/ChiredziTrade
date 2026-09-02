import type { Metadata, Viewport } from 'next';
import './globals.css';
import Footer from '@/components/Footer';
import Script from 'next/script';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';
import AuthModal from '@/components/AuthModal';

export const viewport: Viewport = {
  themeColor: '#2e7c48',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'ChiredziTrade - Lowveld Multi-Currency & Barter Marketplace',
  description: 'Localized trade engine for Chiredzi, Hippo Valley, Triangle, and Mkwasine. Trade cattle, farm produce, borehole pumps, welding, and cane haulage via WhatsApp and Web PWA.',
  keywords: ['Chiredzi', 'Hippo Valley', 'Triangle', 'Mkwasine', 'Lowveld Zimbabwe', 'Cattle Barter', 'Cane Haulage', 'Tshovani Trades'],
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Permanent Baseline CSS Fallback - Prevents unstyled white screens even if dev cache fails */}
        <style dangerouslySetInnerHTML={{ __html: `
          html, body {
            background-color: #070d09 !important;
            color: #f1f5f3 !important;
            font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
            margin: 0;
            padding: 0;
            overflow-x: hidden;
            max-width: 100vw;
            width: 100%;
          }
          a { color: inherit; text-decoration: none; }
          * { box-sizing: border-box; }
        ` }} />
        {/* CSS Auto-Recovery Script */}
        <Script id="css-recovery" strategy="beforeInteractive">
          {`
            window.addEventListener('error', function(e) {
              if (e.target && e.target.tagName === 'LINK' && e.target.rel === 'stylesheet') {
                console.warn('Stylesheet 404 detected, triggering CSS auto-recovery...');
                setTimeout(function() { window.location.reload(); }, 500);
              }
            }, true);
          `}
        </Script>
      </head>
      <body className="min-h-screen flex flex-col bg-[#070d09] text-gray-100 antialiased selection:bg-emerald-500 selection:text-white">
        <LanguageProvider>
          <AuthProvider>
            <div className="flex-1 flex flex-col">
              {children}
            </div>
            <Footer />
            <AuthModal />
          </AuthProvider>
        </LanguageProvider>

        {/* Register PWA Service Worker */}
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(
                  function(registration) {
                    console.log('ChiredziTrade PWA ServiceWorker registered with scope:', registration.scope);
                  },
                  function(err) {
                    console.log('ServiceWorker registration failed:', err);
                  }
                );
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
