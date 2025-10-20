import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FeedbackDisplay } from './FeedbackDisplay'

describe('FeedbackDisplay', () => {
  it('renders "Correct !" message when correct=true', () => {
    render(
      <FeedbackDisplay
        correct={true}
        explanation="Bien joué !"
        onContinue={vi.fn()}
      />
    )

    expect(screen.getByRole('heading', { name: /correct !/i })).toBeInTheDocument()
  })

  it('renders "Incorrect" message when correct=false', () => {
    render(
      <FeedbackDisplay
        correct={false}
        explanation="Essayez encore."
        onContinue={vi.fn()}
      />
    )

    expect(screen.getByRole('heading', { name: /incorrect/i })).toBeInTheDocument()
  })

  it('applies green styling for correct answers', () => {
    const { container } = render(
      <FeedbackDisplay
        correct={true}
        explanation="Great!"
        onContinue={vi.fn()}
      />
    )

    const feedbackDiv = container.querySelector('[role="status"]')
    expect(feedbackDiv).toHaveClass('bg-green-100')
    expect(feedbackDiv).toHaveClass('border-green-400')
  })

  it('applies orange styling for incorrect answers', () => {
    const { container } = render(
      <FeedbackDisplay
        correct={false}
        explanation="Try again"
        onContinue={vi.fn()}
      />
    )

    const feedbackDiv = container.querySelector('[role="status"]')
    expect(feedbackDiv).toHaveClass('bg-orange-100')
    expect(feedbackDiv).toHaveClass('border-orange-400')
  })

  it('renders Markdown explanation correctly', () => {
    render(
      <FeedbackDisplay
        correct={true}
        explanation="**Bold text** and *italic text*"
        onContinue={vi.fn()}
      />
    )

    expect(screen.getByText('Bold text')).toBeInTheDocument()
    expect(screen.getByText(/italic text/)).toBeInTheDocument()
  })

  it('renders Markdown lists correctly', () => {
    const explanation = `
Points importants:
- Premier point
- Deuxième point
- Troisième point
    `

    render(
      <FeedbackDisplay
        correct={true}
        explanation={explanation}
        onContinue={vi.fn()}
      />
    )

    expect(screen.getByText(/Premier point/)).toBeInTheDocument()
    expect(screen.getByText(/Deuxième point/)).toBeInTheDocument()
  })

  it('renders Markdown code blocks correctly', () => {
    const explanation = '```js\nconst x = 5\n```'

    render(
      <FeedbackDisplay
        correct={true}
        explanation={explanation}
        onContinue={vi.fn()}
      />
    )

    expect(screen.getByText(/const x = 5/)).toBeInTheDocument()
  })

  it('"Continuer" button triggers callback', async () => {
    const user = userEvent.setup()
    const onContinue = vi.fn()

    render(
      <FeedbackDisplay
        correct={true}
        explanation="Good job"
        onContinue={onContinue}
      />
    )

    const button = screen.getByRole('button', { name: /continuer/i })
    await user.click(button)

    expect(onContinue).toHaveBeenCalledTimes(1)
  })

  it('aria-live region announces result', () => {
    const { container } = render(
      <FeedbackDisplay
        correct={true}
        explanation="Success"
        onContinue={vi.fn()}
      />
    )

    const liveRegion = container.querySelector('[aria-live="polite"]')
    expect(liveRegion).toBeInTheDocument()
    expect(liveRegion).toHaveAttribute('role', 'status')
  })

  it('component is keyboard accessible', async () => {
    const user = userEvent.setup()
    const onContinue = vi.fn()

    render(
      <FeedbackDisplay
        correct={false}
        explanation="Not quite"
        onContinue={onContinue}
      />
    )

    const button = screen.getByRole('button', { name: /continuer/i })
    button.focus()
    expect(button).toHaveFocus()

    await user.keyboard('{Enter}')
    expect(onContinue).toHaveBeenCalledTimes(1)
  })

  it('displays checkmark icon for correct answers', () => {
    render(
      <FeedbackDisplay
        correct={true}
        explanation="Correct"
        onContinue={vi.fn()}
      />
    )

    expect(screen.getByText('✓')).toBeInTheDocument()
  })

  it('displays warning icon for incorrect answers', () => {
    render(
      <FeedbackDisplay
        correct={false}
        explanation="Wrong"
        onContinue={vi.fn()}
      />
    )

    expect(screen.getByText('⚠')).toBeInTheDocument()
  })

  it('handles empty explanation text', () => {
    render(
      <FeedbackDisplay
        correct={true}
        explanation=""
        onContinue={vi.fn()}
      />
    )

    expect(screen.getByRole('heading', { name: /correct !/i })).toBeInTheDocument()
  })

  it('handles long explanation with complex formatting', () => {
    const longExplanation = `
# Titre principal

Voici un **texte long** avec plusieurs paragraphes.

## Sous-titre

- Liste 1
- Liste 2
  - Sous-liste A
  - Sous-liste B

> Citation importante

\`\`\`javascript
function test() {
  return true
}
\`\`\`

Texte final avec *emphase* et **gras**.
    `

    render(
      <FeedbackDisplay
        correct={true}
        explanation={longExplanation}
        onContinue={vi.fn()}
      />
    )

    expect(screen.getByText(/Titre principal/)).toBeInTheDocument()
    expect(screen.getByText(/texte long/)).toBeInTheDocument()
  })

  it('handles French special characters in explanation', () => {
    const frenchText = 'Très bien ! Voilà une réponse élégante avec des caractères accentués : à, è, é, ê, ç, ù.'

    render(
      <FeedbackDisplay
        correct={true}
        explanation={frenchText}
        onContinue={vi.fn()}
      />
    )

    expect(screen.getByText(/Très bien !/)).toBeInTheDocument()
    expect(screen.getByText(/élégante/)).toBeInTheDocument()
  })

  it('continuer button has proper ARIA label', () => {
    render(
      <FeedbackDisplay
        correct={true}
        explanation="Test"
        onContinue={vi.fn()}
      />
    )

    const button = screen.getByLabelText('Continuer vers le prochain chapitre')
    expect(button).toBeInTheDocument()
  })
})
