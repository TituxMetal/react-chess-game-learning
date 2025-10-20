import { useEffect, useState } from 'react'
import { ChapterData, Question } from '~/types/story'
import { parseMarkdown } from '~/utils/markdownParser'

/**
 * Custom hook for loading and managing story chapter content.
 *
 * This hook handles the dynamic loading of markdown chapter files, parsing their
 * frontmatter metadata, and managing loading/error states. It uses Vite's dynamic
 * import functionality to load chapters on-demand and automatically reloads when
 * the story or chapter parameters change.
 *
 * @param storyId - The ID of the story containing the chapter
 * @param chapterId - The ID of the specific chapter to load
 *
 * @returns Object containing chapter data and loading state
 *
 * @example
 * ```typescript
 * const { chapter, loading, error } = useStory('01-introduction', '01-what-is-chess');
 *
 * if (loading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error}</div>;
 * if (chapter) return <div>{chapter.title}</div>;
 * ```
 *
 * @throws Logs errors to console but returns error state instead of throwing exceptions
 */
export const useStory = (storyId: string, chapterId: string) => {
  const [chapter, setChapter] = useState<ChapterData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadChapter = async () => {
      try {
        setLoading(true)
        setError(null)

        // Load individual chapter file from organized folder structure
        const markdownContent = await import(`~/stories/${storyId}/${chapterId}.md?raw`).then(
          module => module.default
        )

        const { frontmatter, markdown } = parseMarkdown(markdownContent)

        const chapterData: ChapterData = {
          id: frontmatter.id || chapterId,
          title: frontmatter.title || 'Chapter',
          chapterNumber: frontmatter.chapterNumber || 1,
          storyId: frontmatter.storyId || storyId,
          content: markdown,
          question: frontmatter.question as Question | undefined,
          chessPosition: frontmatter.chessPosition
        }

        setChapter(chapterData)
      } catch (err) {
        console.error('Error loading chapter:', err)
        setError(err instanceof Error ? err.message : 'Failed to load chapter')
      } finally {
        setLoading(false)
      }
    }

    if (!storyId || !chapterId) {
      return
    }

    loadChapter()
  }, [storyId, chapterId])

  return { chapter, loading, error }
}
