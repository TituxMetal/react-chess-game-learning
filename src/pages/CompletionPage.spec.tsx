import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { CompletionPage } from './CompletionPage'
import * as navigationUtils from '~/utils/navigation'
import * as questionStore from '~/lib/stores/questionStore'

// Mock react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ storyId: 'test-story' })
  }
})

// Mock useProgress hook
vi.mock('~/hooks/useProgress', () => ({
  useProgress: () => ({
    progress: {
      completedChapters: new Set(['test-story-chapter1', 'test-story-chapter2'])
    }
  })
}))

const mockStoryIndex = [
  {
    id: 'test-story',
    title: 'Histoire de test',
    chapters: [
      { id: 'chapter1', title: 'Chapitre 1' },
      { id: 'chapter2', title: 'Chapitre 2' }
    ],
    nextStory: 'next-story',
    keyConcepts: [
      'Contrôle du centre',
      'Développement des pièces',
      'Sécurité du roi'
    ]
  },
  {
    id: 'next-story',
    title: 'Prochaine histoire',
    chapters: [{ id: 'chapter1', title: 'Chapitre 1' }]
  }
]

describe('CompletionPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    vi.spyOn(navigationUtils, 'loadStoryIndex').mockResolvedValue(mockStoryIndex)
    vi.spyOn(questionStore, 'getStoryStats').mockReturnValue({
      totalQuestions: 5,
      correctAnswers: 4
    })
  })

  it('renders "Bravo !" congratulatory message', async () => {
    render(
      <BrowserRouter>
        <CompletionPage />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /bravo !/i })).toBeInTheDocument()
    })
  })

  it('displays key concepts list correctly', async () => {
    render(
      <BrowserRouter>
        <CompletionPage />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Ce que vous avez appris :')).toBeInTheDocument()
      expect(screen.getByText('Contrôle du centre')).toBeInTheDocument()
      expect(screen.getByText('Développement des pièces')).toBeInTheDocument()
      expect(screen.getByText('Sécurité du roi')).toBeInTheDocument()
    })
  })

  it('calculates and shows completion stats', async () => {
    render(
      <BrowserRouter>
        <CompletionPage />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('4/5')).toBeInTheDocument()
      expect(screen.getByText('réponses correctes')).toBeInTheDocument()
      expect(screen.getByText('Score : 80%')).toBeInTheDocument()
    })
  })

  it('"Continuer" button navigates to next story', async () => {
    const user = userEvent.setup()

    render(
      <BrowserRouter>
        <CompletionPage />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByLabelText(/continuer vers l'histoire suivante/i)).toBeInTheDocument()
    })

    const continueButton = screen.getByLabelText(/continuer vers l'histoire suivante/i)
    await user.click(continueButton)

    expect(mockNavigate).toHaveBeenCalledWith('/story/next-story/chapter/chapter1')
  })

  it('"Retour à l\'accueil" button navigates to home', async () => {
    const user = userEvent.setup()

    render(
      <BrowserRouter>
        <CompletionPage />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByLabelText(/retour à l'accueil/i)).toBeInTheDocument()
    })

    const homeButton = screen.getByLabelText(/retour à l'accueil/i)
    await user.click(homeButton)

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('heading hierarchy is correct (h1, h2, h3)', async () => {
    render(
      <BrowserRouter>
        <CompletionPage />
      </BrowserRouter>
    )

    await waitFor(() => {
      const h1 = screen.getByRole('heading', { level: 1, name: /bravo !/i })
      const h2 = screen.getByRole('heading', { level: 2 })
      const h3 = screen.getByRole('heading', { level: 3, name: /ce que vous avez appris/i })

      expect(h1).toBeInTheDocument()
      expect(h2).toBeInTheDocument()
      expect(h3).toBeInTheDocument()
    })
  })

  it('component is keyboard accessible', async () => {
    const user = userEvent.setup()

    render(
      <BrowserRouter>
        <CompletionPage />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByLabelText(/continuer/i)).toBeInTheDocument()
    })

    const continueButton = screen.getByLabelText(/continuer vers l'histoire suivante/i)
    continueButton.focus()
    expect(continueButton).toHaveFocus()

    await user.keyboard('{Enter}')
    expect(mockNavigate).toHaveBeenCalled()
  })

  it('screen reader announces completion stats', async () => {
    const { container } = render(
      <BrowserRouter>
        <CompletionPage />
      </BrowserRouter>
    )

    await waitFor(() => {
      const liveRegion = container.querySelector('[aria-live="polite"]')
      expect(liveRegion).toBeInTheDocument()
      expect(liveRegion).toHaveTextContent('4/5')
    })
  })

  it('handles no key concepts defined in story metadata', async () => {
    const storyWithoutConcepts = [
      {
        id: 'test-story',
        title: 'Histoire sans concepts',
        chapters: [{ id: 'chapter1', title: 'Chapitre 1' }]
      }
    ]

    vi.spyOn(navigationUtils, 'loadStoryIndex').mockResolvedValue(storyWithoutConcepts)

    render(
      <BrowserRouter>
        <CompletionPage />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /bravo !/i })).toBeInTheDocument()
    })

    expect(screen.queryByText('Ce que vous avez appris :')).not.toBeInTheDocument()
  })

  it('handles zero questions answered (0/0 stats)', async () => {
    vi.spyOn(questionStore, 'getStoryStats').mockReturnValue({
      totalQuestions: 0,
      correctAnswers: 0
    })

    render(
      <BrowserRouter>
        <CompletionPage />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /bravo !/i })).toBeInTheDocument()
    })

    expect(screen.queryByText('réponses correctes')).not.toBeInTheDocument()
  })

  it('displays green styling for perfect score (all correct)', async () => {
    vi.spyOn(questionStore, 'getStoryStats').mockReturnValue({
      totalQuestions: 5,
      correctAnswers: 5
    })

    const { container } = render(
      <BrowserRouter>
        <CompletionPage />
      </BrowserRouter>
    )

    await waitFor(() => {
      const scoreElement = container.querySelector('.text-green-400')
      expect(scoreElement).toBeInTheDocument()
      expect(scoreElement).toHaveTextContent('5/5')
    })
  })

  it('displays yellow styling for low score (few correct)', async () => {
    vi.spyOn(questionStore, 'getStoryStats').mockReturnValue({
      totalQuestions: 10,
      correctAnswers: 3
    })

    const { container } = render(
      <BrowserRouter>
        <CompletionPage />
      </BrowserRouter>
    )

    await waitFor(() => {
      const scoreElement = container.querySelector('.text-yellow-400')
      expect(scoreElement).toBeInTheDocument()
      expect(scoreElement).toHaveTextContent('3/10')
    })
  })

  it('disables "Continuer" button when no next story available', async () => {
    const storyWithoutNext = [
      {
        id: 'test-story',
        title: 'Dernière histoire',
        chapters: [{ id: 'chapter1', title: 'Chapitre 1' }]
      }
    ]

    vi.spyOn(navigationUtils, 'loadStoryIndex').mockResolvedValue(storyWithoutNext)

    render(
      <BrowserRouter>
        <CompletionPage />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /bravo !/i })).toBeInTheDocument()
    })

    expect(screen.queryByLabelText(/continuer vers l'histoire suivante/i)).not.toBeInTheDocument()
  })

  it('displays motivational encouragement text', async () => {
    render(
      <BrowserRouter>
        <CompletionPage />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/excellent travail/i)).toBeInTheDocument()
      expect(screen.getByText(/maître des échecs/i)).toBeInTheDocument()
    })
  })

  it('shows celebratory icon', async () => {
    render(
      <BrowserRouter>
        <CompletionPage />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('🎉')).toBeInTheDocument()
    })
  })

  it('displays story title correctly', async () => {
    render(
      <BrowserRouter>
        <CompletionPage />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/tu as terminé "histoire de test"/i)).toBeInTheDocument()
    })
  })

  it('shows progress bars with correct ARIA labels', async () => {
    const { container } = render(
      <BrowserRouter>
        <CompletionPage />
      </BrowserRouter>
    )

    await waitFor(() => {
      const progressBars = container.querySelectorAll('[role="progressbar"]')
      expect(progressBars.length).toBeGreaterThan(0)

      const chapterProgressBar = Array.from(progressBars).find(
        bar => bar.getAttribute('aria-label')?.includes('progression')
      )
      expect(chapterProgressBar).toBeInTheDocument()

      const scoreProgressBar = Array.from(progressBars).find(
        bar => bar.getAttribute('aria-label')?.includes('réponses correctes')
      )
      expect(scoreProgressBar).toBeInTheDocument()
    })
  })
})
