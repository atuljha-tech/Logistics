'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { GlassPanel } from '@/components/glass-panel'
import { LoadingSpinner } from '@/components/loading-spinner'
import { User, Mail, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react'

export default function SignUpPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.includes('@')) {
      newErrors.email = 'Please enter a valid email'
    }

    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      localStorage.setItem('user_name', formData.name.trim())
      localStorage.setItem('user_email', formData.email.trim())
      router.push('/dashboard')
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
            <h2 className="text-h2 font-h2 text-on-surface">Create Account</h2>
            <p className="text-body-md text-on-surface-variant mt-2">
              Join the supply chain revolution
            </p>
          </div>

          {error && (
            <div className="p-4 bg-rose-400/10 border border-rose-400/30 rounded-lg text-rose-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-body-md text-on-surface font-semibold mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="John Doe"
                  className={`w-full pl-12 pr-4 py-3 bg-surface-container border rounded-lg text-on-surface placeholder:text-on-surface-variant focus:outline-none transition-colors ${
                    errors.name ? 'border-rose-400/50' : 'border-white/10 focus:border-primary/50'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-rose-400 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-body-md text-on-surface font-semibold mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="you@example.com"
                  className={`w-full pl-12 pr-4 py-3 bg-surface-container border rounded-lg text-on-surface placeholder:text-on-surface-variant focus:outline-none transition-colors ${
                    errors.email ? 'border-rose-400/50' : 'border-white/10 focus:border-primary/50'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-rose-400 text-sm mt-1">{errors.email}</p>
              )}
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
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-3 bg-surface-container border rounded-lg text-on-surface placeholder:text-on-surface-variant focus:outline-none transition-colors ${
                    errors.password ? 'border-rose-400/50' : 'border-white/10 focus:border-primary/50'
                  }`}
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
              {errors.password && (
                <p className="text-rose-400 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-body-md text-on-surface font-semibold mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-3 bg-surface-container border rounded-lg text-on-surface placeholder:text-on-surface-variant focus:outline-none transition-colors ${
                    errors.confirmPassword ? 'border-rose-400/50' : 'border-white/10 focus:border-primary/50'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  {showConfirm ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-rose-400 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms Checkbox */}
            <label className="flex items-start gap-3 cursor-pointer mt-6">
              <input type="checkbox" className="w-4 h-4 rounded mt-1" required />
              <span className="text-sm text-on-surface-variant">
                I agree to the{' '}
                <Link href="#" className="text-primary hover:text-primary/80">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="#" className="text-primary hover:text-primary/80">
                  Privacy Policy
                </Link>
              </span>
            </label>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 disabled:opacity-50 disabled:cursor-not-allowed text-on-primary font-h3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Creating account...</span>
                </>
              ) : (
                'Create Account'
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
                Already have an account?
              </span>
            </div>
          </div>

          {/* Sign In Link */}
          <Link
            href="/signin"
            className="block w-full px-6 py-3 border border-white/10 hover:border-white/20 text-on-surface font-semibold rounded-lg transition-colors text-center"
          >
            Sign In
          </Link>
        </GlassPanel>
      </div>
    </div>
  )
}
