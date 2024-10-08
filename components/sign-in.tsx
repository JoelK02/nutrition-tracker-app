'use client'

import React from 'react'
import { ArrowLeft, Facebook, Twitter, Github } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SignInComponent() {
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
          <form className="space-y-6" action="#" method="POST">
            <div>
              <Label htmlFor="email">Email address</Label>
              <div className="mt-1">
                <Input id="email" name="email" type="email" autoComplete="email" required />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="mt-1">
                <Input id="password" name="password" type="password" autoComplete="current-password" required />
              </div>
            </div>

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
              <Button type="submit" className="w-full flex justify-center py-2 px-4">
                Sign in
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
        </div>
      </div>
    </div>
  )
}