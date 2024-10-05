'use client'

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react';

const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [supabaseClient] = useState(() => createClientComponentClient());



  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionContextProvider supabaseClient={supabaseClient}>
          <AuthProvider>
              {children}
          </AuthProvider>
        </SessionContextProvider>
      </body>
    </html>
  );
}