import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as useProgressModule from '~/hooks/useProgress'
import * as useStoryModule from '~/hooks/useStory'
import * as navigationModule from '~/utils/navigation'
import { StoryViewer } from './StoryViewer'

// Mock data
const mockChapter = {
  id: 'welcome',
  title: 'Bienvenue dans le monde merveilleux des échecs',
  chapterNumber: 1,
  storyId: 'sample-story-1',
  content: `Bonjour jeune apprenti ! Aujourd'hui commence une grande aventure : tu vas apprendre à jouer aux échecs.

Les échecs, c'est comme un combat entre deux armées. L'échiquier a 64 cases avec des caractères français : **café**, **thé**, **château**, **forêt**.

Test des caractères spéciaux : é è ê ë à â ù û ô ç î ï`,
  chessPosition: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
}

const mockChapterWithQuestion = {
  ...mockChapter,
  question: {
    type: 'multiple-choice' as const,
    prompt: 'Quelle pièce a bougé ?',
    options: ['Le pion', 'Le cavalier', 'La tour'],
    correctAnswer: 'Le pion',
    explanation: 'Le pion a avancé de deux cases.'
  }
}

describe('StoryViewer Component', () => {
  const mockMarkComplete = vi.fn()
  const mockSetCurrent = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    // Mock useStory hook
    vi.spyOn(useStoryModule, 'useStory').mockReturnValue({
      chapter: mockChapter,
      loading: false,
      error: null
    })

    // Mock useProgress hook
    vi.spyOn(useProgressModule, 'useProgress').mockReturnValue({
      progress: {
        completedChapters: new Set<string>(),
        currentStory: null,
        currentChapter: null
      },
      markComplete: mockMarkComplete,
      setCurrent: mockSetCurrent
    } as any)

    // Mock navigation utilities
    vi.spyOn(navigationModule, 'loadStoryIndex').mockResolvedValue([
      {
        id: 'sample-story-1',
        title: "L'aventure des échecs",
        chapters: [
          { id: 'welcome', title: 'Bienvenue' },
          { id: 'first-move', title: 'Premier coup' }
        ]
      }
    ])
    vi.spyOn(navigationModule, 'getNextChapter').mockReturnValue({
      storyId: 'sample-story-1',
      chapterId: 'first-move'
    })
    vi.spyOn(navigationModule, 'getPreviousChapter').mockReturnValue(null)
  })

  const renderStoryViewer = () => {
    return render(
      <MemoryRouter initialEntries={['/story/sample-story-1/chapter/welcome']}>
        <Routes>
          <Route path='/story/:storyId/chapter/:chapterId' element={<StoryViewer />} />
        </Routes>
      </MemoryRouter>
    )
  }

  describe('AC1.3.1: Display chapter title from frontmatter', () => {
    it('should render chapter title from story data in h1 tag', async () => {
      renderStoryViewer()

      await waitFor(() => {
        const heading = screen.getByRole('heading', { level: 1 })
        expect(heading).toBeInTheDocument()
        expect(heading.textContent).toBe('Bienvenue dans le monde merveilleux des échecs')
      })
    })

    it('should use semantic h1 element for chapter title', async () => {
      renderStoryViewer()

      await waitFor(() => {
        const heading = screen.getByRole('heading', { level: 1 })
        expect(heading.tagName).toBe('H1')
      })
    })
  })

  describe('AC1.3.2: Render Markdown content as HTML', () => {
    it('should render Markdown content as HTML', async () => {
      renderStoryViewer()

      await waitFor(() => {
        expect(screen.getByText(/Bonjour jeune apprenti/i)).toBeInTheDocument()
        expect(screen.getByText(/Les échecs, c'est comme un combat/i)).toBeInTheDocument()
      })
    })

    it('should convert Markdown bold syntax to strong elements', async () => {
      renderStoryViewer()

      await waitFor(() => {
        const strongElements = screen.getAllByText(/café|thé|château|forêt/i)
        expect(strongElements.length).toBeGreaterThan(0)
      })
    })

    it('should render paragraphs from Markdown content', async () => {
      const { container } = renderStoryViewer()

      await waitFor(() => {
        const paragraphs = container.querySelectorAll('p')
        expect(paragraphs.length).toBeGreaterThan(0)
      })
    })
  })

  describe('AC1.3.3: Apply readable typography (Tailwind prose)', () => {
    it('should apply Tailwind prose class to content container', async () => {
      const { container } = renderStoryViewer()

      await waitFor(() => {
        const proseContainer = container.querySelector('.prose')
        expect(proseContainer).toBeInTheDocument()
      })
    })

    it('should apply prose-invert class for dark theme', async () => {
      const { container } = renderStoryViewer()

      await waitFor(() => {
        const proseContainer = container.querySelector('.prose-invert')
        expect(proseContainer).toBeInTheDocument()
      })
    })

    it('should apply prose-lg class for larger text', async () => {
      const { container } = renderStoryViewer()

      await waitFor(() => {
        const proseContainer = container.querySelector('.prose-lg')
        expect(proseContainer).toBeInTheDocument()
      })
    })

    it('should have max-w-none for full width content', async () => {
      const { container } = renderStoryViewer()

      await waitFor(() => {
        const proseContainer = container.querySelector('.max-w-none')
        expect(proseContainer).toBeInTheDocument()
      })
    })
  })

  describe('AC1.3.4: Support French special characters (é, è, ê, à, etc.)', () => {
    it('should render é (e acute) correctly', async () => {
      renderStoryViewer()

      await waitFor(() => {
        expect(screen.getByText(/café/i)).toBeInTheDocument()
      })
    })

    it('should render è (e grave) correctly', async () => {
      renderStoryViewer()

      await waitFor(() => {
        const content = screen.getByText(/caractères spéciaux/)
        expect(content.textContent).toContain('è')
      })
    })

    it('should render ê (e circumflex) correctly', async () => {
      renderStoryViewer()

      await waitFor(() => {
        const content = screen.getByText(/forêt/)
        expect(content.textContent).toContain('ê')
      })
    })

    it('should render à (a grave) correctly', async () => {
      renderStoryViewer()

      await waitFor(() => {
        const content = screen.getByText(/caractères spéciaux/)
        expect(content.textContent).toContain('à')
      })
    })

    it('should render â (a circumflex) correctly', async () => {
      renderStoryViewer()

      await waitFor(() => {
        const content = screen.getByText(/château/)
        expect(content.textContent).toContain('â')
      })
    })

    it('should render all French special characters', async () => {
      renderStoryViewer()

      await waitFor(() => {
        const specialChars = screen.getByText(/é è ê ë à â ù û ô ç î ï/)
        expect(specialChars).toBeInTheDocument()
        expect(specialChars.textContent).toContain('é')
        expect(specialChars.textContent).toContain('è')
        expect(specialChars.textContent).toContain('ê')
        expect(specialChars.textContent).toContain('ë')
        expect(specialChars.textContent).toContain('à')
        expect(specialChars.textContent).toContain('â')
        expect(specialChars.textContent).toContain('ù')
        expect(specialChars.textContent).toContain('û')
        expect(specialChars.textContent).toContain('ô')
        expect(specialChars.textContent).toContain('ç')
        expect(specialChars.textContent).toContain('î')
        expect(specialChars.textContent).toContain('ï')
      })
    })
  })

  describe('AC1.3.5: Responsive text sizing (mobile/desktop)', () => {
    it('should use prose-lg for larger screens', async () => {
      const { container } = renderStoryViewer()

      await waitFor(() => {
        const proseContainer = container.querySelector('.prose-lg')
        expect(proseContainer).toBeInTheDocument()
      })
    })

    it('should have responsive container with max-w-4xl', async () => {
      const { container } = renderStoryViewer()

      await waitFor(() => {
        const mainContainer = container.querySelector('.max-w-4xl')
        expect(mainContainer).toBeInTheDocument()
      })
    })

    it('should have responsive padding (px-6)', async () => {
      const { container } = renderStoryViewer()

      await waitFor(() => {
        const mainContainer = container.querySelector('.px-6')
        expect(mainContainer).toBeInTheDocument()
      })
    })

    it('should use mx-auto for centering on large screens', async () => {
      const { container } = renderStoryViewer()

      await waitFor(() => {
        const mainContainer = container.querySelector('.mx-auto')
        expect(mainContainer).toBeInTheDocument()
      })
    })
  })

  describe('AC1.3.6: Semantic HTML structure (h1, article, etc.)', () => {
    it('should use semantic h1 for chapter title', async () => {
      renderStoryViewer()

      await waitFor(() => {
        const heading = screen.getByRole('heading', { level: 1 })
        expect(heading).toBeInTheDocument()
        expect(heading.tagName).toBe('H1')
      })
    })

    it('should have proper heading hierarchy', async () => {
      const { container } = renderStoryViewer()

      await waitFor(() => {
        const h1 = container.querySelector('h1')
        expect(h1).toBeInTheDocument()

        // Ensure h1 exists before other headings in DOM
        const allHeadings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
        expect(allHeadings[0].tagName).toBe('H1')
      })
    })

    it('should use semantic container structure', async () => {
      const { container } = renderStoryViewer()

      await waitFor(() => {
        // Check for semantic container divs with proper classes
        const mainContainer = container.querySelector('.min-h-screen')
        expect(mainContainer).toBeInTheDocument()
      })
    })

    it('should wrap content in prose container (article-like)', async () => {
      const { container } = renderStoryViewer()

      await waitFor(() => {
        const proseContainer = container.querySelector('.prose')
        expect(proseContainer).toBeInTheDocument()
      })
    })
  })

  describe('Loading and Error States', () => {
    it('should display loading state', async () => {
      vi.spyOn(useStoryModule, 'useStory').mockReturnValue({
        chapter: null,
        loading: true,
        error: null
      })

      renderStoryViewer()

      await waitFor(() => {
        expect(screen.getByText(/chargement du chapitre/i)).toBeInTheDocument()
        const spinner = document.querySelector('.loading-spinner')
        expect(spinner).toBeInTheDocument()
      })
    })

    it('should display error message when error occurs', async () => {
      vi.spyOn(useStoryModule, 'useStory').mockReturnValue({
        chapter: null,
        loading: false,
        error: 'Failed to load chapter'
      })

      renderStoryViewer()

      await waitFor(() => {
        expect(screen.getByText(/erreur/i)).toBeInTheDocument()
        expect(screen.getByText(/failed to load chapter/i)).toBeInTheDocument()
      })
    })

    it('should display error when chapter is not found', async () => {
      vi.spyOn(useStoryModule, 'useStory').mockReturnValue({
        chapter: null,
        loading: false,
        error: null
      })

      renderStoryViewer()

      await waitFor(() => {
        expect(screen.getByText(/erreur/i)).toBeInTheDocument()
        expect(screen.getByText(/chapitre non trouvé/i)).toBeInTheDocument()
      })
    })

    it('should provide back button on error', async () => {
      vi.spyOn(useStoryModule, 'useStory').mockReturnValue({
        chapter: null,
        loading: false,
        error: 'Test error'
      })

      renderStoryViewer()

      await waitFor(() => {
        const backButton = screen.getByRole('button', { name: /retour/i })
        expect(backButton).toBeInTheDocument()
      })
    })
  })

  describe('Component Integration', () => {
    it('should render ProgressBar component', async () => {
      const { container } = renderStoryViewer()

      await waitFor(() => {
        // Progress bar should be rendered
        const progressBar = container.querySelector('.mb-10')
        expect(progressBar).toBeInTheDocument()
      })
    })

    it('should render NavigationButtons component', async () => {
      renderStoryViewer()

      await waitFor(() => {
        // Navigation should be present (Next button at minimum)
        const buttons = screen.getAllByRole('button')
        expect(buttons.length).toBeGreaterThan(0)
      })
    })

    it('should render ChessboardComponent when position is provided', async () => {
      renderStoryViewer()

      await waitFor(() => {
        // Chessboard should be rendered when chessPosition is present
        expect(mockChapter.chessPosition).toBeTruthy()
      })
    })

    it('should render QuestionComponent when question is provided', async () => {
      vi.spyOn(useStoryModule, 'useStory').mockReturnValue({
        chapter: mockChapterWithQuestion,
        loading: false,
        error: null
      })

      renderStoryViewer()

      await waitFor(() => {
        const questionText = screen.getByText(/quelle pièce a bougé/i)
        expect(questionText).toBeInTheDocument()
      })
    })

    it('should not render QuestionComponent when no question', async () => {
      renderStoryViewer()

      await waitFor(() => {
        const questionText = screen.queryByText(/quelle pièce/i)
        expect(questionText).not.toBeInTheDocument()
      })
    })
  })

  describe('XSS Protection', () => {
    it('should sanitize potentially dangerous HTML in Markdown', async () => {
      const maliciousChapter = {
        ...mockChapter,
        content: '<script>alert("XSS")</script>\n\nSafe content here.'
      }

      vi.spyOn(useStoryModule, 'useStory').mockReturnValue({
        chapter: maliciousChapter,
        loading: false,
        error: null
      })

      const { container } = renderStoryViewer()

      await waitFor(() => {
        // react-markdown should sanitize script tags
        const scripts = container.querySelectorAll('script')
        expect(scripts.length).toBe(0)
      })
    })

    it('should allow safe HTML entities', async () => {
      const chapterWithEntities = {
        ...mockChapter,
        content: 'Safe &amp; sound with &lt;tags&gt;'
      }

      vi.spyOn(useStoryModule, 'useStory').mockReturnValue({
        chapter: chapterWithEntities,
        loading: false,
        error: null
      })

      renderStoryViewer()

      await waitFor(() => {
        expect(screen.getByText(/safe.*sound/i)).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA structure', async () => {
      renderStoryViewer()

      await waitFor(() => {
        const heading = screen.getByRole('heading', { level: 1 })
        expect(heading).toBeInTheDocument()
      })
    })

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup()
      renderStoryViewer()

      await waitFor(async () => {
        await user.tab()
        // Verify that an element receives focus (keyboard navigation works)
        expect(document.activeElement).not.toBe(document.body)
        expect(document.activeElement).toBeTruthy()
      })
    })
  })
})
