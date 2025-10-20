import { ReactNode } from 'react'
import { FallbackProps, ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'
import { useNavigate } from 'react-router-dom'
import { Button } from './Button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  const navigate = useNavigate()
  return (
    <div className='min-h-screen flex items-center justify-center bg-zinc-900'>
      <div className='text-center p-8'>
        <div className='text-6xl mb-4'>⚠️</div>
        <h2 className='text-2xl font-semibold text-zinc-100 mb-4'>Oops! Something went wrong</h2>
        <p className='text-zinc-400 mb-6 max-w-md'>
          An unexpected error occurred. Please try again or refresh the page.
        </p>
        <div className='space-x-4'>
          <Button onClick={resetErrorBoundary} variant='primary'>
            Try Again
          </Button>
          <Button onClick={() => navigate('/')} variant='secondary'>
            Go Home
          </Button>
        </div>
        {process.env.NODE_ENV === 'development' && error && (
          <details className='mt-6 text-left'>
            <summary className='text-zinc-300 cursor-pointer mb-2'>
              Error Details (Development)
            </summary>
            <pre className='text-xs text-red-400 bg-zinc-800 p-4 rounded overflow-auto'>
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}

export const ErrorBoundary = ({ children, fallback }: Props) => {
  return (
    <ReactErrorBoundary
      FallbackComponent={fallback ? () => <>{fallback}</> : ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('ErrorBoundary caught an error:', error, errorInfo)
      }}
    >
      {children}
    </ReactErrorBoundary>
  )
}
