import { useState, useEffect } from 'react'
import matter from 'gray-matter'
import { marked } from 'marked'
import { ChapterData } from '../types/story'

export const useStory = (storyId: string, chapterId: string) => {
  const [chapter, setChapter] = useState<ChapterData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadChapter = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/stories/${storyId}/${chapterId}.md`)
        if (!response.ok) {
          throw new Error(`Failed to load chapter: ${response.statusText}`)
        }
        
        const markdownContent = await response.text()
        const { data, content } = matter(markdownContent)
        
        const htmlContent = await marked(content)
        
        const chapterData: ChapterData = {
          id: data.id || chapterId,
          title: data.title || 'Untitled Chapter',
          chapterNumber: data.chapterNumber || 1,
          storyId: data.storyId || storyId,
          content: htmlContent,
          question: data.question,
          chessPosition: data.chessPosition,
        }
        
        setChapter(chapterData)
      } catch (err) {
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