import { useState, useEffect } from 'react'
import { ChapterData, Question } from '../types/story'
import { parseMarkdown } from '../utils/markdownParser'

export const useStory = (storyId: string, chapterId: string) => {
  const [chapter, setChapter] = useState<ChapterData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadChapter = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Try to load the markdown file directly
        const response = await fetch(`/src/stories/${storyId}/${chapterId}.md`)
        if (!response.ok) {
          throw new Error(`Failed to load story: ${response.status}`)
        }
        
        const markdownContent = await response.text()
        const { frontmatter, html } = parseMarkdown(markdownContent)
        
        const chapterData: ChapterData = {
          id: frontmatter.id || chapterId,
          title: frontmatter.title || 'Chapter',
          chapterNumber: frontmatter.chapterNumber || 1,
          storyId: frontmatter.storyId || storyId,
          content: html,
          question: frontmatter.question as Question | undefined,
          chessPosition: frontmatter.chessPosition,
        }
        
        setChapter(chapterData)
      } catch (err) {
        console.error('Error loading chapter:', err)
        setError(err instanceof Error ? err.message : 'Failed to load chapter')
      } finally {
        setLoading(false)
      }
    }

    if (storyId && chapterId) {
      loadChapter()
    }
  }, [storyId, chapterId])

  return { chapter, loading, error }
}