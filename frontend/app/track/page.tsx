'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'
import { apiService } from '../services/api'

interface TrackingEvent {
  id: string;
  location: string;
  status: string;
  timestamp: string;
  description: string;
}

export default function TrackPage() {
  const router = useRouter()
  const [trackingId, setTrackingId] = useState('BUC-12345')
  const [trackingData, setTrackingData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleTrack = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!trackingId.trim()) return

    setLoading(true)
    setError(null)

    try {
      console.log('🔍 Tracking:', trackingId)
      const data = await apiService.trackProduct(trackingId)
      console.log('📦 Tracking Data:', data)
      setTrackingData(data)
    } catch (err) {
      console.error('❌ Tracking error:', err)
      setError('Failed to track product')
    } finally {
      setLoading(false)
    }
  }, [trackingId])

  useEffect(() => {
    handleTrack()
  }, [handleTrack])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    const statusColors: { [key: string]: string } = {
      'Manufactured': 'bg-blue-500/20 text-blue-400',
      'Shipped': 'bg-yellow-500/20 text-yellow-400',
      'Customs Clearance': 'bg-orange-500/20 text-orange-400',
      'Arrived': 'bg-purple-500/20 text-purple-400',
      'In Storage': 'bg-green-500/20 text-green-400',
      'Delivered': 'bg-emerald-500/20 text-emerald-400'
    }
    return statusColors[status] || 'bg-gray-500/20 text-gray-400'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Product Tracking</h1>
            <p className="text-gray-400 mt-2">Real-time tracking across your supply chain</p>
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>

        <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 mb-8">
          <h2 className="text-2xl font-bold mb-4">Track Your Product</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter tracking ID (e.g., BUC-12345)"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
            />
            <button
              onClick={handleTrack}
              disabled={loading}
              className="px-6 py-3 bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors font-semibold disabled:opacity-50"
            >
              {loading ? 'Tracking...' : 'Track'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-xl p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {trackingData && (
          <div className="space-y-6">
            {/* Product Info */}
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">
                  {trackingData.product?.name || 'Product'}
                </h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trackingData.product?.status)
                  }`}>
                  {trackingData.product?.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-semibold text-gray-400">Tracking ID:</span>
                  <p className="text-white">{trackingData.product?.id}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-400">Current Location:</span>
                  <p className="text-white">{trackingData.product?.location}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-400">Description:</span>
                  <p className="text-white">{trackingData.product?.description}</p>
                </div>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-6">
                Tracking History ({trackingData.tracking?.length || 0} events)
              </h3>

              <div className="space-y-4">
                {trackingData.tracking?.map((event: TrackingEvent, index: number) => (
                  <div key={event.id} className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-green-500' : 'bg-cyan-500'
                        }`} />
                      {index < (trackingData.tracking.length - 1) && (
                        <div className="w-0.5 h-16 bg-cyan-500/30 mt-1" />
                      )}
                    </div>

                    <div className="flex-1 pb-6">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-lg">{event.status}</h4>
                        <span className="text-sm text-gray-400">
                          {formatDate(event.timestamp)}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-2">{event.description}</p>
                      <p className="text-sm text-gray-400">📍 {event.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!trackingData && !loading && !error && (
          <div className="text-center text-gray-400 mt-12">
            <p>💡 Enter a tracking number to see product status</p>
          </div>
        )}
      </div>
    </div>
  )
}
