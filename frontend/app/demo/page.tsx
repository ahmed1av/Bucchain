'use client'

import { useRouter } from 'next/navigation'

export default function DemoPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Interactive Demo</h1>
          <p className="text-xl text-gray-400">Experience BUCChain Platform Features</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          <div 
            className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer group"
            onClick={() => alert('Product Tracking Demo - This would show real product tracking interface')}
          >
            <h3 className="text-xl font-bold text-white mb-3">📦 Product Tracking</h3>
            <p className="text-gray-400 mb-4 group-hover:text-gray-300">Real-time tracking across your entire supply chain</p>
            <button className="w-full px-4 py-2 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 transition-colors">
              View Demo
            </button>
          </div>

          <div 
            className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer group"
            onClick={() => alert('Analytics Demo - This would show advanced analytics dashboard')}
          >
            <h3 className="text-xl font-bold text-white mb-3">📊 Live Analytics</h3>
            <p className="text-gray-400 mb-4 group-hover:text-gray-300">AI-powered insights and predictive analytics</p>
            <button className="w-full px-4 py-2 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 transition-colors">
              View Reports
            </button>
          </div>

          <div 
            className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer group"
            onClick={() => alert('Supplier Network Demo - This would show supplier management interface')}
          >
            <h3 className="text-xl font-bold text-white mb-3">🏭 Supplier Network</h3>
            <p className="text-gray-400 mb-4 group-hover:text-gray-300">Manage and monitor your supplier ecosystem</p>
            <button className="w-full px-4 py-2 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 transition-colors">
              Manage Suppliers
            </button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button 
            onClick={() => router.push('/register')}
            className="px-12 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold text-xl rounded-2xl hover:scale-105 transition-all duration-300"
          >
            🚀 Start Free Trial
          </button>
        </div>
      </div>
    </div>
  )
}
