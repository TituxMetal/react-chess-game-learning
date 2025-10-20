import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { resetQuestionState } from '~/lib/stores/questionStore'
import { Question } from '~/types/story'
import { MoveBasedQuestion, MoveBasedQuestionProps } from './MoveBasedQuestion'

// Mock react-chessboard
vi.mock('react-chessboard', () => ({
  Chessboard: ({ options }: any) => (
    <div
      data-testid='chessboard'
      data-position={options?.position}
      data-draggable={options?.allowDragging?.toString()}
    >
      <button
        data-testid='mock-piece-drop'
        onClick={() =>
          options?.onPieceDrop &&
          options.onPieceDrop({
            piece: { pieceType: 'p' },
            sourceSquare: 'e2',
            targetSquare: 'e4'
          })
        }
      >
        Mock Move e2-e4
      </button>
      <button
        data-testid='mock-piece-drop-invalid'
        onClick={() =>
          options?.onPieceDrop &&
          options.onPieceDrop({
            piece: { pieceType: 'p' },
            sourceSquare: 'e2',
            targetSquare: 'e5'
          })
        }
      >
        Mock Invalid Move
      </button>
    </div>
  )
}))

describe('MoveBasedQuestion', () => {
  const mockQuestion: Question = {
    type: 'move-based',
    prompt: 'Play the best opening move for White',
    correctAnswer: 'e2e4',
    explanation: 'e4 is a classical opening move',
    initialPosition: 'start'
  }

  const mockOnMove = vi.fn()

  const renderComponent = (props: Partial<MoveBasedQuestionProps> = {}): void => {
    render(<MoveBasedQuestion question={mockQuestion} onMove={mockOnMove} {...props} />)
  }

  beforeEach(() => {
    resetQuestionState()
    mockOnMove.mockClear()
  })

  describe('Rendering', () => {
    it('should render question prompt', () => {
      renderComponent()
      expect(screen.getByText('Play the best opening move for White')).toBeInTheDocument()
    })

    it('should render chessboard with initial position', () => {
      renderComponent()
      const board = screen.getByTestId('chessboard')
      expect(board).toBeInTheDocument()
      expect(board).toHaveAttribute('data-position', expect.stringContaining('rnbqkbnr'))
    })

    it('should render keyboard input section', () => {
      renderComponent()
      expect(screen.getByLabelText(/enter move in algebraic notation/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/e.g., e2e4 or e4/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /submit move/i })).toBeInTheDocument()
    })

    it('should have pieces draggable initially', () => {
      renderComponent()
      const board = screen.getByTestId('chessboard')
      expect(board).toHaveAttribute('data-draggable', 'true')
    })

    it('should render with custom initial position when provided', () => {
      const customQuestion: Question = {
        ...mockQuestion,
        initialPosition: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1'
      }
      render(<MoveBasedQuestion question={customQuestion} onMove={mockOnMove} />)

      const board = screen.getByTestId('chessboard')
      expect(board).toHaveAttribute('data-position', expect.stringContaining('4P3'))
    })
  })

  describe('Drag-and-Drop Interaction', () => {
    it('should trigger onMove callback when correct move is dropped', async () => {
      const user = userEvent.setup()
      renderComponent()

      const mockDrop = screen.getByTestId('mock-piece-drop')
      await user.click(mockDrop)

      await waitFor(() => {
        expect(mockOnMove).toHaveBeenCalledWith('e2e4', true)
        expect(mockOnMove).toHaveBeenCalledTimes(1)
      })
    })

    it('should trigger onMove callback with incorrect result for wrong move', async () => {
      const user = userEvent.setup()
      const wrongAnswerQuestion: Question = {
        ...mockQuestion,
        correctAnswer: 'd2d4' // So e2e4 is wrong
      }
      render(<MoveBasedQuestion question={wrongAnswerQuestion} onMove={mockOnMove} />)

      const mockDrop = screen.getByTestId('mock-piece-drop')
      await user.click(mockDrop)

      await waitFor(() => {
        expect(mockOnMove).toHaveBeenCalledWith('e2e4', false)
      })
    })

    it('should lock board after move submission', async () => {
      const user = userEvent.setup()
      renderComponent()

      const mockDrop = screen.getByTestId('mock-piece-drop')
      await user.click(mockDrop)

      await waitFor(() => {
        const board = screen.getByTestId('chessboard')
        expect(board).toHaveAttribute('data-draggable', 'false')
      })
    })

    it('should not allow move after board is locked', async () => {
      const user = userEvent.setup()
      renderComponent()

      // First move
      const mockDrop = screen.getByTestId('mock-piece-drop')
      await user.click(mockDrop)

      await waitFor(() => {
        expect(mockOnMove).toHaveBeenCalledTimes(1)
      })

      // Second move attempt (should be blocked)
      mockOnMove.mockClear()
      await user.click(mockDrop)

      expect(mockOnMove).not.toHaveBeenCalled()
    })
  })

  describe('Move Validation', () => {
    it('should validate exact match for single correct answer', async () => {
      const user = userEvent.setup()
      renderComponent()

      const mockDrop = screen.getByTestId('mock-piece-drop')
      await user.click(mockDrop)

      await waitFor(() => {
        expect(mockOnMove).toHaveBeenCalledWith('e2e4', true)
      })
    })

    it('should accept any answer from multiple valid answers array', async () => {
      const user = userEvent.setup()
      const multiAnswerQuestion: Question = {
        ...mockQuestion,
        correctAnswer: ['e2e4', 'd2d4', 'c2c4']
      }
      render(<MoveBasedQuestion question={multiAnswerQuestion} onMove={mockOnMove} />)

      const mockDrop = screen.getByTestId('mock-piece-drop')
      await user.click(mockDrop)

      await waitFor(() => {
        expect(mockOnMove).toHaveBeenCalledWith('e2e4', true)
      })
    })

    it('should support pattern matching with wildcards', async () => {
      const user = userEvent.setup()
      const patternQuestion: Question = {
        ...mockQuestion,
        correctAnswer: 'e2*' // Any move starting with e2
      }
      render(<MoveBasedQuestion question={patternQuestion} onMove={mockOnMove} />)

      const mockDrop = screen.getByTestId('mock-piece-drop')
      await user.click(mockDrop)

      await waitFor(() => {
        expect(mockOnMove).toHaveBeenCalledWith('e2e4', true)
      })
    })

    it('should reject move that does not match pattern', async () => {
      const user = userEvent.setup()
      const patternQuestion: Question = {
        ...mockQuestion,
        correctAnswer: 'd2*' // Only moves starting with d2
      }
      render(<MoveBasedQuestion question={patternQuestion} onMove={mockOnMove} />)

      const mockDrop = screen.getByTestId('mock-piece-drop')
      await user.click(mockDrop)

      await waitFor(() => {
        expect(mockOnMove).toHaveBeenCalledWith('e2e4', false)
      })
    })
  })

  describe('Keyboard Input', () => {
    it('should accept move via keyboard input', async () => {
      const user = userEvent.setup()
      renderComponent()

      const input = screen.getByPlaceholderText(/e.g., e2e4 or e4/i)
      const submitButton = screen.getByRole('button', { name: /submit move/i })

      await user.type(input, 'e2e4')
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockOnMove).toHaveBeenCalledWith('e2e4', true)
      })
    })

    it('should accept move via keyboard input with Enter key', async () => {
      const user = userEvent.setup()
      renderComponent()

      const input = screen.getByPlaceholderText(/e.g., e2e4 or e4/i)

      await user.type(input, 'e2e4{Enter}')

      await waitFor(() => {
        expect(mockOnMove).toHaveBeenCalledWith('e2e4', true)
      })
    })

    it('should accept short algebraic notation', async () => {
      const user = userEvent.setup()
      renderComponent()

      const input = screen.getByPlaceholderText(/e.g., e2e4 or e4/i)

      await user.type(input, 'e4{Enter}')

      await waitFor(() => {
        expect(mockOnMove).toHaveBeenCalledWith('e2e4', true)
      })
    })

    it('should disable keyboard input after move submission', async () => {
      const user = userEvent.setup()
      renderComponent()

      const input = screen.getByPlaceholderText(/e.g., e2e4 or e4/i) as HTMLInputElement
      const submitButton = screen.getByRole('button', { name: /submit move/i }) as HTMLButtonElement

      await user.type(input, 'e2e4{Enter}')

      await waitFor(() => {
        expect(input.disabled).toBe(true)
        expect(submitButton.disabled).toBe(true)
      })
    })

    it('should display error for invalid move notation', async () => {
      const user = userEvent.setup()
      renderComponent()

      const input = screen.getByPlaceholderText(/e.g., e2e4 or e4/i)

      await user.type(input, 'xyz{Enter}')

      await waitFor(() => {
        expect(screen.getByText(/invalid move format/i)).toBeInTheDocument()
      })
    })

    it('should not submit empty keyboard input', async () => {
      const user = userEvent.setup()
      renderComponent()

      const submitButton = screen.getByRole('button', { name: /submit move/i }) as HTMLButtonElement

      expect(submitButton.disabled).toBe(true)

      await user.click(submitButton)

      expect(mockOnMove).not.toHaveBeenCalled()
    })

    it('should handle whitespace in keyboard input', async () => {
      const user = userEvent.setup()
      renderComponent()

      const input = screen.getByPlaceholderText(/e.g., e2e4 or e4/i)

      await user.type(input, '  e2e4  {Enter}')

      await waitFor(() => {
        expect(mockOnMove).toHaveBeenCalledWith('e2e4', true)
      })
    })

    it('should be case-insensitive for keyboard input', async () => {
      const user = userEvent.setup()
      renderComponent()

      const input = screen.getByPlaceholderText(/e.g., e2e4 or e4/i)

      await user.type(input, 'E2E4{Enter}')

      await waitFor(() => {
        expect(mockOnMove).toHaveBeenCalledWith('e2e4', true)
      })
    })
  })

  describe('Visual Feedback', () => {
    it('should display move status after submission', async () => {
      const user = userEvent.setup()
      renderComponent()

      const mockDrop = screen.getByTestId('mock-piece-drop')
      await user.click(mockDrop)

      await waitFor(() => {
        expect(screen.getByText(/correct move/i)).toBeInTheDocument()
        expect(screen.getByText(/you played: e2e4/i)).toBeInTheDocument()
      })
    })

    it('should display incorrect status for wrong move', async () => {
      const user = userEvent.setup()
      const wrongAnswerQuestion: Question = {
        ...mockQuestion,
        correctAnswer: 'd2d4' // So e2e4 is wrong
      }
      render(<MoveBasedQuestion question={wrongAnswerQuestion} onMove={mockOnMove} />)

      const mockDrop = screen.getByTestId('mock-piece-drop')
      await user.click(mockDrop)

      await waitFor(() => {
        expect(screen.getByText(/incorrect move/i)).toBeInTheDocument()
      })
    })

    it('should not show move status before submission', () => {
      renderComponent()
      expect(screen.queryByText(/correct move/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/incorrect move/i)).not.toBeInTheDocument()
    })
  })

  describe('State Integration', () => {
    it('should reset when question changes', async () => {
      const user = userEvent.setup()
      const { rerender } = render(<MoveBasedQuestion question={mockQuestion} onMove={mockOnMove} />)

      const input = screen.getByPlaceholderText(/e.g., e2e4 or e4/i) as HTMLInputElement
      const board = screen.getByTestId('chessboard')
      expect(board).toHaveAttribute('data-draggable', 'true')

      await user.type(input, 'e2e4{Enter}')

      await waitFor(() => {
        expect(input.disabled).toBe(true)
      })

      // Change question - use different initialPosition to trigger reset
      const newQuestion: Question = {
        ...mockQuestion,
        initialPosition: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
        correctAnswer: 'e7e5'
      }

      act(() => {
        resetQuestionState() // Reset store state before rerender
        rerender(<MoveBasedQuestion question={newQuestion} onMove={mockOnMove} />)
      })

      await waitFor(() => {
        const newInput = screen.getByPlaceholderText(/e.g., e2e4 or e4/i) as HTMLInputElement
        expect(newInput.value).toBe('')
        expect(newInput.disabled).toBe(false)
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle question without initialPosition', () => {
      const questionWithoutPosition: Question = {
        ...mockQuestion,
        initialPosition: undefined
      }

      render(<MoveBasedQuestion question={questionWithoutPosition} onMove={mockOnMove} />)

      const board = screen.getByTestId('chessboard')
      expect(board).toHaveAttribute('data-position', expect.stringContaining('rnbqkbnr'))
    })

    it('should handle invalid regex patterns gracefully', async () => {
      const user = userEvent.setup()
      const invalidPatternQuestion: Question = {
        ...mockQuestion,
        correctAnswer: '[invalid(regex'
      }
      render(<MoveBasedQuestion question={invalidPatternQuestion} onMove={mockOnMove} />)

      const mockDrop = screen.getByTestId('mock-piece-drop')
      await user.click(mockDrop)

      await waitFor(() => {
        // Should fall through to exact match check and fail
        expect(mockOnMove).toHaveBeenCalledWith('e2e4', false)
      })
    })
  })

  describe('Accessibility', () => {
    it('should have accessible labels for keyboard input', () => {
      renderComponent()

      const input = screen.getByLabelText(/enter move in algebraic notation/i)
      expect(input).toHaveAttribute('id', 'move-input')
    })

    it('should have visible focus indicators on input', () => {
      renderComponent()

      const input = screen.getByPlaceholderText(/e.g., e2e4 or e4/i)
      expect(input).toHaveClass('focus:outline-none', 'focus:border-blue-500', 'focus:ring-2')
    })

    it('should have visible focus indicators on submit button', async () => {
      const user = userEvent.setup()
      renderComponent()

      // Enable the button first by typing something
      const input = screen.getByPlaceholderText(/e.g., e2e4 or e4/i)
      await user.type(input, 'e4')

      const button = screen.getByRole('button', { name: /submit move/i })
      expect(button).toHaveClass('focus:outline-none', 'focus:ring-2')
    })
  })
})
