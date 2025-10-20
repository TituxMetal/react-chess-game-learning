import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MultipleChoice, MultipleChoiceProps } from './MultipleChoice'
import { Question } from '~/types/story'
import { resetQuestionState } from '~/lib/stores/questionStore'

describe('MultipleChoice', () => {
  const mockQuestion: Question = {
    type: 'multiple-choice',
    prompt: 'Quelle est la meilleure ouverture pour les débutants?',
    options: [
      'La défense sicilienne',
      'Le gambit du roi',
      'La partie italienne',
      'La défense française',
    ],
    correctAnswer: 'La partie italienne',
    explanation: 'La partie italienne est recommandée pour les débutants.',
  }

  const mockOnAnswer = vi.fn()

  const renderComponent = (props: Partial<MultipleChoiceProps> = {}): void => {
    render(
      <MultipleChoice
        question={mockQuestion}
        onAnswer={mockOnAnswer}
        {...props}
      />
    )
  }

  beforeEach(() => {
    resetQuestionState()
    mockOnAnswer.mockClear()
  })

  describe('Rendering', () => {
    it('should render question prompt in French', () => {
      renderComponent()
      expect(screen.getByText(mockQuestion.prompt)).toBeInTheDocument()
    })

    it('should render all answer options as buttons', () => {
      renderComponent()
      mockQuestion.options?.forEach((option) => {
        expect(screen.getByRole('button', { name: option })).toBeInTheDocument()
      })
    })

    it('should not show submit button initially', () => {
      renderComponent()
      expect(screen.queryByRole('button', { name: /soumettre/i })).not.toBeInTheDocument()
    })
  })

  describe('Selection', () => {
    it('should highlight selected option when clicked', async () => {
      const user = userEvent.setup()
      renderComponent()

      const option = screen.getByRole('button', { name: 'La partie italienne' })
      await user.click(option)

      expect(option).toHaveClass('border-blue-500', 'bg-blue-50')
    })

    it('should show submit button after selecting an option', async () => {
      const user = userEvent.setup()
      renderComponent()

      const option = screen.getByRole('button', { name: 'La partie italienne' })
      await user.click(option)

      expect(screen.getByRole('button', { name: /soumettre/i })).toBeInTheDocument()
    })

    it('should allow changing selection before submission', async () => {
      const user = userEvent.setup()
      renderComponent()

      const option1 = screen.getByRole('button', { name: 'La défense sicilienne' })
      const option2 = screen.getByRole('button', { name: 'La partie italienne' })

      await user.click(option1)
      expect(option1).toHaveClass('border-blue-500')

      await user.click(option2)
      expect(option2).toHaveClass('border-blue-500')
      expect(option1).not.toHaveClass('border-blue-500')
    })
  })

  describe('Submission and Validation', () => {
    it('should trigger onAnswer with correct=true when submitting correct answer', async () => {
      const user = userEvent.setup()
      renderComponent()

      const correctOption = screen.getByRole('button', { name: 'La partie italienne' })
      await user.click(correctOption)

      const submitButton = screen.getByRole('button', { name: /soumettre/i })
      await user.click(submitButton)

      expect(mockOnAnswer).toHaveBeenCalledWith('La partie italienne', true)
      expect(mockOnAnswer).toHaveBeenCalledTimes(1)
    })

    it('should trigger onAnswer with correct=false when submitting incorrect answer', async () => {
      const user = userEvent.setup()
      renderComponent()

      const incorrectOption = screen.getByRole('button', { name: 'La défense sicilienne' })
      await user.click(incorrectOption)

      const submitButton = screen.getByRole('button', { name: /soumettre/i })
      await user.click(submitButton)

      expect(mockOnAnswer).toHaveBeenCalledWith('La défense sicilienne', false)
      expect(mockOnAnswer).toHaveBeenCalledTimes(1)
    })

    it('should show feedback display after submission', async () => {
      const user = userEvent.setup()
      renderComponent()

      const option = screen.getByRole('button', { name: 'La partie italienne' })
      await user.click(option)

      const submitButton = screen.getByRole('button', { name: /soumettre/i })
      await user.click(submitButton)

      // After submission, FeedbackDisplay should be shown
      expect(screen.getByRole('heading', { name: /correct !/i })).toBeInTheDocument()
      expect(screen.getByText(mockQuestion.explanation)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /continuer/i })).toBeInTheDocument()
    })

    it('should allow returning to question after clicking continue', async () => {
      const user = userEvent.setup()
      renderComponent()

      const option1 = screen.getByRole('button', { name: 'La partie italienne' })
      await user.click(option1)

      const submitButton = screen.getByRole('button', { name: /soumettre/i })
      await user.click(submitButton)

      // FeedbackDisplay should be shown
      expect(screen.getByRole('heading', { name: /correct !/i })).toBeInTheDocument()

      // Click continue button
      const continueButton = screen.getByRole('button', { name: /continuer/i })
      await user.click(continueButton)

      // Question interface should be back (question state reset)
      expect(screen.getByText(mockQuestion.prompt)).toBeInTheDocument()
      expect(mockOnAnswer).toHaveBeenCalledTimes(1)
    })

    it('should hide submit button after submission', async () => {
      const user = userEvent.setup()
      renderComponent()

      const option = screen.getByRole('button', { name: 'La partie italienne' })
      await user.click(option)

      const submitButton = screen.getByRole('button', { name: /soumettre/i })
      await user.click(submitButton)

      expect(screen.queryByRole('button', { name: /soumettre/i })).not.toBeInTheDocument()
    })
  })

  describe('Keyboard Navigation', () => {
    it('should navigate to next option with ArrowDown key', async () => {
      const user = userEvent.setup()
      renderComponent()

      await user.keyboard('{ArrowDown}')
      const secondOption = screen.getByRole('button', { name: 'Le gambit du roi' })
      expect(secondOption).toHaveClass('ring-2', 'ring-blue-400')
    })

    it('should navigate to previous option with ArrowUp key', async () => {
      const user = userEvent.setup()
      renderComponent()

      await user.keyboard('{ArrowDown}')
      await user.keyboard('{ArrowDown}')
      await user.keyboard('{ArrowUp}')

      const secondOption = screen.getByRole('button', { name: 'Le gambit du roi' })
      expect(secondOption).toHaveClass('ring-2', 'ring-blue-400')
    })

    it('should wrap around when navigating past last option with ArrowDown', async () => {
      const user = userEvent.setup()
      renderComponent()

      await user.keyboard('{ArrowDown}')
      await user.keyboard('{ArrowDown}')
      await user.keyboard('{ArrowDown}')
      await user.keyboard('{ArrowDown}')

      const firstOption = screen.getByRole('button', { name: 'La défense sicilienne' })
      expect(firstOption).toHaveClass('ring-2', 'ring-blue-400')
    })

    it('should wrap around when navigating past first option with ArrowUp', async () => {
      const user = userEvent.setup()
      renderComponent()

      await user.keyboard('{ArrowUp}')

      const lastOption = screen.getByRole('button', { name: 'La défense française' })
      expect(lastOption).toHaveClass('ring-2', 'ring-blue-400')
    })

    it('should select focused option when pressing Enter (first press)', async () => {
      const user = userEvent.setup()
      renderComponent()

      await user.keyboard('{ArrowDown}')
      await user.keyboard('{ArrowDown}')
      await user.keyboard('{Enter}')

      const thirdOption = screen.getByRole('button', { name: 'La partie italienne' })
      expect(thirdOption).toHaveClass('border-blue-500')
      expect(screen.getByRole('button', { name: /soumettre/i })).toBeInTheDocument()
    })

    it('should submit selected answer when pressing Enter (second press)', async () => {
      const user = userEvent.setup()
      renderComponent()

      await user.keyboard('{ArrowDown}')
      await user.keyboard('{ArrowDown}')
      await user.keyboard('{Enter}')
      await user.keyboard('{Enter}')

      expect(mockOnAnswer).toHaveBeenCalledWith('La partie italienne', true)
    })

    it('should disable keyboard navigation after submission', async () => {
      const user = userEvent.setup()
      renderComponent()

      await user.keyboard('{ArrowDown}')
      await user.keyboard('{Enter}')
      await user.keyboard('{Enter}')

      await user.keyboard('{ArrowDown}')
      await user.keyboard('{ArrowDown}')

      expect(mockOnAnswer).toHaveBeenCalledTimes(1)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty options array gracefully', () => {
      const emptyQuestion: Question = {
        ...mockQuestion,
        options: [],
      }

      render(<MultipleChoice question={emptyQuestion} onAnswer={mockOnAnswer} />)
      expect(screen.getByText(mockQuestion.prompt)).toBeInTheDocument()
    })

    it('should handle question without options property', () => {
      const questionWithoutOptions: Question = {
        type: 'multiple-choice',
        prompt: 'Question sans options',
        correctAnswer: 'Réponse',
        explanation: 'Explication',
      }

      render(<MultipleChoice question={questionWithoutOptions} onAnswer={mockOnAnswer} />)
      expect(screen.getByText('Question sans options')).toBeInTheDocument()
    })

    it('should not submit without selecting an option', async () => {
      const user = userEvent.setup()
      renderComponent()

      await user.keyboard('{Enter}')

      expect(mockOnAnswer).not.toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('should have visible focus indicators on option buttons', async () => {
      const user = userEvent.setup()
      renderComponent()

      const firstButton = screen.getByRole('button', { name: 'La défense sicilienne' })
      await user.tab()

      expect(firstButton).toHaveClass('focus:outline-none', 'focus:ring-2')
    })

    it('should maintain focus state separately from selection state', async () => {
      const user = userEvent.setup()
      renderComponent()

      await user.keyboard('{ArrowDown}')
      const focusedOption = screen.getByRole('button', { name: 'Le gambit du roi' })

      await user.click(screen.getByRole('button', { name: 'La partie italienne' }))

      expect(focusedOption).toHaveClass('ring-2')
      expect(screen.getByRole('button', { name: 'La partie italienne' })).toHaveClass('border-blue-500')
    })
  })
})
