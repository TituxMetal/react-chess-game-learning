import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '~/components/Button'
import { useProgress } from '~/hooks/useProgress'
import { getStoryStats } from '~/lib/stores/questionStore'
import { StoryIndex } from '~/types/story'
import { loadStoryIndex } from '~/utils/navigation'

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

  // Calculate progress percentage
  const progressPercentage = (completedChapters / completedStory.chapters.length) * 100

  // Get question statistics
  const stats = getStoryStats(storyId || '')
  const scorePercentage =
    stats.totalQuestions > 0 ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100) : 0
  const isHighScore = scorePercentage >= 80

  return (
    <div className='completion-background'>
      <div className='completion-container'>
        <div className='completion-content'>
          <div className='completion-hero'>
            <div className='text-6xl mb-6' aria-hidden='true'>
              🎉
            </div>
            <h1 className='completion-title'>Bravo !</h1>
            <h2 className='completion-subtitle'>Tu as terminé "{completedStory.title}"</h2>
            <p className='text-zinc-300 text-lg mb-4'>
              Excellent travail ! Tu as maîtrisé les concepts de cette histoire.
            </p>
            <p className='text-zinc-400'>
              Continue ton apprentissage pour devenir un véritable maître des échecs !
            </p>
          </div>

          {/* Key Concepts Section */}
          {completedStory.keyConcepts && completedStory.keyConcepts.length > 0 && (
            <div className='card-primary text-left animate-slide-in-1'>
              <h3 className='text-xl font-semibold mb-4 text-zinc-100'>
                Ce que vous avez appris :
              </h3>
              <ul className='prose prose-invert prose-zinc max-w-none list-disc list-inside space-y-2'>
                {completedStory.keyConcepts.map(concept => (
                  <li key={concept} className='text-zinc-300'>
                    {concept}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Statistics Section */}
          <div className='card-stats animate-slide-in-2'>
            <div className='grid grid-cols-2 gap-6 mb-6'>
              <div className='text-center'>
                <div className='text-3xl font-bold text-blue-400 mb-2'>{completedChapters}</div>
                <div className='text-zinc-300'>Chapitres complétés</div>
              </div>
              <div className='text-center'>
                <div className='text-3xl font-bold text-purple-400 mb-2'>
                  {Math.round(progressPercentage)}%
                </div>
                <div className='text-zinc-300'>Progression</div>
              </div>
            </div>

            <div className='w-full bg-zinc-700 rounded-full h-3 mb-6'>
              <div
                className='progress-bar-success'
                style={
                  {
                    '--progress-width': `${progressPercentage}%`
                  } as React.CSSProperties
                }
                role='progressbar'
                aria-valuenow={progressPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${Math.round(progressPercentage)}% de progression`}
              />
            </div>

            {/* Question Stats */}
            {stats.totalQuestions > 0 && (
              <div className='border-t border-zinc-700 pt-6 mt-6'>
                <div className='text-center mb-4'>
                  <div
                    className={`text-4xl font-bold mb-2 ${
                      isHighScore ? 'text-green-400' : 'text-yellow-400'
                    }`}
                    aria-live='polite'
                  >
                    {stats.correctAnswers}/{stats.totalQuestions}
                  </div>
                  <div className='text-zinc-300'>réponses correctes</div>
                </div>
                <div className='w-full bg-zinc-700 rounded-full h-3'>
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      isHighScore ? 'progress-bar-score-high' : 'progress-bar-score-medium'
                    }`}
                    style={{ '--progress-width': `${scorePercentage}%` } as React.CSSProperties}
                    role='progressbar'
                    aria-valuenow={scorePercentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${scorePercentage}% de réponses correctes`}
                  />
                </div>
                <div className='text-center mt-4 text-zinc-300'>Score : {scorePercentage}%</div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className='flex flex-col sm:flex-row gap-4 justify-center animate-slide-in-3'>
            {completedStory.nextStory && (
              <Button
                onClick={handleContinue}
                variant='primary'
                className='px-8 py-4 text-lg font-semibold'
                aria-label="Continuer vers l'histoire suivante"
              >
                Continuer →
              </Button>
            )}

            <Button
              onClick={handleHome}
              variant='secondary'
              className='px-8 py-4 text-lg font-semibold'
              aria-label="Retour à l'accueil"
            >
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
