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
    const handleAuthChange = async (event: string, session: Session | null) => {
      if (event === 'SIGNED_IN' && session) {
        console.log('User signed in:', session.user)
        await router.push('/dashboard')
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out')
        await router.push('/')
      }
    }

    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(handleAuthChange)

    return () => {
      subscription.unsubscribe()
    }
  }, [supabaseClient, router])

  return (
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={serverSession}>
      <AuthProvider initialSession={serverSession}>
        {children}
      </AuthProvider>
    </SessionContextProvider>
  );
}