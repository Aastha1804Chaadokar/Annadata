import React from 'react';
import './globals.css';
import { Navbar } from '@/components/navbar/Navbar';
import { Footer } from '@/components/footer/Footer';

import { I18nProvider } from '@/components/i18n/I18nProvider';

export const metadata = {
  title: 'Annadata (अन्नदाता) — Har Kisan, Har Fasal, Har Faisla.',
  description:
    'Smarter agricultural decisions for Indian farmers. Soil health intelligence, crop recommendations, weather guidance, and AI voice assistance.',
  keywords: [
    'Annadata',
    'Agritech India',
    'Farmers',
    'Soil Health Card',
    'Crop Recommendation',
    'Indian Agriculture',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1B4332" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Annadata" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased flex flex-col min-h-screen bg-[#F8FAF3]" suppressHydrationWarning>
        <I18nProvider>
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
