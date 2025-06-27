import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import ConditionalNavigation from '@/components/ConditionalNavigation';
import { ApiProvider } from '@/contexts/ApiContext';
import { WebSocketClientProvider } from '@/contexts/WebSocketContext';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'IsekAI',
  description: 'AI-powered DnD world and character management',
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/logo.png',
    apple: '/icons/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen`}
      >
        <ApiProvider>
          <WebSocketClientProvider>
            <ConditionalNavigation />
            <main>{children}</main>
          </WebSocketClientProvider>
        </ApiProvider>
      </body>
    </html>
  );
}
