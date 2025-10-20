import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MultipleChoice } from './MultipleChoice'
import { Question } from '~/types/story'
import { resetQuestionState } from '~/lib/stores/questionStore'

describe('Question-Answer-Feedback Integration Flow', () => {
  const mockQuestion: Question = {
    type: 'multiple-choice',
    prompt: 'Quelle est la meilleure ouverture pour les débutants ?',
    options: [
      'La partie italienne',
      'La défense sicilienne',
      "Le gambit du roi",
      'La défense française'
    ],
    correctAnswer: 'La partie italienne',
    explanation: 'La partie italienne est recommandée pour les débutants car elle suit les principes fondamentaux : **contrôle du centre**, **développement rapide des pièces** et **sécurité du roi**.'
  }

  const mockOnAnswer = vi.fn()

  beforeEach(() => {
    mockOnAnswer.mockClear()
    resetQuestionState()
  })

  it('should complete full question-answer-feedback-reset workflow for correct answer', async () => {
    const user = userEvent.setup()
    render(<MultipleChoice question={mockQuestion} onAnswer={mockOnAnswer} />)

    // STEP 1: Verify question is displayed
    expect(screen.getByText(mockQuestion.prompt)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'La partie italienne' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'La défense sicilienne' })).toBeInTheDocument()

    // STEP 2: Select correct answer
    const correctOption = screen.getByRole('button', { name: 'La partie italienne' })
    await user.click(correctOption)

    // STEP 3: Submit answer
    const submitButton = screen.getByRole('button', { name: /soumettre/i })
    expect(submitButton).toBeInTheDocument()
    await user.click(submitButton)

    // STEP 4: Verify onAnswer callback was called with correct data
    expect(mockOnAnswer).toHaveBeenCalledWith('La partie italienne', true)
    expect(mockOnAnswer).toHaveBeenCalledTimes(1)

    // STEP 5: Verify FeedbackDisplay is shown with correct feedback
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /correct !/i })).toBeInTheDocument()
    })

    // STEP 6: Verify explanation text from frontmatter is displayed with Markdown
    expect(screen.getByText(/la partie italienne est recommandée/i)).toBeInTheDocument()
    expect(screen.getByText('contrôle du centre')).toBeInTheDocument()
    expect(screen.getByText('développement rapide des pièces')).toBeInTheDocument()

    // STEP 7: Verify "Continuer" button is present
    const continueButton = screen.getByRole('button', { name: /continuer/i })
    expect(continueButton).toBeInTheDocument()

    // STEP 8: Click continue to reset and return to question
    await user.click(continueButton)

    // STEP 9: Verify question interface is restored
    await waitFor(() => {
      expect(screen.getByText(mockQuestion.prompt)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'La partie italienne' })).toBeInTheDocument()
    })

    // STEP 10: Verify state is reset (no submit button visible without selection)
    expect(screen.queryByRole('button', { name: /soumettre/i })).not.toBeInTheDocument()
  })

  it('should complete full question-answer-feedback-reset workflow for incorrect answer', async () => {
    const user = userEvent.setup()
    render(<MultipleChoice question={mockQuestion} onAnswer={mockOnAnswer} />)

    // Select incorrect answer
    const incorrectOption = screen.getByRole('button', { name: 'La défense sicilienne' })
    await user.click(incorrectOption)

    // Submit answer
    const submitButton = screen.getByRole('button', { name: /soumettre/i })
    await user.click(submitButton)

    // Verify onAnswer callback was called with incorrect data
    expect(mockOnAnswer).toHaveBeenCalledWith('La défense sicilienne', false)

    // Verify FeedbackDisplay shows "Incorrect" message
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /incorrect/i })).toBeInTheDocument()
    })

    // Verify explanation is still shown (learning from mistakes)
    expect(screen.getByText(/la partie italienne est recommandée/i)).toBeInTheDocument()

    // Verify warning icon is shown (⚠)
    expect(screen.getByText('⚠')).toBeInTheDocument()

    // Click continue to reset
    const continueButton = screen.getByRole('button', { name: /continuer/i })
    await user.click(continueButton)

    // Verify return to question interface
    await waitFor(() => {
      expect(screen.getByText(mockQuestion.prompt)).toBeInTheDocument()
    })
  })

  it('should display explanation with complex Markdown formatting', async () => {
    const user = userEvent.setup()
    const questionWithComplexMarkdown: Question = {
      ...mockQuestion,
      explanation: `# Explication détaillée

La partie italienne est excellente parce que :

1. **Contrôle du centre** avec les pions
2. *Développement harmonieux* des pièces
3. Protection du roi par le petit roque

> "Aux échecs, la connaissance des ouvertures est fondamentale." - José Raúl Capablanca

\`\`\`
e4 e5
Nf3 Nc6
Bc4
\`\`\`

Évitez les erreurs courantes comme :
- Sortir la dame trop tôt
- Négliger le développement
- Oublier de roquer`
    }

    render(<MultipleChoice question={questionWithComplexMarkdown} onAnswer={mockOnAnswer} />)

    // Select and submit
    await user.click(screen.getByRole('button', { name: 'La partie italienne' }))
    await user.click(screen.getByRole('button', { name: /soumettre/i }))

    // Verify complex Markdown is rendered
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /correct !/i })).toBeInTheDocument()
    })

    // Check for various Markdown elements
    expect(screen.getByText(/explication détaillée/i)).toBeInTheDocument()
    expect(screen.getByText('Contrôle du centre')).toBeInTheDocument()
    expect(screen.getByText(/développement harmonieux/i)).toBeInTheDocument()
    expect(screen.getByText(/josé raúl capablanca/i)).toBeInTheDocument()
    expect(screen.getByText(/évitez les erreurs/i)).toBeInTheDocument()
  })

  it('should handle empty explanation gracefully', async () => {
    const user = userEvent.setup()
    const questionWithEmptyExplanation: Question = {
      ...mockQuestion,
      explanation: ''
    }

    render(<MultipleChoice question={questionWithEmptyExplanation} onAnswer={mockOnAnswer} />)

    // Select and submit
    await user.click(screen.getByRole('button', { name: 'La partie italienne' }))
    await user.click(screen.getByRole('button', { name: /soumettre/i }))

    // Verify feedback is still shown even with empty explanation
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /correct !/i })).toBeInTheDocument()
    })

    expect(screen.getByRole('button', { name: /continuer/i })).toBeInTheDocument()
  })

  it('should be keyboard accessible throughout the entire flow', async () => {
    const user = userEvent.setup()
    render(<MultipleChoice question={mockQuestion} onAnswer={mockOnAnswer} />)

    // Navigate with keyboard - initial focus is at index 0 (first option)
    await user.keyboard('{Enter}')     // Select first option (La partie italienne)

    // Submit with keyboard
    const submitButton = await screen.findByRole('button', { name: /soumettre/i })
    submitButton.focus()
    await user.keyboard('{Enter}')

    // Verify feedback is shown with correct answer
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /correct !/i })).toBeInTheDocument()
    })

    // Continue with keyboard
    const continueButton = screen.getByRole('button', { name: /continuer/i })
    continueButton.focus()
    expect(continueButton).toHaveFocus()
    await user.keyboard('{Enter}')

    // Verify return to question
    await waitFor(() => {
      expect(screen.getByText(mockQuestion.prompt)).toBeInTheDocument()
    })
  })
})
