'use client'

import { useState } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [supabaseClient] = useState(() => createClientComponentClient());

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </SessionContextProvider>
  );
}