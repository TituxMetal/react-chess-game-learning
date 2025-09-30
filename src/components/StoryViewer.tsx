import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useProgress } from '../hooks/useProgress'
import { useStory } from '../hooks/useStory'
import { StoryIndex } from '../types/story'
import { getNextChapter, getPreviousChapter, loadStoryIndex } from '../utils/navigation'
import { ChessboardComponent } from './ChessboardComponent'
import { NavigationButtons } from './NavigationButtons'
import { ProgressBar } from './ProgressBar'
import { QuestionComponent } from './QuestionComponent'

export const StoryViewer = () => {
  const { storyId, chapterId } = useParams<{ storyId: string; chapterId: string }>()
  const navigate = useNavigate()
  const { chapter, loading, error } = useStory(storyId!, chapterId!)
  const { progress, markComplete, setCurrent } = useProgress()

  const [showQuestion, setShowQuestion] = useState(false)
  const [questionAnswered, setQuestionAnswered] = useState(false)
  const [storyIndex, setStoryIndex] = useState<StoryIndex[]>([])
  const [nextChapter, setNextChapter] = useState<{ storyId: string; chapterId: string } | null>(
    null
  )
  const [previousChapter, setPreviousChapter] = useState<{
    storyId: string
    chapterId: string
  } | null>(null)

  useEffect(() => {
    loadStoryIndex().then(index => {
      setStoryIndex(index)
      if (storyId && chapterId) {
        const next = getNextChapter(index, storyId, chapterId)
        const prev = getPreviousChapter(index, storyId, chapterId)

        setNextChapter(next)
        setPreviousChapter(prev)
      }
    })
  }, [storyId, chapterId])

  useEffect(() => {
    if (storyId && chapterId) {
      setCurrent(storyId, chapterId)
    }
  }, [storyId, chapterId, setCurrent])

  useEffect(() => {
    // Reset state when chapter changes
    setShowQuestion(true)
    setQuestionAnswered(false)
  }, [storyId, chapterId])

  const handleQuestionAnswer = (correct: boolean) => {
    setQuestionAnswered(true)

    if (correct) {
      markComplete(storyId!, chapterId!)
    }
  }

  const handleNext = () => {
    if (!chapter?.question || questionAnswered) {
      markComplete(storyId!, chapterId!)
    }

    // Navigate to next chapter
    if (nextChapter) {
      navigate(`/story/${nextChapter.storyId}/chapter/${nextChapter.chapterId}`)
    }
  }

  // Calculate progress based on current story
  const currentStory = storyIndex.find(story => story.id === storyId)
  const currentChapterIndex = currentStory?.chapters.findIndex(ch => ch.id === chapterId) ?? 0
  const totalChapters = currentStory?.chapters.length ?? 1
  const currentChapterNumber = currentChapterIndex + 1

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

  if (error || !chapter) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-slate-950'>
        <div className='text-center'>
          <p className='text-red-400 mb-4'>Erreur: {error || 'Chapitre non trouvé'}</p>
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
    <div className='min-h-screen bg-zinc-900'>
      <div className='container mx-auto px-6 py-12 max-w-4xl'>
        {/* Progress Bar */}
        <ProgressBar current={currentChapterNumber} total={totalChapters} className='mb-10' />

        {/* Chapter Content */}
        <div className='bg-zinc-800 rounded-lg p-12 border border-zinc-700 mb-10'>
          <h1 className='text-3xl font-semibold mb-10 text-zinc-100'>{chapter.title}</h1>

          <div className='prose prose-invert prose-lg max-w-none mb-8 text-zinc-200 [&_*]:text-zinc-200 [&_h1]:text-zinc-100 [&_h2]:text-zinc-100 [&_h3]:text-zinc-200 [&_p]:text-zinc-200 [&_p]:leading-loose [&_strong]:text-zinc-100'>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {chapter.content}
            </ReactMarkdown>
          </div>

          {/* Chessboard */}
          {chapter.chessPosition && (
            <div className='mb-8'>
              <ChessboardComponent
                position={chapter.chessPosition}
                interactive={false}
                size={400}
              />
            </div>
          )}

          {/* Question */}
          {chapter.question && showQuestion && (
            <div className='mb-8'>
              <QuestionComponent question={chapter.question} onAnswer={handleQuestionAnswer} />
            </div>
          )}
        </div>

        {/* Navigation */}
        <NavigationButtons
          previousChapter={previousChapter}
          nextChapter={nextChapter}
          onNext={handleNext}
          showNext={true}
          nextEnabled={!chapter.question || questionAnswered}
        />
      </div>
    </div>
  )
}
