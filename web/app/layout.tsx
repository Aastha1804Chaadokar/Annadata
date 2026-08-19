import React from 'react';
import './globals.css';

export const metadata = {
  title: 'Annadata - Har Kisan, Har Fasal, Har Faisla.',
  description: 'India-focused agriculture technology platform foundation.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
