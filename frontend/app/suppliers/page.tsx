'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { apiService } from '../services/api'

export default function SuppliersPage() {
  const router = useRouter()
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadSuppliers()
  }, [])

  const loadSuppliers = async () => {
    try {
      setLoading(true)
      const result = await apiService.getSuppliers()
      console.log('Suppliers API Response:', result)
      setSuppliers(result.suppliers || [])
    } catch (err: any) {
      setError(err.message || 'Failed to load suppliers')
      console.error('Suppliers error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Supplier Network</h1>
            <p className="text-gray-400 mt-2">Manage your global supplier relationships</p>
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
            <p className="mt-4 text-gray-400">Loading suppliers...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
            <h3 className="text-cyan-400 font-semibold">Total Suppliers</h3>
            <p className="text-3xl font-bold mt-2">{loading ? '...' : suppliers.length}</p>
          </div>
          <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
            <h3 className="text-green-400 font-semibold">Active</h3>
            <p className="text-3xl font-bold mt-2">{loading ? '...' : suppliers.filter(s => s.status === 'Active').length}</p>
          </div>
          <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
            <h3 className="text-yellow-400 font-semibold">Pending</h3>
            <p className="text-3xl font-bold mt-2">{loading ? '...' : suppliers.filter(s => s.status === 'Pending').length}</p>
          </div>
          <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
            <h3 className="text-purple-400 font-semibold">Countries</h3>
            <p className="text-3xl font-bold mt-2">{loading ? '...' : new Set(suppliers.map(s => s.country)).size}</p>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Supplier List</h2>
            <button className="px-4 py-2 bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors">
              + Add Supplier
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3">Supplier Name</th>
                  <th className="text-left py-3">Country</th>
                  <th className="text-left py-3">Rating</th>
                  <th className="text-left py-3">Products</th>
                  <th className="text-left py-3">Status</th>
                  <th className="text-left py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map(supplier => (
                  <tr key={supplier.id} className="border-b border-gray-700/50">
                    <td className="py-4 font-semibold">{supplier.name}</td>
                    <td className="py-4">
                      <span className="flex items-center gap-2">
                        <span>🌍</span>
                        {supplier.country}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className="text-yellow-400 font-semibold">{supplier.rating}</span>
                    </td>
                    <td className="py-4">{supplier.products}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${supplier.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                        {supplier.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <button className="text-cyan-400 hover:text-cyan-300 mr-3">View</button>
                      <button className="text-gray-400 hover:text-gray-300">Message</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
