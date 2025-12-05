'use client'

import ErrorBoundary from '@/components/Layout/ErrorBoundary'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return <ErrorBoundary error={error} reset={reset} />
}
