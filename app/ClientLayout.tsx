'use client'

import { useState, useEffect } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';

export default function ClientLayout({ 
  children,
  serverSession
}: { 
  children: React.ReactNode,
  serverSession: Session | null
}) {
  const [supabaseClient] = useState(() => createClientComponentClient());
  const router = useRouter();

  useEffect(() => {
    console.log('ClientLayout useEffect - serverSession:', serverSession)
    if (serverSession) {
      console.log('User is signed in:', serverSession.user)
      if (window.location.pathname === '/') {
        router.push('/dashboard')
      }
    } else {
      console.log('No user signed in')
      if (window.location.pathname !== '/') {
        router.push('/')
      }
    }
  }, [serverSession, router])

  return (
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={serverSession}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </SessionContextProvider>
  );
}