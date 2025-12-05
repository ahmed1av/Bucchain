'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/components/ui/Toast'

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const toast = useToast()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await register(form.email, form.password, form.name)
      toast.success('Registration successful!')
      router.push('/dashboard')
    } catch (err) {
      console.error('Registration failed:', err)
      toast.error(err instanceof Error ? err.message : 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="glass rounded-3xl p-8 shadow-2xl border border-white/10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="font-bold text-white text-2xl">BUC</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-white/60">Start your BUCChain journey</p>
        </div>


        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
            minLength={2}
            disabled={loading}
          />
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
            disabled={loading}
          />
          <input
            type="password"
            name="password"
            placeholder="Create password (min 6 characters)"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
            minLength={6}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="text-center text-white/60 mt-6">
          Already have an account?{" "}
          <button
            onClick={() => router.push('/login')}
            className="text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer"
            disabled={loading}
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  )
}
