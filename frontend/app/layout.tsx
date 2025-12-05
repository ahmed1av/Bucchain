import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Layout/Navbar'
import ErrorBoundary from '@/components/ErrorBoundary'
import Providers from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'BUCChain - Supply Chain Management',
  description: 'AI-powered supply chain management platform',
  openGraph: {
    title: 'BUCChain - Supply Chain Management',
    description: 'AI-powered supply chain management platform',
    url: 'https://bucchain.com',
    siteName: 'BUCChain',
    images: [
      {
        url: 'https://bucchain.com/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <ErrorBoundary>
          <Providers>
            <Navbar />
            {children}
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  )
}
