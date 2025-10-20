import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { HomePage } from './HomePage'

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

describe('HomePage', () => {
  const renderHomePage = () => {
    return render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    )
  }

  beforeEach(() => {
    mockNavigate.mockClear()
  })

  describe('AC1.2.1: Display welcome message in French', () => {
    it('should render the French welcome message', () => {
      renderHomePage()
      const welcomeHeading = screen.getByRole('heading', {
        name: /bienvenue dans votre apprentissage des échecs/i
      })
      expect(welcomeHeading).toBeInTheDocument()
    })
  })

  describe('AC1.2.2: Render "Commencer l\'apprentissage" button', () => {
    it('should render the start learning button with correct text', () => {
      renderHomePage()
      const button = screen.getByRole('button', {
        name: /commencer l'apprentissage/i
      })
      expect(button).toBeInTheDocument()
    })
  })

  describe('AC1.2.3: Navigate to first story on button click', () => {
    it('should navigate to /story/01-introduction/chapter/01-what-is-chess when button is clicked', async () => {
      const user = userEvent.setup()
      renderHomePage()

      const button = screen.getByRole('button', {
        name: /commencer l'apprentissage/i
      })
      await user.click(button)

      expect(mockNavigate).toHaveBeenCalledWith('/story/01-introduction/chapter/01-what-is-chess')
      expect(mockNavigate).toHaveBeenCalledTimes(1)
    })
  })

  describe('AC1.2.4: Responsive layout (mobile + desktop)', () => {
    it('should render main layout container with responsive classes', () => {
      renderHomePage()
      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
      expect(main).toHaveClass('min-h-screen', 'px-6', 'py-8')
    })

    it('should render feature cards grid with responsive classes', () => {
      renderHomePage()
      // Check for the three feature card headings
      expect(screen.getByText('Histoires')).toBeInTheDocument()
      expect(screen.getByText('Échiquier')).toBeInTheDocument()
      expect(screen.getByText('Exercices')).toBeInTheDocument()
    })

    it('should render with mobile-first approach', () => {
      renderHomePage()
      const main = screen.getByRole('main')
      // Verify flex-col for mobile stacking
      expect(main).toHaveClass('flex-col')
    })
  })

  describe('AC1.2.5: Button accessible via keyboard with ARIA label', () => {
    it('should have proper ARIA label on button', () => {
      renderHomePage()
      const button = screen.getByRole('button', {
        name: "Commencer l'apprentissage des échecs"
      })
      expect(button).toHaveAttribute('aria-label', "Commencer l'apprentissage des échecs")
    })

    it('should be keyboard accessible with Tab key', async () => {
      const user = userEvent.setup()
      renderHomePage()

      const button = screen.getByRole('button', {
        name: /commencer l'apprentissage/i
      })

      // Tab to button
      await user.tab()
      expect(button).toHaveFocus()
    })

    it('should activate button with Enter key', async () => {
      const user = userEvent.setup()
      renderHomePage()

      const button = screen.getByRole('button', {
        name: /commencer l'apprentissage/i
      })

      // Focus and press Enter
      button.focus()
      await user.keyboard('{Enter}')

      expect(mockNavigate).toHaveBeenCalledWith('/story/01-introduction/chapter/01-what-is-chess')
    })

    it('should have visible focus indicator', () => {
      renderHomePage()
      const button = screen.getByRole('button', {
        name: /commencer l'apprentissage/i
      })

      // Check for focus ring classes
      expect(button).toHaveClass('focus:ring-2', 'focus:ring-amber-500')
    })
  })

  describe('Semantic HTML', () => {
    it('should use semantic main element', () => {
      renderHomePage()
      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
    })

    it('should use semantic h1 heading', () => {
      renderHomePage()
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toBeInTheDocument()
    })

    it('should use semantic button element', () => {
      renderHomePage()
      const button = screen.getByRole('button')
      expect(button.tagName).toBe('BUTTON')
    })
  })

  describe('Content rendering', () => {
    it('should render chess icon with aria-hidden', () => {
      const { container } = renderHomePage()
      const chessIcon = container.querySelector('[aria-hidden="true"]')
      expect(chessIcon).toBeInTheDocument()
      expect(chessIcon?.textContent).toContain('♟️')
    })

    it('should render description text', () => {
      renderHomePage()
      const description = screen.getByText(/découvre le monde des échecs/i)
      expect(description).toBeInTheDocument()
    })

    it('should render all three feature cards', () => {
      renderHomePage()
      expect(screen.getByText('Histoires')).toBeInTheDocument()
      expect(screen.getByText('Échiquier')).toBeInTheDocument()
      expect(screen.getByText('Exercices')).toBeInTheDocument()
    })
  })
})
