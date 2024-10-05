import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from './ClientLayout';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'NutriTrack',
  description: 'Track your nutrition and health goals',
  themeColor: '#4caf50',
  manifest: '/manifest.json',
  viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
  icons: [
    { rel: 'apple-touch-icon', sizes: '180x180', url: '/logo.jpg' },
    { rel: 'icon', type: 'image/jpg', sizes: '32x32', url: '/logo.jpg' },
    { rel: 'icon', type: 'image/jpg', sizes: '16x16', url: '/logo.jpg' },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  console.log('RootLayout server-side session:', session) // Add this log

  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout  serverSession={session}>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}