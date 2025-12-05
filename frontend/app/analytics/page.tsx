'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { apiService } from '../services/api'

export default function AnalyticsPage() {
  const router = useRouter()
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      const result = await apiService.getMetrics()
      console.log('Analytics API Response:', result)
      setAnalyticsData(result.metrics) // استخدم metrics بدل data
    } catch (err: any) {
      setError(err.message || 'Failed to load analytics')
      console.error('Analytics error:', err)
    } finally {
      setLoading(false)
    }
  }

  const metrics = [
    { name: 'On-Time Delivery', value: '98.2%', change: '+2.1%', positive: true },
    { name: 'Order Accuracy', value: '99.7%', change: '+0.3%', positive: true },
    { name: 'Inventory Turnover', value: '8.5x', change: '+1.2x', positive: true },
    { name: 'Supplier Performance', value: '94.8%', change: '-0.5%', positive: false },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Advanced Analytics</h1>
            <p className="text-gray-400 mt-2">AI-powered insights and performance metrics</p>
          </div>
          <button 
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading analytics...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
              <h3 className="text-gray-400 font-semibold mb-2">{metric.name}</h3>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-bold">{metric.value}</p>
                <span className={`px-2 py-1 rounded text-sm font-semibold ${
                  metric.positive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {metric.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold mb-6">Delivery Performance</h2>
            <div className="space-y-4">
              {['Last 7 Days', 'Last 30 Days', 'Last Quarter'].map((period, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-400">{period}</span>
                  <div className="flex items-center gap-4">
                    <div className="w-32 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-cyan-500 h-2 rounded-full" 
                        style={{ width: `${90 + index * 3}%` }}
                      ></div>
                    </div>
                    <span className="font-semibold">{90 + index * 3}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold mb-6">AI Predictions</h2>
            <div className="space-y-4">
              {[
                { prediction: 'Demand Increase', confidence: '87%', impact: 'High' },
                { prediction: 'Shipping Delay', confidence: '92%', impact: 'Medium' },
                { prediction: 'Price Fluctuation', confidence: '78%', impact: 'Low' },
              ].map((item, index) => (
                <div key={index} className="p-4 bg-gray-700/30 rounded-lg">
                  <div className="font-medium mb-2">{item.prediction}</div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">AI Confidence</div>
                    <div className="text-cyan-400 font-semibold">{item.confidence}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
          <h2 className="text-2xl font-bold mb-6">Recent Alerts</h2>
          <div className="space-y-3">
            {[
              { type: 'warning', message: 'Low stock alert for MacBook Pro M3', time: '2 hours ago' },
              { type: 'info', message: 'New supplier onboarding completed', time: '5 hours ago' },
              { type: 'success', message: 'Shipment arrived at destination', time: '1 day ago' },
            ].map((alert, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-gray-700/30 rounded-lg">
                <div className={`w-3 h-3 rounded-full ${
                  alert.type === 'warning' ? 'bg-yellow-500' :
                  alert.type === 'info' ? 'bg-cyan-500' : 'bg-green-500'
                }`}></div>
                <div className="flex-1">
                  <div className="font-semibold">{alert.message}</div>
                  <div className="text-sm text-gray-400">{alert.time}</div>
                </div>
                <button className="text-cyan-400 hover:text-cyan-300 text-sm">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
