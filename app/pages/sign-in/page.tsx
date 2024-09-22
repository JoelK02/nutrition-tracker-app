"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation' // Use next/navigation in Next.js 13+
import { ArrowLeft, Facebook, Twitter, Github } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from '@/lib/supabaseClient' // Import Supabase client

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter() // To handle redirects

  const handleSignIn = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      // Redirect to dashboard or homepage after successful sign-in
      router.push('/pages/dashboard') // Adjust the path as necessary
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <a href="/" className="flex items-center justify-center text-green-500 mb-4">
          <ArrowLeft className="h-6 w-6 mr-2" />
          <span className="text-gray-900">Back to Home</span>
        </a>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to NutriTrack</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <a href="#" className="font-medium text-green-600 hover:text-green-500">
            start your 14-day free trial
          </a>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSignIn}>
            <div>
              <Label htmlFor="email">Email address</Label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="mt-1">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && <div className="text-red-500">{error}</div>}

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-green-600 hover:text-green-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <Button type="submit" className="w-full flex justify-center py-2 px-4" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <div>
                <Button variant="outline" className="w-full flex items-center justify-center">
                  <Facebook className="h-5 w-5 text-blue-600" />
                  <span className="sr-only">Sign in with Facebook</span>
                </Button>
              </div>
              <div>
                <Button variant="outline" className="w-full flex items-center justify-center">
                  <Twitter className="h-5 w-5 text-blue-400" />
                  <span className="sr-only">Sign in with Twitter</span>
                </Button>
              </div>
              <div>
                <Button variant="outline" className="w-full flex items-center justify-center">
                  <Github className="h-5 w-5 text-gray-900" />
                  <span className="sr-only">Sign in with GitHub</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-center text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <a href="/pages/sign-up" className="font-medium text-green-600 hover:text-green-500">
                Register here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
