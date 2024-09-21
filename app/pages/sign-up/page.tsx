"use client"

import React, { useState } from 'react'
import { ArrowLeft, Facebook, Twitter, Github } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from '@/lib/supabaseClient' // Import the Supabase client

import { useRouter } from 'next/navigation'



export default function Register() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignUp = async (e) => {
    e.preventDefault()
    if (password !== passwordConfirm) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signUp({
      email,
      password
    }, {
      data: { full_name: name }
    })

    if (error) {
      setError(error.message)
    } else {
      // Success - you can redirect the user or show a success message
      // Redirect to /page/sign-in.
      alert('Check your email to confirm your sign-up!')
      router.push('/pages/sign-in') // Redirect to sign-in page

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
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          And start your journey to better health
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSignUp}>
            <div>
              <Label htmlFor="name">Full Name</Label>
              <div className="mt-1">
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

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
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password-confirm">Confirm Password</Label>
              <div className="mt-1">
                <Input
                  id="password-confirm"
                  name="password-confirm"
                  type="password"
                  autoComplete="new-password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && <div className="text-red-500">{error}</div>}

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                I agree to the{' '}
                <a href="#" className="font-medium text-green-600 hover:text-green-500">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="font-medium text-green-600 hover:text-green-500">
                  Privacy Policy
                </a>
              </label>
            </div>

            <div>
              <Button type="submit" className="w-full flex justify-center py-2 px-4" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
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
                  <span className="sr-only">Sign up with Facebook</span>
                </Button>
              </div>
              <div>
                <Button variant="outline" className="w-full flex items-center justify-center">
                  <Twitter className="h-5 w-5 text-blue-400" />
                  <span className="sr-only">Sign up with Twitter</span>
                </Button>
              </div>
              <div>
                <Button variant="outline" className="w-full flex items-center justify-center">
                  <Github className="h-5 w-5 text-gray-900" />
                  <span className="sr-only">Sign up with GitHub</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/pages/sign-in" className="font-medium text-green-600 hover:text-green-500">
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
