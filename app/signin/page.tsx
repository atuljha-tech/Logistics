'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { GlassPanel } from '@/components/glass-panel'
import { LoadingSpinner } from '@/components/loading-spinner'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      if (email && password.length >= 6) {
        // Derive a display name from the email (part before @)
        const namePart = email.split('@')[0]
        const displayName = namePart
          .replace(/[._-]/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase())
        localStorage.setItem('user_name', displayName)
        localStorage.setItem('user_email', email)
        router.push('/dashboard')
      } else {
        setError('Please enter valid credentials')
      }
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      {/* Background gradient */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-surface" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <h1 className="text-h1 font-h1 text-on-surface">SmartLogistics</h1>
          <p className="text-body-md text-on-surface-variant mt-2">
            Supply Chain Management
          </p>
        </div>

        {/* Form Card */}
        <GlassPanel className="p-8 space-y-6">
          <div>
            <h2 className="text-h2 font-h2 text-on-surface">Sign In</h2>
            <p className="text-body-md text-on-surface-variant mt-2">
              Welcome back to your logistics dashboard
            </p>
          </div>

          {error && (
            <div className="p-4 bg-rose-400/10 border border-rose-400/30 rounded-lg text-rose-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-body-md text-on-surface font-semibold mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3 bg-surface-container border border-white/10 rounded-lg text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-body-md text-on-surface font-semibold mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 bg-surface-container border border-white/10 rounded-lg text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded" />
                <span className="text-on-surface-variant">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 disabled:opacity-50 disabled:cursor-not-allowed text-on-primary font-h3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Signing in...</span>
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-surface text-on-surface-variant">
                New to SmartLogistics?
              </span>
            </div>
          </div>

          {/* Sign Up Link */}
          <Link
            href="/signup"
            className="block w-full px-6 py-3 border border-white/10 hover:border-white/20 text-on-surface font-semibold rounded-lg transition-colors text-center"
          >
            Create Account
          </Link>
        </GlassPanel>

        {/* Footer */}
        <p className="text-center text-sm text-on-surface-variant mt-8">
          By signing in, you agree to our{' '}
          <Link href="#" className="text-primary hover:text-primary/80">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="#" className="text-primary hover:text-primary/80">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}
