'use client'

import { useRouter } from 'next/navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/dashboard' },
    { icon: '📦', label: 'Products', path: '/products' },
    { icon: '🔍', label: 'Track', path: '/track' },
    { icon: '🏭', label: 'Suppliers', path: '/suppliers' },
    { icon: '📈', label: 'Analytics', path: '/analytics' },
    { icon: '👤', label: 'Profile', path: '/profile' },
    { icon: '⚙️', label: 'Settings', path: '/settings' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Sidebar Navigation */}
      <div className="fixed left-0 top-0 h-full w-64 bg-gray-800/90 backdrop-blur-sm border-r border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500">
              <span className="font-bold text-white text-sm">BUC</span>
            </div>
            <span className="text-xl font-bold text-white">
              BUC<span className="text-cyan-400">Chain</span>
            </span>
          </div>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <button
                  onClick={() => router.push(item.path)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200"
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <button 
            onClick={() => router.push('/')}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200"
          >
            <span className="text-lg">🏠</span>
            <span className="font-medium">Back to Home</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {children}
      </div>
    </div>
  )
}
