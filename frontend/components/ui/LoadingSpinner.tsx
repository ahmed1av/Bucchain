'use client'

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg'
    color?: string
    className?: string
}

export default function LoadingSpinner({
    size = 'md',
    color = 'border-cyan-500',
    className = ''
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'h-6 w-6 border-2',
        md: 'h-12 w-12 border-2',
        lg: 'h-16 w-16 border-4'
    }

    return (
        <div className={`inline-block animate-spin rounded-full border-t-transparent border-b-transparent ${sizeClasses[size]} ${color} ${className}`} />
    )
}
