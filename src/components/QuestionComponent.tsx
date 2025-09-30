import { useState } from 'react'
import { Question } from '../types/story'
import { Button } from './Button'

interface QuestionComponentProps {
  question: Question
  onAnswer: (correct: boolean) => void
}

export const QuestionComponent = ({ question, onAnswer }: QuestionComponentProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isAnswered, setIsAnswered] = useState(false)

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer)
    setShowFeedback(true)

    const isCorrect = answer === question.correctAnswer

    if (isCorrect) {
      setIsAnswered(true)
      setTimeout(() => onAnswer(isCorrect), 200)
    }
  }

  const handleRetry = () => {
    setSelectedAnswer(null)
    setShowFeedback(false)
  }

  if (question.type === 'multiple-choice' && question.options) {
    return (
      <div className='bg-zinc-800 rounded-lg p-8 border border-zinc-700'>
        <h3 className='text-xl font-medium mb-6 text-zinc-100'>{question.prompt}</h3>

        <div className='space-y-3'>
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === option
            const isCorrect = option === question.correctAnswer
            const isWrong = isSelected && !isCorrect

            let buttonClass =
              'w-full p-4 text-left rounded-lg border transition-colors duration-150 cursor-pointer text-base '

            if (showFeedback) {
              if (isCorrect) {
                buttonClass += 'bg-emerald-900 border-emerald-700 text-zinc-100'
              } else if (isWrong) {
                buttonClass += 'bg-zinc-800 border-zinc-700 text-zinc-400'
              } else {
                buttonClass += 'bg-zinc-800 border-zinc-700 text-zinc-300'
              }
            } else {
              buttonClass += isSelected
                ? 'bg-amber-900 border-amber-700 text-zinc-100'
                : 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700 hover:border-zinc-600'
            }

            return (
              <button
                key={index}
                onClick={() => !isAnswered && handleAnswerSelect(option)}
                disabled={isAnswered}
                className={buttonClass}
              >
                {option}
              </button>
            )
          })}
        </div>

        {showFeedback && (
          <div className='mt-6 p-5 rounded-lg bg-zinc-800 border border-zinc-700'>
            <div className='flex items-center justify-between mb-3'>
              <span className={`text-base font-medium ${
                selectedAnswer === question.correctAnswer ? 'text-emerald-300' : 'text-zinc-300'
              }`}>
                {selectedAnswer === question.correctAnswer ? '✓ Correct' : '✗ Incorrect'}
              </span>
              {!isAnswered && (
                <Button onClick={handleRetry} variant='secondary' className='px-5 py-2 text-sm'>
                  Réessayer
                </Button>
              )}
            </div>
            {selectedAnswer === question.correctAnswer && (
              <p className='text-zinc-300 text-base mt-2 leading-relaxed'>{question.explanation}</p>
            )}
          </div>
        )}
      </div>
    )
  }

  return null
}
