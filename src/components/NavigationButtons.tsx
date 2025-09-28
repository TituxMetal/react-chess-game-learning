import { useNavigate } from 'react-router-dom'

interface NavigationButtonsProps {
  previousChapter?: { storyId: string; chapterId: string } | null
  nextChapter?: { storyId: string; chapterId: string } | null
  onNext?: () => void
  showNext?: boolean
}

const NavigationButtons = ({ 
  previousChapter, 
  nextChapter, 
  onNext,
  showNext = true 
}: NavigationButtonsProps) => {
  const navigate = useNavigate()

  const handlePrevious = () => {
    if (previousChapter) {
      navigate(`/story/${previousChapter.storyId}/chapter/${previousChapter.chapterId}`)
    }
  }

  const handleNext = () => {
    if (onNext) {
      onNext()
    } else if (nextChapter) {
      navigate(`/story/${nextChapter.storyId}/chapter/${nextChapter.chapterId}`)
    }
  }

  return (
    <div className="flex justify-between items-center mt-8">
      <button
        onClick={handlePrevious}
        disabled={!previousChapter}
        className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
          previousChapter
            ? 'bg-dark-700 hover:bg-dark-600 text-dark-100 border border-dark-600'
            : 'bg-dark-800 text-dark-500 cursor-not-allowed border border-dark-700'
        }`}
      >
        ← Précédent
      </button>

      {showNext && (
        <button
          onClick={handleNext}
          disabled={!nextChapter && !onNext}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            nextChapter || onNext
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
              : 'bg-dark-800 text-dark-500 cursor-not-allowed border border-dark-700'
          }`}
        >
          Suivant →
        </button>
      )}
    </div>
  )
}

export default NavigationButtons