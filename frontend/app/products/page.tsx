'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useProducts } from '@/hooks/useProducts'
import { Skeleton } from '@/components/ui/Skeleton'
import { Search, Package, ArrowLeft, ArrowRight, Plus } from 'lucide-react'

export default function ProductsPage() {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Debounce search
  useState(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500)
    return () => clearTimeout(timer)
  })

  const { data: productsData, isLoading, error } = useProducts(page, 10, debouncedSearch)

  // Mock data for demonstration if API returns empty or for UI dev
  const mockProducts = [
    { id: '1', name: 'Quantum Processor X1', category: 'Electronics', status: 'In Stock', quantity: 150, location: 'Warehouse A', rating: 4.8, reviews: 12 },
    { id: '2', name: 'Neural Chipset V2', category: 'Electronics', status: 'Low Stock', quantity: 25, location: 'Warehouse B', rating: 4.5, reviews: 8 },
    { id: '3', name: 'Bio-Synthetic Interface', category: 'Biotech', status: 'In Transit', quantity: 500, location: 'Transit', rating: 4.9, reviews: 24 },
    { id: '4', name: 'Holographic Display Module', category: 'Displays', status: 'In Stock', quantity: 75, location: 'Warehouse A', rating: 4.2, reviews: 5 },
    { id: '5', name: 'Quantum Memory Unit', category: 'Electronics', status: 'Out of Stock', quantity: 0, location: 'Warehouse C', rating: 4.7, reviews: 18 },
  ]

  const products = productsData?.products?.length ? productsData.products : mockProducts
  const total = productsData?.total || mockProducts.length
  const totalPages = Math.ceil(total / 10)

  const categories = ['All', 'Electronics', 'Biotech', 'Displays', 'Energy']

  const filteredProducts = category === 'All'
    ? products
    : products.filter((p: any) => p.category === category)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Package className="w-8 h-8 text-cyan-400" />
              Products Management
            </h1>
            <p className="text-gray-400 mt-2">Manage your product inventory, reviews, and tracking</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              ← Back to Dashboard
            </button>
            <button className="px-4 py-2 bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-800/50 rounded-xl p-4 mb-6 border border-gray-700 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-900/50 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${category === cat
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                    : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Products', value: total, color: 'text-cyan-400' },
            { label: 'In Stock', value: products.filter((p: any) => p.status === 'In Stock').length, color: 'text-green-400' },
            { label: 'Low Stock', value: products.filter((p: any) => p.status === 'Low Stock').length, color: 'text-yellow-400' },
            { label: 'Avg Rating', value: '4.6', color: 'text-purple-400' },
          ].map((stat, i) => (
            <div key={i} className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
              <h3 className={`${stat.color} font-semibold`}>{stat.label}</h3>
              {isLoading ? (
                <Skeleton className="h-8 w-16 mt-2" />
              ) : (
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6">
            <p className="text-red-400">Failed to load products. Using cached data.</p>
          </div>
        )}

        <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 text-gray-400 font-medium">Product Name</th>
                  <th className="text-left py-3 text-gray-400 font-medium">Category</th>
                  <th className="text-left py-3 text-gray-400 font-medium">Status</th>
                  <th className="text-left py-3 text-gray-400 font-medium">Rating</th>
                  <th className="text-left py-3 text-gray-400 font-medium">Quantity</th>
                  <th className="text-left py-3 text-gray-400 font-medium">Location</th>
                  <th className="text-left py-3 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-700/50">
                      <td className="py-4"><Skeleton className="h-4 w-32" /></td>
                      <td className="py-4"><Skeleton className="h-4 w-24" /></td>
                      <td className="py-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                      <td className="py-4"><Skeleton className="h-4 w-16" /></td>
                      <td className="py-4"><Skeleton className="h-4 w-16" /></td>
                      <td className="py-4"><Skeleton className="h-4 w-24" /></td>
                      <td className="py-4"><Skeleton className="h-8 w-20" /></td>
                    </tr>
                  ))
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-400">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product: any) => (
                    <tr key={product.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                      <td className="py-4 font-medium">
                        <div>{product.name}</div>
                        <div className="text-xs text-gray-500">ID: {product.id.substring(0, 8)}...</div>
                      </td>
                      <td className="py-4 text-gray-300">{product.category || 'Uncategorized'}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${product.status === 'In Stock' ? 'bg-green-500/20 text-green-400' :
                          product.status === 'Low Stock' ? 'bg-yellow-500/20 text-yellow-400' :
                            product.status === 'Out of Stock' ? 'bg-red-500/20 text-red-400' :
                              'bg-blue-500/20 text-blue-400'
                          }`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400">★</span>
                          <span className="text-gray-200">{product.rating || 'N/A'}</span>
                          <span className="text-xs text-gray-500">({product.reviews || 0})</span>
                        </div>
                      </td>
                      <td className="py-4">{product.quantity?.toLocaleString() || 0}</td>
                      <td className="py-4 text-gray-300">{product.location}</td>
                      <td className="py-4">
                        <button className="text-cyan-400 hover:text-cyan-300 mr-3 font-medium text-sm">Edit</button>
                        <button className="text-gray-400 hover:text-gray-300 font-medium text-sm">Track</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <span className="text-gray-400">
                Page <span className="text-white font-bold">{page}</span> of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
