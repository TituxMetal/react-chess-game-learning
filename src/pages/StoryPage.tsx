import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export const StoryPage = () => {
  const { storyId, chapterId } = useParams<{ storyId: string; chapterId: string }>()
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadStory = async () => {
      try {
        console.log('Loading story:', storyId, chapterId)
        setLoading(true)
        setError(null)

        // Try to load the markdown file
        const response = await fetch(`/src/stories/${storyId}/${chapterId}.md`)

        if (!response.ok) {
          throw new Error(`Failed to load story: ${response.status}`)
        }

        const text = await response.text()

        console.log('Loaded content:', text.substring(0, 100))

        setContent(text)
      } catch (err) {
        console.error('Error loading story:', err)

        setError(err instanceof Error ? err.message : 'Failed to load story')
      } finally {
        setLoading(false)
      }
    }

    if (storyId && chapterId) {
      loadStory()
    }
  }, [storyId, chapterId])

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-slate-950'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4'></div>
          <p className='text-slate-300'>Chargement du chapitre...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-slate-950'>
        <div className='text-center'>
          <p className='text-red-400 mb-4'>Erreur: {error}</p>
          <p className='text-slate-400 mb-4'>
            Story ID: {storyId}, Chapter ID: {chapterId}
          </p>
          <button
            onClick={() => window.history.back()}
            className='px-4 py-2 bg-slate-700 text-slate-100 rounded-lg hover:bg-slate-600'
          >
            Retour
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-slate-950'>
      <div className='container mx-auto px-4 py-8 max-w-4xl'>
        <div className='bg-slate-900 rounded-xl p-8 border border-slate-800'>
          <h1 className='text-3xl font-bold mb-6 text-slate-50'>
            {storyId} - {chapterId}
          </h1>

          <pre className='text-slate-300 whitespace-pre-wrap'>{content}</pre>
        </div>
      </div>
    </div>
  )
}
