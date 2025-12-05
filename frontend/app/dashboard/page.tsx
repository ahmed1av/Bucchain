'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { apiService } from '../services/api'
import { useAuth } from '@/context/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'

function DashboardContent() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeShipments: 0,
    supplierNetwork: 0,
    onTimeRate: '0%'
  })
  const [loading, setLoading] = useState(true)
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking')

  useEffect(() => {
    checkBackendStatus()
    loadDashboardData()
  }, [])

  const checkBackendStatus = async () => {
    try {
      await apiService.getHealth()
      setBackendStatus('connected')
    } catch (error) {
      setBackendStatus('disconnected')
    }
  }

  const loadDashboardData = async () => {
    try {
      const result = await apiService.getDashboard()
      console.log('Dashboard data:', result)
      if (result.stats) {
        setStats(result.stats)
      }
    } catch (error) {
      console.error('Failed to load dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    { icon: '📦', title: 'Products', description: 'Manage inventory', path: '/products' },
    { icon: '🔍', title: 'Track', description: 'Real-time tracking', path: '/track' },
    { icon: '🏭', title: 'Suppliers', description: 'Supplier network', path: '/suppliers' },
    { icon: '📊', title: 'Analytics', description: 'AI insights', path: '/analytics' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Status and User Info */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
            <p className="text-gray-400">Your supply chain management dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-lg ${backendStatus === 'connected' ? 'bg-green-500/20 text-green-400' :
              backendStatus === 'disconnected' ? 'bg-red-500/20 text-red-400' :
                'bg-yellow-500/20 text-yellow-400'
              }`}>
              {backendStatus === 'connected' && '✅ Backend Connected'}
              {backendStatus === 'disconnected' && '❌ Backend Disconnected'}
              {backendStatus === 'checking' && '🔄 Checking Status...'}
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
            <h3 className="text-cyan-400 font-semibold mb-2">Total Products</h3>
            <p className="text-3xl font-bold">{loading ? '...' : stats.totalProducts}</p>
          </div>

          <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
            <h3 className="text-green-400 font-semibold mb-2">Active Shipments</h3>
            <p className="text-3xl font-bold">{loading ? '...' : stats.activeShipments}</p>
          </div>

          <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
            <h3 className="text-purple-400 font-semibold mb-2">Supplier Network</h3>
            <p className="text-3xl font-bold">{loading ? '...' : stats.supplierNetwork}</p>
          </div>

          <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
            <h3 className="text-yellow-400 font-semibold mb-2">On-Time Rate</h3>
            <p className="text-3xl font-bold">{loading ? '...' : stats.onTimeRate}</p>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sales Analytics */}
          <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="text-green-400">📈</span> Sales Analytics
            </h2>
            <div className="h-64 flex items-end justify-between gap-2 px-2">
              {[35, 45, 30, 60, 75, 50, 65, 80, 70, 90, 85, 95].map((h, i) => (
                <div key={i} className="w-full bg-gray-700/30 rounded-t-lg relative group hover:bg-green-500/20 transition-colors">
                  <div
                    className="absolute bottom-0 w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t-lg transition-all duration-500"
                    style={{ height: `${h}%` }}
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-xs py-1 px-2 rounded border border-gray-700 whitespace-nowrap z-10">
                      ${h}k Revenue
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-sm text-gray-400">
              <span>Jan</span>
              <span>Jun</span>
              <span>Dec</span>
            </div>
          </div>

          {/* Inventory Analytics */}
          <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="text-blue-400">📊</span> Inventory Distribution
            </h2>
            <div className="space-y-4">
              {[
                { label: 'Electronics', value: 45, color: 'bg-blue-500' },
                { label: 'Biotech Components', value: 30, color: 'bg-purple-500' },
                { label: 'Quantum Materials', value: 15, color: 'bg-cyan-500' },
                { label: 'Packaging', value: 10, color: 'bg-yellow-500' },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{item.label}</span>
                    <span className="font-medium">{item.value}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <h3 className="text-sm font-semibold text-gray-400 mb-3">User Behavior Heatmap</h3>
              <div className="grid grid-cols-12 gap-1">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div
                    key={i}
                    className={`aspect-square rounded-sm ${Math.random() > 0.7 ? 'bg-green-500/80' :
                        Math.random() > 0.4 ? 'bg-green-500/40' :
                          'bg-gray-700/30'
                      }`}
                    title="User Activity"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 mb-8">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => router.push(action.path)}
                className="p-4 bg-gray-700/50 rounded-xl border border-gray-600 hover:border-cyan-500/50 hover:bg-gray-700 transition-all duration-300 group text-left"
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
                  {action.icon}
                </div>
                <h3 className="font-semibold text-white mb-1">{action.title}</h3>
                <p className="text-sm text-gray-400">{action.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4">System Status</h2>
            <div className="space-y-3">
              {[
                { service: 'Frontend Application', status: '🟢 Online', details: 'Next.js 14' },
                { service: 'Backend API', status: backendStatus === 'connected' ? '🟢 Online' : '🔴 Offline', details: 'Nest.js' },
                { service: 'Database', status: '🟢 Connected', details: 'SQLite' },
                { service: 'Blockchain Network', status: '🟡 Testing', details: 'Ethereum/Polygon' },
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                  <div>
                    <div className="font-medium">{item.service}</div>
                    <div className="text-sm text-gray-400">{item.details}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${item.status.includes('🟢') ? 'bg-green-500/20 text-green-400' :
                    item.status.includes('🔴') ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {[
                { action: 'New product added to blockchain', time: '2 min ago', type: 'blockchain' },
                { action: 'Shipment status updated', time: '1 hour ago', type: 'success' },
                { action: 'Supplier verification completed', time: '3 hours ago', type: 'info' },
                { action: 'Inventory synchronized', time: '5 hours ago', type: 'success' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-gray-700/30 rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'blockchain' ? 'bg-purple-500' : 'bg-cyan-500'
                    }`}></div>
                  <div className="flex-1">
                    <div className="font-medium">{activity.action}</div>
                    <div className="text-sm text-gray-400">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
