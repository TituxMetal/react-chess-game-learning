import { useState, useEffect } from 'react'
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
        
        // Load from the stories index to get the chapter data
        const indexModule = await import('../stories/index.json')
        const storyIndex = indexModule.default
        
        const story = storyIndex.find((s: any) => s.id === storyId)
        const chapter = story?.chapters.find((c: any) => c.id === chapterId)
        
        if (!story || !chapter) {
          throw new Error(`Chapter not found: ${storyId}/${chapterId}`)
        }
        
        // For now, create mock content - we'll need to restructure the data
        const chapterData: ChapterData = {
          id: chapterId,
          title: chapter.title,
          chapterNumber: 1,
          storyId: storyId,
          content: `<h2>${chapter.title}</h2><p>Contenu du chapitre en cours de chargement...</p>`,
          question: undefined,
          chessPosition: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
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