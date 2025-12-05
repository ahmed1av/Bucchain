'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Skeleton } from '@/components/ui/Skeleton'
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react'

export default function WishlistPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    // Mock Wishlist Data
    const [wishlist, setWishlist] = useState([
        { id: '1', name: 'Quantum Processor X1', price: 1200, status: 'In Stock', image: '/placeholder.png' },
        { id: '3', name: 'Bio-Synthetic Interface', price: 3500, status: 'In Transit', image: '/placeholder.png' },
        { id: '5', name: 'Quantum Memory Unit', price: 800, status: 'Out of Stock', image: '/placeholder.png' },
    ])

    const removeFromWishlist = (id: string) => {
        setWishlist(prev => prev.filter(item => item.id !== id))
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <Heart className="w-8 h-8 text-pink-500" />
                            My Wishlist
                        </h1>
                        <p className="text-gray-400 mt-2">Saved items for future procurement</p>
                    </div>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                    </button>
                </div>

                <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                    {wishlist.length === 0 ? (
                        <div className="text-center py-12">
                            <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-300">Your wishlist is empty</h3>
                            <p className="text-gray-500 mt-2">Start adding products to track them here.</p>
                            <button
                                onClick={() => router.push('/products')}
                                className="mt-6 px-6 py-2 bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors"
                            >
                                Browse Products
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {wishlist.map((item) => (
                                <div key={item.id} className="bg-gray-900/50 rounded-xl border border-gray-700 overflow-hidden hover:border-cyan-500/50 transition-all group">
                                    <div className="h-48 bg-gray-800 flex items-center justify-center relative">
                                        <span className="text-gray-600">Product Image Placeholder</span>
                                        <button
                                            onClick={() => removeFromWishlist(item.id)}
                                            className="absolute top-3 right-3 p-2 bg-gray-900/80 rounded-full text-pink-500 hover:bg-pink-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-2xl font-bold text-cyan-400">${item.price.toLocaleString()}</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.status === 'In Stock' ? 'bg-green-500/20 text-green-400' :
                                                    item.status === 'Out of Stock' ? 'bg-red-500/20 text-red-400' :
                                                        'bg-blue-500/20 text-blue-400'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </div>
                                        <button className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium">
                                            <ShoppingCart className="w-4 h-4" /> Add to Order
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
