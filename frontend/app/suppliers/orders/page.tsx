'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Skeleton } from '@/components/ui/Skeleton'
import { Truck, FileText, ArrowLeft, Plus, Filter } from 'lucide-react'

export default function SupplierOrdersPage() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState('orders') // 'orders' or 'contracts'

    // Mock Data
    const orders = [
        { id: 'ORD-2024-001', supplier: 'Foxconn Quantum Tech', date: '2024-11-28', amount: 45000, status: 'Processing', items: 150 },
        { id: 'ORD-2024-002', supplier: 'TSMC Neural Foundry', date: '2024-11-25', amount: 128000, status: 'Shipped', items: 500 },
        { id: 'ORD-2024-003', supplier: 'Samsung Quantum', date: '2024-11-20', amount: 32000, status: 'Delivered', items: 80 },
    ]

    const contracts = [
        { id: 'CTR-2024-A1', supplier: 'Foxconn Quantum Tech', title: 'Q1 Component Supply', startDate: '2024-01-01', endDate: '2024-12-31', status: 'Active', value: '1.2M' },
        { id: 'CTR-2024-B2', supplier: 'TSMC Neural Foundry', title: 'Chipset Exclusivity', startDate: '2024-03-01', endDate: '2025-02-28', status: 'Active', value: '5.5M' },
        { id: 'CTR-2023-C3', supplier: 'Intel Quantum Labs', title: 'R&D Partnership', startDate: '2023-06-01', endDate: '2024-05-31', status: 'Expiring Soon', value: '800K' },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <Truck className="w-8 h-8 text-blue-400" />
                            Supplier Management
                        </h1>
                        <p className="text-gray-400 mt-2">Manage B2B orders and supplier contracts</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            ← Back to Dashboard
                        </button>
                        <button className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                            <Plus className="w-4 h-4" /> New Order
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6 border-b border-gray-700">
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`pb-3 px-4 font-medium transition-colors relative ${activeTab === 'orders' ? 'text-blue-400' : 'text-gray-400 hover:text-gray-200'
                            }`}
                    >
                        Orders History
                        {activeTab === 'orders' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400 rounded-t-full" />}
                    </button>
                    <button
                        onClick={() => setActiveTab('contracts')}
                        className={`pb-3 px-4 font-medium transition-colors relative ${activeTab === 'contracts' ? 'text-blue-400' : 'text-gray-400 hover:text-gray-200'
                            }`}
                    >
                        Contracts
                        {activeTab === 'contracts' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400 rounded-t-full" />}
                    </button>
                </div>

                <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                    {activeTab === 'orders' ? (
                        <div className="overflow-x-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">Recent Orders</h3>
                                <button className="p-2 hover:bg-gray-700 rounded-lg text-gray-400">
                                    <Filter className="w-5 h-5" />
                                </button>
                            </div>
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-700">
                                        <th className="text-left py-3 text-gray-400 font-medium">Order ID</th>
                                        <th className="text-left py-3 text-gray-400 font-medium">Supplier</th>
                                        <th className="text-left py-3 text-gray-400 font-medium">Date</th>
                                        <th className="text-left py-3 text-gray-400 font-medium">Items</th>
                                        <th className="text-left py-3 text-gray-400 font-medium">Amount</th>
                                        <th className="text-left py-3 text-gray-400 font-medium">Status</th>
                                        <th className="text-left py-3 text-gray-400 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                                            <td className="py-4 font-mono text-sm text-blue-300">{order.id}</td>
                                            <td className="py-4 font-medium">{order.supplier}</td>
                                            <td className="py-4 text-gray-300">{order.date}</td>
                                            <td className="py-4">{order.items}</td>
                                            <td className="py-4 font-medium">${order.amount.toLocaleString()}</td>
                                            <td className="py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${order.status === 'Delivered' ? 'bg-green-500/20 text-green-400' :
                                                        order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-400' :
                                                            'bg-yellow-500/20 text-yellow-400'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="py-4">
                                                <button className="text-blue-400 hover:text-blue-300 font-medium text-sm">View</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {contracts.map((contract) => (
                                <div key={contract.id} className="bg-gray-900/50 rounded-xl border border-gray-700 p-5 hover:border-blue-500/50 transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-2 bg-blue-500/20 rounded-lg">
                                            <FileText className="w-6 h-6 text-blue-400" />
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${contract.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'
                                            }`}>
                                            {contract.status}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-semibold mb-1">{contract.title}</h3>
                                    <p className="text-gray-400 text-sm mb-4">{contract.supplier}</p>

                                    <div className="space-y-2 text-sm text-gray-300 mb-4">
                                        <div className="flex justify-between">
                                            <span>Value:</span>
                                            <span className="font-medium text-white">${contract.value}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Valid Until:</span>
                                            <span>{contract.endDate}</span>
                                        </div>
                                    </div>

                                    <button className="w-full py-2 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
                                        View Details
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
