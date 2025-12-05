'use client'

import { useRouter, usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  Search,
  Factory,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (path: string) => pathname === path

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/products', label: 'Products', icon: Package },
    { path: '/track', label: 'Tracking', icon: Search },
    { path: '/suppliers', label: 'Suppliers', icon: Factory },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  ]

  return (
    <nav className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => router.push('/')}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 group-hover:scale-105 transition-transform">
              <span className="font-bold text-white text-sm">BUC</span>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              BUC<span className="text-cyan-400">Chain</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          {pathname !== '/' && pathname !== '/login' && pathname !== '/register' && (
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${isActive(item.path)
                    ? 'bg-cyan-500/10 text-cyan-400 font-medium'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </div>
          )}

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            {pathname === '/' ? (
              <>
                <button
                  onClick={() => router.push('/login')}
                  className="hidden md:block px-4 py-2 text-gray-300 hover:text-white transition-colors font-medium"
                >
                  Sign In
                </button>
                <button
                  onClick={() => router.push('/demo')}
                  className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-cyan-500/20 hover:scale-105 transition-all duration-300"
                >
                  Live Demo
                </button>
              </>
            ) : pathname !== '/login' && pathname !== '/register' ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => router.push('/settings')}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
                  title="Settings"
                >
                  <Settings className="w-5 h-5" />
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>

                {/* Mobile Menu Button */}
                <button
                  className="md:hidden p-2 text-gray-400 hover:text-white"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            ) : null}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && pathname !== '/' && pathname !== '/login' && pathname !== '/register' && (
          <div className="md:hidden py-4 border-t border-gray-800 animate-slide-in">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    router.push(item.path)
                    setIsMobileMenuOpen(false)
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive(item.path)
                    ? 'bg-cyan-500/10 text-cyan-400'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
