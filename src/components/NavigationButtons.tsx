import { useNavigate } from 'react-router-dom'
import { Button } from './Button'

interface NavigationButtonsProps {
  previousChapter?: { storyId: string; chapterId: string } | null
  nextChapter?: { storyId: string; chapterId: string } | null
  onNext?: () => void
  showNext?: boolean
  nextEnabled?: boolean
  onBack?: () => void
}

export const NavigationButtons = ({
  previousChapter,
  nextChapter,
  onNext,
  showNext = true,
  nextEnabled = true,
  onBack
}: NavigationButtonsProps) => {
  const navigate = useNavigate()

  const handlePrevious = () => {
    if (onBack) return onBack()
    if (previousChapter) return navigate(`/story/${previousChapter.storyId}/chapter/${previousChapter.chapterId}`)
    navigate('/')
  }

  const handleNext = () => {
    if (onNext) return onNext()
    if (nextChapter) navigate(`/story/${nextChapter.storyId}/chapter/${nextChapter.chapterId}`)
  }

  return (
    <div className='flex justify-between items-center mt-10'>
      <Button onClick={handlePrevious} variant='neutral'>
        ← {previousChapter ? 'Précédent' : 'Accueil'}
      </Button>

      {showNext && (
        <Button
          onClick={handleNext}
          disabled={!nextEnabled || (!nextChapter && !onNext)}
          variant='primary'
        >
          Suivant →
        </Button>
      )}
    </div>
  )
}
