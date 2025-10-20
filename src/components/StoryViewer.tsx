import ReactMarkdown from 'react-markdown'
import { useNavigate, useParams } from 'react-router-dom'
import remarkGfm from 'remark-gfm'
import { Button } from '~/components/Button'
import { ChessBoard } from '~/entities/chessboard/ChessBoard'
import { useChapterProgress } from '~/hooks/useChapterProgress'
import { useProgress } from '~/hooks/useProgress'
import { useStory } from '~/hooks/useStory'
import { useStoryNavigation } from '~/hooks/useStoryNavigation'
import { NavigationButtons } from './NavigationButtons'
import { ProgressBar } from './ProgressBar'
import { QuestionComponent } from './QuestionComponent'

export const StoryViewer = () => {
  const { storyId, chapterId } = useParams<{ storyId: string; chapterId: string }>()
  const navigate = useNavigate()
  const { chapter, loading, error } = useStory(storyId!, chapterId!)
  const { markComplete, setCurrent } = useProgress()

  // Custom hooks for navigation and progress
  const { storyIndex, nextChapter, previousChapter, handleNext } = useStoryNavigation({
    storyId: storyId!,
    chapterId: chapterId!
  })

  const {
    showQuestion,
    questionAnswered,
    handleQuestionAnswer,
    currentChapterNumber,
    totalChapters
  } = useChapterProgress({
    storyId: storyId!,
    chapterId: chapterId!,
    storyIndex,
    setCurrent
  })

  // Enhanced question answer handler that also marks chapter complete
  const handleQuestionAnswerWithComplete = (correct: boolean) => {
    handleQuestionAnswer(correct)

    if (correct) {
      markComplete(storyId!, chapterId!)
    }
  }

  // Enhanced next handler that uses the navigation hook
  const handleNextWithComplete = () => {
    handleNext(questionAnswered, !!chapter?.question, markComplete)
  }

  if (loading) {
    return (
      <div className='loading-container'>
        <div className='loading-content'>
          <div className='loading-spinner'></div>
          <p className='loading-text'>Chargement du chapitre...</p>
        </div>
      </div>
    )
  }

  if (error || !chapter) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-slate-950'>
        <div className='text-center'>
          <p className='text-red-400 mb-4'>Erreur: {error || 'Chapitre non trouvé'}</p>
          <p className='text-slate-400 mb-4'>
            Story ID: {storyId}, Chapter ID: {chapterId}
          </p>
          <Button onClick={() => navigate(-1)} variant='secondary'>
            Retour
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-zinc-900'>
      <div className='container mx-auto px-6 py-12 max-w-4xl'>
        {/* Progress Bar */}
        <ProgressBar current={currentChapterNumber} total={totalChapters} className='mb-10' />

        {/* Chapter Content */}
        <div className='chapter-container'>
          <h1 className='chapter-title'>{chapter.title}</h1>

          <div className='prose prose-invert prose-lg max-w-none mb-8 text-zinc-200 prose-enhanced'>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{chapter.content}</ReactMarkdown>
          </div>

          {/* Chessboard */}
          {chapter.chessPosition && (
            <div className='mb-8 flex justify-center'>
              <ChessBoard
                key={`${chapter.id}-${chapter.chessPosition}`}
                position={chapter.chessPosition}
                interactive={false}
              />
            </div>
          )}

          {/* Question */}
          {chapter.question && showQuestion && (
            <div className='mb-8'>
              <QuestionComponent
                question={chapter.question}
                onAnswer={handleQuestionAnswerWithComplete}
              />
            </div>
          )}
        </div>

        {/* Navigation */}
        <NavigationButtons
          previousChapter={previousChapter}
          nextChapter={nextChapter}
          onNext={handleNextWithComplete}
          showNext={true}
          nextEnabled={!chapter.question || questionAnswered}
        />
      </div>
    </div>
  )
}
