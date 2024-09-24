
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavbarWrapper from './components/NavWrapper'; // Import the Navbar
import { usePathname } from 'next/navigation'; // Import the hook to get the current path
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'NutriTrack',
  description: 'Track your nutrition and health goals',
  themeColor: '#4caf50',
  manifest: '/manifest.json',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  icons: [
    { rel: 'apple-touch-icon', sizes: '180x180', url: '/logo.jpg' },
    { rel: 'icon', type: 'image/jpg', sizes: '32x32', url: '/logo.jpg' },
    { rel: 'icon', type: 'image/jpg', sizes: '16x16', url: '/logo.jpg' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
