'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/components/ui/Toast'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await login(email, password)
      toast.success('Login successful!')
      router.push('/dashboard')
    } catch (err) {
      console.error('Login failed:', err)
      toast.error(err instanceof Error ? err.message : 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-900/5 to-transparent pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary mb-6 shadow-lg shadow-primary/20">
            <span className="font-bold text-white text-xl tracking-tighter">BUC</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Welcome back</h2>
          <p className="text-gray-400 text-sm">Sign in to your enterprise account</p>
        </div>

        <div className="bg-[#111625] border border-white/5 rounded-xl p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#0B0F19] border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#0B0F19] border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg shadow-lg shadow-primary/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 text-sm"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <p className="text-gray-500 text-sm">
              Don&apos;t have an account?{' '}
              <button
                onClick={() => router.push('/register')}
                className="text-primary hover:text-primary-hover font-medium transition-colors"
                disabled={loading}
              >
                Contact Sales
              </button>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-gray-600">
          &copy; 2025 BUCChain Inc. All rights reserved.
        </div>
      </div>
    </div>
  )
}
