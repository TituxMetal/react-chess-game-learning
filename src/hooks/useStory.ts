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
        
        console.log('Loading chapter:', storyId, chapterId)
        
        // Try to load the markdown file
        const markdownModule = await import(`../stories/${storyId}/${chapterId}.md?raw`)
        const markdownContent = markdownModule.default
        
        console.log('Loaded markdown:', markdownContent.substring(0, 100))
        
        const { data, content } = matter(markdownContent)
        console.log('Parsed frontmatter:', data)
        
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
        
        console.log('Final chapter data:', chapterData)
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