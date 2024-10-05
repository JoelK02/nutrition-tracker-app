'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !session) {
      router.push('/')
    }
  }, [session, loading, router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!session) {
    return null // or a loading spinner if you prefer
  }

  return <>{children}</>
}