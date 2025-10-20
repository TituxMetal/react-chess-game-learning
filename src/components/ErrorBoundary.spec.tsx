import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ErrorBoundary } from './ErrorBoundary'

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

// Component that throws an error for testing
const ThrowError = ({
  shouldThrow = false,
  errorMessage = 'Test error'
}: {
  shouldThrow?: boolean
  errorMessage?: string
}) => {
  if (shouldThrow) {
    throw new Error(errorMessage)
  }
  return <div data-testid='working-component'>Component is working</div>
}

// Mock console.error to avoid noise in tests
const originalConsoleError = console.error

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    console.error = vi.fn()
  })

  afterEach(() => {
    console.error = originalConsoleError
  })

  describe('normal operation', () => {
    it('should render children when no error occurs', () => {
      render(
        <MemoryRouter>
          <ErrorBoundary>
            <ThrowError shouldThrow={false} />
          </ErrorBoundary>
        </MemoryRouter>
      )

      expect(screen.getByTestId('working-component')).toBeInTheDocument()
      expect(screen.getByText('Component is working')).toBeInTheDocument()
    })

    it('should render multiple children when no error occurs', () => {
      render(
        <MemoryRouter>
          <ErrorBoundary>
            <div data-testid='child-1'>Child 1</div>
            <div data-testid='child-2'>Child 2</div>
            <ThrowError shouldThrow={false} />
          </ErrorBoundary>
        </MemoryRouter>
      )

      expect(screen.getByTestId('child-1')).toBeInTheDocument()
      expect(screen.getByTestId('child-2')).toBeInTheDocument()
      expect(screen.getByTestId('working-component')).toBeInTheDocument()
    })

    it('should not interfere with normal component behavior', async () => {
      const user = userEvent.setup()
      const mockClick = vi.fn()

      render(
        <MemoryRouter>
          <ErrorBoundary>
            <button data-testid='normal-button' onClick={mockClick}>
              Normal Button
            </button>
          </ErrorBoundary>
        </MemoryRouter>
      )

      await user.click(screen.getByTestId('normal-button'))
      expect(mockClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('error handling', () => {
    it('should catch and display error fallback when child throws', () => {
      render(
        <MemoryRouter>
          <ErrorBoundary>
            <ThrowError shouldThrow={true} />
          </ErrorBoundary>
        </MemoryRouter>
      )

      expect(screen.getByText('⚠️')).toBeInTheDocument()
      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument()
      expect(screen.getByText(/An unexpected error occurred/)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Go Home' })).toBeInTheDocument()
    })

    it('should log error to console when error occurs', () => {
      render(
        <MemoryRouter>
          <ErrorBoundary>
            <ThrowError shouldThrow={true} errorMessage='Custom error message' />
          </ErrorBoundary>
        </MemoryRouter>
      )

      expect(console.error).toHaveBeenCalledWith(
        'ErrorBoundary caught an error:',
        expect.any(Error),
        expect.any(Object)
      )
    })

    it('should handle different error types', () => {
      const CustomError = () => {
        throw new TypeError('Type error occurred')
      }

      render(
        <MemoryRouter>
          <ErrorBoundary>
            <CustomError />
          </ErrorBoundary>
        </MemoryRouter>
      )

      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument()
      expect(console.error).toHaveBeenCalledWith(
        'ErrorBoundary caught an error:',
        expect.any(TypeError),
        expect.any(Object)
      )
    })

    it('should handle errors with custom messages', () => {
      render(
        <MemoryRouter>
          <ErrorBoundary>
            <ThrowError shouldThrow={true} errorMessage='Very specific error message' />
          </ErrorBoundary>
        </MemoryRouter>
      )

      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument()
      // The specific error message should be logged but not displayed to user
      expect(console.error).toHaveBeenCalledWith(
        'ErrorBoundary caught an error:',
        expect.objectContaining({ message: 'Very specific error message' }),
        expect.any(Object)
      )
    })
  })

  describe('error fallback UI', () => {
    beforeEach(() => {
      render(
        <MemoryRouter>
          <ErrorBoundary>
            <ThrowError shouldThrow={true} />
          </ErrorBoundary>
        </MemoryRouter>
      )
    })

    it('should display error icon', () => {
      expect(screen.getByText('⚠️')).toBeInTheDocument()
    })

    it('should display error title', () => {
      expect(
        screen.getByRole('heading', { name: 'Oops! Something went wrong' })
      ).toBeInTheDocument()
    })

    it('should display error description', () => {
      expect(screen.getByText(/An unexpected error occurred/)).toBeInTheDocument()
      expect(screen.getByText(/Please try again or refresh the page/)).toBeInTheDocument()
    })

    it('should display action buttons', () => {
      expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Go Home' })).toBeInTheDocument()
    })

    it('should have proper styling classes', () => {
      const container = screen.getByText('Oops! Something went wrong').closest('div')
      expect(container).toHaveClass('text-center', 'p-8')

      const mainContainer = container?.parentElement
      expect(mainContainer).toHaveClass(
        'min-h-screen',
        'flex',
        'items-center',
        'justify-center',
        'bg-zinc-900'
      )
    })
  })

  describe('error recovery actions', () => {
    it('should reset error boundary when Try Again is clicked', async () => {
      const user = userEvent.setup()

      // Create a component that can toggle between throwing and working
      let shouldThrow = true
      const ToggleErrorComponent = () => {
        if (shouldThrow) {
          throw new Error('Test error')
        }
        return <div data-testid='working-component'>Component is working</div>
      }

      render(
        <MemoryRouter>
          <ErrorBoundary>
            <ToggleErrorComponent />
          </ErrorBoundary>
        </MemoryRouter>
      )

      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument()

      // Fix the underlying issue
      shouldThrow = false

      // Click Try Again button - this should reset the error boundary
      await user.click(screen.getByRole('button', { name: 'Try Again' }))

      // The component should now render successfully
      expect(screen.getByTestId('working-component')).toBeInTheDocument()
      expect(screen.queryByText('Oops! Something went wrong')).not.toBeInTheDocument()
    })

    it('should navigate to home when Go Home is clicked', async () => {
      const user = userEvent.setup()

      render(
        <MemoryRouter>
          <ErrorBoundary>
            <ThrowError shouldThrow={true} />
          </ErrorBoundary>
        </MemoryRouter>
      )

      await user.click(screen.getByRole('button', { name: 'Go Home' }))

      expect(mockNavigate).toHaveBeenCalledWith('/')
      expect(mockNavigate).toHaveBeenCalledTimes(1)
    })

    it('should handle multiple clicks on action buttons', async () => {
      const user = userEvent.setup()

      render(
        <MemoryRouter>
          <ErrorBoundary>
            <ThrowError shouldThrow={true} />
          </ErrorBoundary>
        </MemoryRouter>
      )

      // Click Go Home multiple times
      await user.click(screen.getByRole('button', { name: 'Go Home' }))
      await user.click(screen.getByRole('button', { name: 'Go Home' }))

      expect(mockNavigate).toHaveBeenCalledTimes(2)
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })

  describe('development mode error details', () => {
    const originalNodeEnv = process.env.NODE_ENV

    afterEach(() => {
      process.env.NODE_ENV = originalNodeEnv
    })

    it('should show error details in development mode', () => {
      process.env.NODE_ENV = 'development'

      render(
        <MemoryRouter>
          <ErrorBoundary>
            <ThrowError shouldThrow={true} errorMessage='Development error' />
          </ErrorBoundary>
        </MemoryRouter>
      )

      expect(screen.getByText('Error Details (Development)')).toBeInTheDocument()

      // Check if details element is present
      const details = screen.getByRole('group')
      expect(details).toBeInTheDocument()
      expect(details.tagName.toLowerCase()).toBe('details')
    })

    it('should not show error details in production mode', () => {
      process.env.NODE_ENV = 'production'

      render(
        <MemoryRouter>
          <ErrorBoundary>
            <ThrowError shouldThrow={true} errorMessage='Production error' />
          </ErrorBoundary>
        </MemoryRouter>
      )

      expect(screen.queryByText('Error Details (Development)')).not.toBeInTheDocument()
      expect(screen.queryByRole('group')).not.toBeInTheDocument()
    })

    it('should expand error details when clicked in development', async () => {
      process.env.NODE_ENV = 'development'
      const user = userEvent.setup()

      render(
        <MemoryRouter>
          <ErrorBoundary>
            <ThrowError shouldThrow={true} errorMessage='Detailed error' />
          </ErrorBoundary>
        </MemoryRouter>
      )

      const summary = screen.getByText('Error Details (Development)')
      await user.click(summary)

      // Check if error stack is visible
      const errorStack = screen.getByText(/Error: Detailed error/)
      expect(errorStack).toBeInTheDocument()
    })

    it('should handle missing error stack gracefully', () => {
      process.env.NODE_ENV = 'development'

      const ErrorWithoutStack = () => {
        const error = new Error('No stack error')
        error.stack = undefined
        throw error
      }

      render(
        <MemoryRouter>
          <ErrorBoundary>
            <ErrorWithoutStack />
          </ErrorBoundary>
        </MemoryRouter>
      )

      expect(screen.getByText('Error Details (Development)')).toBeInTheDocument()
    })
  })

  describe('custom fallback prop', () => {
    it('should render custom fallback when provided', () => {
      const customFallback = <div data-testid='custom-fallback'>Custom Error UI</div>

      render(
        <MemoryRouter>
          <ErrorBoundary fallback={customFallback}>
            <ThrowError shouldThrow={true} />
          </ErrorBoundary>
        </MemoryRouter>
      )

      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument()
      expect(screen.getByText('Custom Error UI')).toBeInTheDocument()
      expect(screen.queryByText('Oops! Something went wrong')).not.toBeInTheDocument()
    })

    it('should use default fallback when custom fallback is not provided', () => {
      render(
        <MemoryRouter>
          <ErrorBoundary>
            <ThrowError shouldThrow={true} />
          </ErrorBoundary>
        </MemoryRouter>
      )

      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument()
      expect(screen.queryByTestId('custom-fallback')).not.toBeInTheDocument()
    })

    it('should render complex custom fallback', () => {
      const complexFallback = (
        <div data-testid='complex-fallback'>
          <h1>Custom Error Handler</h1>
          <p>Something went wrong in our app</p>
          <button>Custom Action</button>
        </div>
      )

      render(
        <MemoryRouter>
          <ErrorBoundary fallback={complexFallback}>
            <ThrowError shouldThrow={true} />
          </ErrorBoundary>
        </MemoryRouter>
      )

      expect(screen.getByTestId('complex-fallback')).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: 'Custom Error Handler' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Custom Action' })).toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    it('should handle null children', () => {
      render(
        <MemoryRouter>
          <ErrorBoundary>{null}</ErrorBoundary>
        </MemoryRouter>
      )

      // Should render without errors
      expect(screen.queryByText('Oops! Something went wrong')).not.toBeInTheDocument()
    })

    it('should handle undefined children', () => {
      render(
        <MemoryRouter>
          <ErrorBoundary>{undefined}</ErrorBoundary>
        </MemoryRouter>
      )

      // Should render without errors
      expect(screen.queryByText('Oops! Something went wrong')).not.toBeInTheDocument()
    })

    it('should handle empty children', () => {
      render(
        <MemoryRouter>
          <ErrorBoundary>{''}</ErrorBoundary>
        </MemoryRouter>
      )

      // Should render without errors
      expect(screen.queryByText('Oops! Something went wrong')).not.toBeInTheDocument()
    })

    it('should handle errors in nested components', () => {
      const NestedComponent = () => (
        <div>
          <div>
            <ThrowError shouldThrow={true} />
          </div>
        </div>
      )

      render(
        <MemoryRouter>
          <ErrorBoundary>
            <NestedComponent />
          </ErrorBoundary>
        </MemoryRouter>
      )

      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument()
    })

    it('should handle async errors appropriately', async () => {
      const AsyncError = () => {
        const handleAsyncError = async () => {
          // Simulate async operation that fails
          await new Promise(resolve => setTimeout(resolve, 10))
          throw new Error('Async error')
        }

        return (
          <button
            data-testid='async-button'
            onClick={() =>
              handleAsyncError().catch(() => {
                // Async errors need to be handled differently
                // This test verifies the component structure exists
              })
            }
          >
            Trigger Async Error
          </button>
        )
      }

      render(
        <MemoryRouter>
          <ErrorBoundary>
            <AsyncError />
          </ErrorBoundary>
        </MemoryRouter>
      )

      expect(screen.getByTestId('async-button')).toBeInTheDocument()
    })

    it('should maintain error boundary state across re-renders', () => {
      const { rerender } = render(
        <MemoryRouter>
          <ErrorBoundary>
            <ThrowError shouldThrow={true} />
          </ErrorBoundary>
        </MemoryRouter>
      )

      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument()

      // Rerender with same error
      rerender(
        <MemoryRouter>
          <ErrorBoundary>
            <ThrowError shouldThrow={true} />
          </ErrorBoundary>
        </MemoryRouter>
      )

      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument()
    })
  })
})
