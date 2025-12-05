'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
    id: string
    message: string
    type: ToastType
}

interface ToastContextType {
    toasts: Toast[]
    addToast: (message: string, type: ToastType) => void
    removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const addToast = useCallback((message: string, type: ToastType) => {
        const id = Math.random().toString(36).substr(2, 9)
        setToasts((prev) => [...prev, { id, message, type }])

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id))
        }, 5000)
    }, [])

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, [])

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within ToastProvider')
    }

    return {
        success: (message: string) => context.addToast(message, 'success'),
        error: (message: string) => context.addToast(message, 'error'),
        warning: (message: string) => context.addToast(message, 'warning'),
        info: (message: string) => context.addToast(message, 'info'),
    }
}

import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
            {toasts.map((toast) => (
                <div key={toast.id} className="pointer-events-auto">
                    <ToastItem toast={toast} onClose={() => removeToast(toast.id)} />
                </div>
            ))}
        </div>
    )
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
    const styles = {
        success: 'bg-gray-800 border-green-500/50 text-green-400',
        error: 'bg-gray-800 border-red-500/50 text-red-400',
        warning: 'bg-gray-800 border-yellow-500/50 text-yellow-400',
        info: 'bg-gray-800 border-blue-500/50 text-blue-400',
    }

    const icons = {
        success: CheckCircle,
        error: XCircle,
        warning: AlertTriangle,
        info: Info,
    }

    const Icon = icons[toast.type]

    return (
        <div
            className={`${styles[toast.type]} border rounded-lg px-4 py-3 shadow-xl flex items-start gap-3 min-w-[300px] max-w-md animate-slide-in backdrop-blur-md`}
        >
            <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <p className="text-gray-200 flex-1 text-sm">{toast.message}</p>
            <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-300 transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    )
}
