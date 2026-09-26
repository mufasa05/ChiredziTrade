import type { Metadata, Viewport } from 'next';
import './globals.css';
import Footer from '@/components/Footer';
import Script from 'next/script';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import AuthModal from '@/components/AuthModal';

export const viewport: Viewport = {
  themeColor: '#2e7c48',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'Zim Barter - Zimbabwe Barter, Goods & Artisan Trades Engine',
  description: 'Nationwide marketplace for Zimbabwe. Swap goods, farm produce, livestock, hardware, solar, and artisan services via WhatsApp and Web PWA across Harare, Bulawayo, Mutare, Masvingo, Chiredzi & nationwide.',
  keywords: ['Zim Barter', 'Zimbabwe Barter', 'Harare Marketplace', 'Bulawayo Barter', 'Masvingo Trades', 'Chiredzi Trade', 'Cattle Barter Zimbabwe', 'ZWG USD Barter'],
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
        {/* Permanent Baseline CSS Fallback & Theme Baseline */}
        <style dangerouslySetInnerHTML={{ __html: `
          html, body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            margin: 0;
            padding: 0;
            overflow-x: hidden;
            max-width: 100vw;
            width: 100%;
          }
          html.dark, html.dark body {
            background-color: #070d09;
            color: #f1f5f3;
          }
          html.light, html.light body {
            background-color: #f4f8f5;
            color: #0f1d13;
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
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070d09] text-slate-900 dark:text-gray-100 antialiased selection:bg-emerald-500 selection:text-white transition-colors duration-300">
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <div className="flex-1 flex flex-col">
                {children}
              </div>
              <Footer />
              <AuthModal />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>

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
