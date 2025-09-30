import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useStory } from '../hooks/useStory'
import { useProgress } from '../hooks/useProgress'
import ChessboardComponent from './ChessboardComponent'
import QuestionComponent from './QuestionComponent'
import NavigationButtons from './NavigationButtons'
import ProgressBar from './ProgressBar'

const StoryViewer = () => {
  const { storyId, chapterId } = useParams<{ storyId: string; chapterId: string }>()
  const { chapter, loading, error } = useStory(storyId!, chapterId!)
  const { progress, markComplete, setCurrent } = useProgress()
  
  const [showQuestion, setShowQuestion] = useState(false)
  const [questionAnswered, setQuestionAnswered] = useState(false)

  useEffect(() => {
    if (storyId && chapterId) {
      setCurrent(storyId, chapterId)
    }
  }, [storyId, chapterId, setCurrent])

  useEffect(() => {
    if (chapter && !chapter.question) {
      // If no question, show content for a moment then enable navigation
      const timer = setTimeout(() => setShowQuestion(true), 2000)
      return () => clearTimeout(timer)
    } else if (chapter && chapter.question) {
      // If there's a question, show it after reading the content
      const timer = setTimeout(() => setShowQuestion(true), 3000)
      return () => clearTimeout(timer)
    }
  }, [chapter])

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
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Chargement du chapitre...</p>
        </div>
      </div>
    )
  }

  if (error || !chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <p className="text-red-400 mb-4">Erreur: {error || 'Chapitre non trouvé'}</p>
          <p className="text-slate-400 mb-4">Story ID: {storyId}, Chapter ID: {chapterId}</p>
          <button 
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-slate-700 text-slate-100 rounded-lg hover:bg-slate-600"
          >
            Retour
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Bar */}
        <ProgressBar 
          current={1} 
          total={5}
          className="mb-8"
        />

        {/* Chapter Content */}
        <div className="bg-slate-900 rounded-xl p-8 border border-slate-800 mb-8">
          <h1 className="text-3xl font-bold mb-6 text-slate-50">
            {chapter.title}
          </h1>
          
          <div 
            className="prose prose-invert prose-lg max-w-none mb-8 text-slate-200 [&_*]:text-slate-200 [&_h1]:text-slate-100 [&_h2]:text-slate-100 [&_h3]:text-slate-100 [&_p]:text-slate-200 [&_strong]:text-slate-100"
            dangerouslySetInnerHTML={{ __html: chapter.content }}
          />

          {/* Chessboard */}
          {chapter.chessPosition && (
            <div className="mb-8">
              <ChessboardComponent 
                position={chapter.chessPosition}
                interactive={false}
                size={400}
              />
            </div>
          )}

          {/* Question */}
          {chapter.question && showQuestion && (
            <div className="mb-8">
              <QuestionComponent
                question={chapter.question}
                onAnswer={handleQuestionAnswer}
              />
            </div>
          )}
        </div>

        {/* Navigation */}
        <NavigationButtons
          previousChapter={null}
          nextChapter={{ storyId: '01-introduction', chapterId: '02-the-chessboard' }}
          onNext={handleNext}
          showNext={!chapter.question || questionAnswered}
        />
      </div>
    </div>
  )
}

export default StoryViewer