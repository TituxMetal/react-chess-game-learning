import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Question } from '~/types/story'
import { QuestionComponent } from './QuestionComponent'

// Mock MoveBasedQuestion component
vi.mock('~/features/questions/MoveBasedQuestion', () => ({
  MoveBasedQuestion: ({ question, onMove }: any) => (
    <div data-testid='move-based-question'>
      <p>{question.prompt}</p>
      <button onClick={() => onMove('e2e4', true)}>Make Move</button>
    </div>
  )
}))

describe('QuestionComponent', () => {
  const mockOnAnswer = vi.fn()

  const multipleChoiceQuestion: Question = {
    type: 'multiple-choice',
    prompt: 'Combien de cases possède un échiquier ?',
    options: ['32', '64', '100'],
    correctAnswer: '64',
    explanation: 'Un échiquier est composé de 8 rangées et 8 colonnes, soit 64 cases.'
  }

  const moveBasedQuestion: Question = {
    type: 'move-based',
    prompt: 'Déplacez un pion',
    correctAnswer: 'e2e4',
    explanation: 'Le pion avance de deux cases.'
  }

  beforeEach(() => {
    mockOnAnswer.mockClear()
  })

  describe('Multiple Choice Questions', () => {
    describe('Rendering', () => {
      it('should render question prompt', () => {
        render(<QuestionComponent question={multipleChoiceQuestion} onAnswer={mockOnAnswer} />)
        expect(screen.getByText('Combien de cases possède un échiquier ?')).toBeInTheDocument()
      })

      it('should render all answer options as buttons', () => {
        render(<QuestionComponent question={multipleChoiceQuestion} onAnswer={mockOnAnswer} />)

        expect(screen.getByRole('button', { name: '32' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: '64' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: '100' })).toBeInTheDocument()
      })

      it('should apply base styling classes to all buttons', () => {
        render(<QuestionComponent question={multipleChoiceQuestion} onAnswer={mockOnAnswer} />)

        const buttons = screen.getAllByRole('button')
        buttons.forEach(button => {
          expect(button).toHaveClass('w-full', 'p-4', 'text-left', 'rounded-lg', 'border')
        })
      })
    })

    describe('Answer Selection', () => {
      it('should show feedback styling immediately after selection', async () => {
        const user = userEvent.setup()
        render(<QuestionComponent question={multipleChoiceQuestion} onAnswer={mockOnAnswer} />)

        const option32Button = screen.getByRole('button', { name: '32' })
        await user.click(option32Button)

        // Wrong answer gets feedback styling, not selection styling
        expect(option32Button).toHaveClass('bg-zinc-800', 'border-zinc-700', 'text-zinc-400')
      })

      it('should show feedback after answer selection', async () => {
        const user = userEvent.setup()
        render(<QuestionComponent question={multipleChoiceQuestion} onAnswer={mockOnAnswer} />)

        await user.click(screen.getByRole('button', { name: '32' }))

        expect(screen.getByText('✗ Incorrect')).toBeInTheDocument()
      })

      it('should disable all buttons after correct answer', async () => {
        const user = userEvent.setup()
        render(<QuestionComponent question={multipleChoiceQuestion} onAnswer={mockOnAnswer} />)

        await user.click(screen.getByRole('button', { name: '64' }))

        await waitFor(() => {
          const buttons = screen.getAllByRole('button', { name: /^(32|64|100)$/ })
          buttons.forEach(button => {
            expect(button).toBeDisabled()
          })
        })
      })

      it('should call onAnswer with correct result after correct selection', async () => {
        const user = userEvent.setup()
        render(<QuestionComponent question={multipleChoiceQuestion} onAnswer={mockOnAnswer} />)

        await user.click(screen.getByRole('button', { name: '64' }))

        await waitFor(() => {
          expect(mockOnAnswer).toHaveBeenCalledWith(true)
        })
      })

      it('should not call onAnswer immediately for incorrect selection', async () => {
        const user = userEvent.setup()
        render(<QuestionComponent question={multipleChoiceQuestion} onAnswer={mockOnAnswer} />)

        await user.click(screen.getByRole('button', { name: '32' }))

        expect(mockOnAnswer).not.toHaveBeenCalled()
      })
    })

    describe('Feedback Display', () => {
      it('should show correct feedback with green styling for correct answer', async () => {
        const user = userEvent.setup()
        render(<QuestionComponent question={multipleChoiceQuestion} onAnswer={mockOnAnswer} />)

        const correctButton = screen.getByRole('button', { name: '64' })
        await user.click(correctButton)

        expect(screen.getByText('✓ Correct')).toBeInTheDocument()
        expect(screen.getByText('✓ Correct')).toHaveClass('text-emerald-300')
        expect(correctButton).toHaveClass('bg-emerald-900', 'border-emerald-700')
      })

      it('should show incorrect feedback with dimmed styling for wrong answer', async () => {
        const user = userEvent.setup()
        render(<QuestionComponent question={multipleChoiceQuestion} onAnswer={mockOnAnswer} />)

        const wrongButton = screen.getByRole('button', { name: '32' })
        await user.click(wrongButton)

        expect(screen.getByText('✗ Incorrect')).toBeInTheDocument()
        expect(screen.getByText('✗ Incorrect')).toHaveClass('text-zinc-300')
        expect(wrongButton).toHaveClass('bg-zinc-800', 'border-zinc-700', 'text-zinc-400')
      })

      it('should show explanation only for correct answers', async () => {
        const user = userEvent.setup()
        render(<QuestionComponent question={multipleChoiceQuestion} onAnswer={mockOnAnswer} />)

        // Wrong answer - no explanation
        await user.click(screen.getByRole('button', { name: '32' }))
        expect(screen.queryByText(multipleChoiceQuestion.explanation)).not.toBeInTheDocument()

        // Reset and try correct answer
        await user.click(screen.getByRole('button', { name: 'Réessayer' }))
        await user.click(screen.getByRole('button', { name: '64' }))

        await waitFor(() => {
          expect(screen.getByText(multipleChoiceQuestion.explanation)).toBeInTheDocument()
        })
      })

      it('should show retry button for incorrect answers', async () => {
        const user = userEvent.setup()
        render(<QuestionComponent question={multipleChoiceQuestion} onAnswer={mockOnAnswer} />)

        await user.click(screen.getByRole('button', { name: '32' }))

        expect(screen.getByRole('button', { name: 'Réessayer' })).toBeInTheDocument()
      })

      it('should not show retry button for correct answers', async () => {
        const user = userEvent.setup()
        render(<QuestionComponent question={multipleChoiceQuestion} onAnswer={mockOnAnswer} />)

        await user.click(screen.getByRole('button', { name: '64' }))

        expect(screen.queryByRole('button', { name: 'Réessayer' })).not.toBeInTheDocument()
      })
    })

    describe('Retry Functionality', () => {
      it('should reset state when retry button is clicked', async () => {
        const user = userEvent.setup()
        render(<QuestionComponent question={multipleChoiceQuestion} onAnswer={mockOnAnswer} />)

        // Select wrong answer
        await user.click(screen.getByRole('button', { name: '32' }))
        expect(screen.getByText('✗ Incorrect')).toBeInTheDocument()

        // Click retry
        await user.click(screen.getByRole('button', { name: 'Réessayer' }))

        // Feedback should be hidden
        expect(screen.queryByText('✗ Incorrect')).not.toBeInTheDocument()

        // Buttons should be re-enabled and not highlighted
        const button32 = screen.getByRole('button', { name: '32' })
        expect(button32).not.toBeDisabled()
        expect(button32).not.toHaveClass('bg-amber-900')
      })

      it('should allow selecting different answer after retry', async () => {
        const user = userEvent.setup()
        render(<QuestionComponent question={multipleChoiceQuestion} onAnswer={mockOnAnswer} />)

        // Select wrong answer and retry
        await user.click(screen.getByRole('button', { name: '32' }))
        await user.click(screen.getByRole('button', { name: 'Réessayer' }))

        // Select correct answer
        await user.click(screen.getByRole('button', { name: '64' }))

        await waitFor(() => {
          expect(screen.getByText('✓ Correct')).toBeInTheDocument()
          expect(mockOnAnswer).toHaveBeenCalledWith(true)
        })
      })
    })

    describe('Button Styling States', () => {
      it('should apply unselected styling initially', () => {
        render(<QuestionComponent question={multipleChoiceQuestion} onAnswer={mockOnAnswer} />)

        const buttons = screen.getAllByRole('button', { name: /^(32|64|100)$/ })
        buttons.forEach(button => {
          expect(button).toHaveClass('bg-zinc-800', 'border-zinc-700', 'text-zinc-200')
        })
      })

      it('should apply correct answer styling in feedback mode', async () => {
        const user = userEvent.setup()
        render(<QuestionComponent question={multipleChoiceQuestion} onAnswer={mockOnAnswer} />)

        await user.click(screen.getByRole('button', { name: '32' })) // Wrong answer

        const correctButton = screen.getByRole('button', { name: '64' })
        const wrongButton = screen.getByRole('button', { name: '32' })
        const otherButton = screen.getByRole('button', { name: '100' })

        expect(correctButton).toHaveClass('bg-emerald-900', 'border-emerald-700', 'text-zinc-100')
        expect(wrongButton).toHaveClass('bg-zinc-800', 'border-zinc-700', 'text-zinc-400')
        expect(otherButton).toHaveClass('bg-zinc-800', 'border-zinc-700', 'text-zinc-300')
      })
    })
  })

  describe('Move-Based Questions', () => {
    it('should render MoveBasedQuestion component for move-based type', () => {
      render(<QuestionComponent question={moveBasedQuestion} onAnswer={mockOnAnswer} />)

      expect(screen.getByTestId('move-based-question')).toBeInTheDocument()
      expect(screen.getByText('Déplacez un pion')).toBeInTheDocument()
    })

    it('should handle move answer callback', async () => {
      const user = userEvent.setup()
      render(<QuestionComponent question={moveBasedQuestion} onAnswer={mockOnAnswer} />)

      await user.click(screen.getByRole('button', { name: 'Make Move' }))

      expect(mockOnAnswer).toHaveBeenCalledWith(true)
    })
  })

  describe('Edge Cases', () => {
    it('should return null for unknown question types', () => {
      const unknownQuestion = {
        ...multipleChoiceQuestion,
        type: 'unknown' as any
      }

      const { container } = render(
        <QuestionComponent question={unknownQuestion} onAnswer={mockOnAnswer} />
      )
      expect(container).toBeEmptyDOMElement()
    })

    it('should return null for multiple-choice without options', () => {
      const questionWithoutOptions = {
        ...multipleChoiceQuestion,
        options: undefined
      }

      const { container } = render(
        <QuestionComponent question={questionWithoutOptions} onAnswer={mockOnAnswer} />
      )
      expect(container).toBeEmptyDOMElement()
    })

    it('should handle clicking disabled buttons gracefully', async () => {
      const user = userEvent.setup()
      render(<QuestionComponent question={multipleChoiceQuestion} onAnswer={mockOnAnswer} />)

      // Answer correctly to disable buttons
      await user.click(screen.getByRole('button', { name: '64' }))

      // Wait for the answer callback to be triggered
      await waitFor(() => {
        expect(mockOnAnswer).toHaveBeenCalledWith(true)
      })

      await waitFor(() => {
        const button = screen.getByRole('button', { name: '32' })
        expect(button).toBeDisabled()
      })

      // Try clicking disabled button - should not cause errors
      const disabledButton = screen.getByRole('button', { name: '32' })
      await user.click(disabledButton)

      // Should only be called once from the correct answer
      expect(mockOnAnswer).toHaveBeenCalledTimes(1)
    })
  })

  describe('Accessibility', () => {
    it('should have proper button roles and names', () => {
      render(<QuestionComponent question={multipleChoiceQuestion} onAnswer={mockOnAnswer} />)

      multipleChoiceQuestion.options?.forEach(option => {
        const button = screen.getByRole('button', { name: option })
        expect(button).toBeInTheDocument()
      })
    })

    it('should have proper heading for question prompt', () => {
      render(<QuestionComponent question={multipleChoiceQuestion} onAnswer={mockOnAnswer} />)

      const heading = screen.getByRole('heading', { name: multipleChoiceQuestion.prompt })
      expect(heading).toBeInTheDocument()
    })

    it('should maintain focus management during interactions', async () => {
      const user = userEvent.setup()
      render(<QuestionComponent question={multipleChoiceQuestion} onAnswer={mockOnAnswer} />)

      const button = screen.getByRole('button', { name: '32' })
      await user.click(button)

      // Button should still be in DOM and functional for incorrect answers
      expect(button).toBeInTheDocument()
      expect(button).not.toBeDisabled() // Only disabled after correct answer

      // But correct answer should disable all buttons
      await user.click(screen.getByRole('button', { name: 'Réessayer' }))
      await user.click(screen.getByRole('button', { name: '64' }))

      await waitFor(() => {
        expect(button).toBeDisabled()
      })
    })
  })
})
