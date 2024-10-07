"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Mail } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/contexts/AuthContext'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { session } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.push('/dashboard')
    }
  }, [session, router])

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      router.push('/pages/dashboard')
    }

    setLoading(false)
  }

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) {
      console.error('Error signing in with Google:', error)
      setError(error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white p-4 flex items-center">
        <Button variant="ghost" size="icon" onClick={() => router.push('/')}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-semibold ml-4">Sign In</h1>
      </header>

      <main className="flex-grow flex flex-col justify-center px-4 py-8">
        <form onSubmit={handleSignIn} className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-base">Email address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 h-12"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-base">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 h-12"
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <div className="mt-6">
          <Button variant="outline" className="w-full h-12 text-base">
            <Mail className="mr-2 h-5 w-5" />
            Continue with Email
          </Button>
        </div>

        <div className="mt-6 text-center">
          <a href="#" className="text-sm text-green-600 hover:text-green-500">
            Forgot your password?
          </a>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <a href="/pages/sign-up" className="font-medium text-green-600 hover:text-green-500">
              Sign up
            </a>
          </p>
        </div>

        <div className="mt-6">
          <Button 
            onClick={handleGoogleSignIn} 
            variant="outline" 
            className="w-full h-12 text-base flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              {/* Google logo SVG */}
            </svg>
            Continue with Google
          </Button>
        </div>
      </main>
    </div>
  )
}