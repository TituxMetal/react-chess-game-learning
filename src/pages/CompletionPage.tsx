import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useProgress } from '../hooks/useProgress'
import { StoryIndex } from '../types/story'
import { loadStoryIndex } from '../utils/navigation'

export const CompletionPage = () => {
  const { storyId } = useParams<{ storyId: string }>()
  const navigate = useNavigate()
  const { progress } = useProgress()
  const [storyIndex, setStoryIndex] = useState<StoryIndex[]>([])
  const [completedStory, setCompletedStory] = useState<StoryIndex | null>(null)

  useEffect(() => {
    loadStoryIndex().then(index => {
      setStoryIndex(index)
      const story = index.find(s => s.id === storyId)
      setCompletedStory(story || null)
    })
  }, [storyId])

  const handleContinue = () => {
    if (completedStory?.nextStory) {
      const nextStory = storyIndex.find(s => s.id === completedStory.nextStory)
      if (nextStory && nextStory.chapters.length > 0) {
        navigate(`/story/${nextStory.id}/chapter/${nextStory.chapters[0].id}`)
        return
      }
    }
    navigate('/')
  }

  const handleHome = () => {
    navigate('/')
  }

  if (!completedStory) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
      </div>
    )
  }

  const completedChapters = completedStory.chapters.filter(chapter =>
    progress.completedChapters.has(`${storyId}-${chapter.id}`)
  ).length

  return (
    <div className='min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800'>
      <div className='container mx-auto px-4 py-16'>
        <div className='text-center max-w-2xl mx-auto'>
          <div className='mb-8'>
            <div className='text-6xl mb-6'>🎉</div>
            <h1 className='text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent'>
              Félicitations !
            </h1>
            <h2 className='text-2xl font-semibold mb-6 text-dark-100'>
              Tu as terminé "{completedStory.title}"
            </h2>
          </div>

          <div className='bg-dark-800 rounded-xl p-8 border border-dark-700 mb-8'>
            <div className='grid grid-cols-2 gap-6 mb-6'>
              <div className='text-center'>
                <div className='text-3xl font-bold text-blue-400 mb-2'>{completedChapters}</div>
                <div className='text-dark-300'>Chapitres complétés</div>
              </div>
              <div className='text-center'>
                <div className='text-3xl font-bold text-purple-400 mb-2'>
                  {Math.round((completedChapters / completedStory.chapters.length) * 100)}%
                </div>
                <div className='text-dark-300'>Progression</div>
              </div>
            </div>

            <div className='w-full bg-dark-700 rounded-full h-3 mb-6'>
              <div
                className='bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500'
                style={{ width: `${(completedChapters / completedStory.chapters.length) * 100}%` }}
              />
            </div>

            <p className='text-dark-200 leading-relaxed'>
              Excellent travail ! Tu as maîtrisé les concepts de cette histoire. Continue ton
              apprentissage pour devenir un véritable maître des échecs !
            </p>
          </div>

          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            {completedStory.nextStory && (
              <button
                onClick={handleContinue}
                className='px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105'
              >
                Histoire suivante →
              </button>
            )}

            <button
              onClick={handleHome}
              className='px-8 py-4 text-lg font-semibold bg-dark-700 hover:bg-dark-600 text-dark-100 rounded-xl transition-all duration-300 border border-dark-600'
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
