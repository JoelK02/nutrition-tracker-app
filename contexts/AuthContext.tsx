'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { Session, User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({ user: null, session: null, loading: true })

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const session = useSession()
  const supabase = useSupabaseClient()
  const [user, setUser] = useState<User | null>(session?.user ?? null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('AuthProvider useEffect - session:', session)
    if (session) {
      setUser(session.user)
    } else {
      setUser(null)
    }
    setLoading(false)
  }, [session])

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabase.auth])

  return (
    <AuthContext.Provider value={{ user, session, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)