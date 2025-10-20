import { useStore } from '@nanostores/react'
import { useCallback, useEffect, useState } from 'react'
import { Button } from '~/components/Button'
import { $questionState, resetQuestionState, setQuestionAnswer } from '~/lib/stores/questionStore'
import { Question } from '~/types/story'
import { FeedbackDisplay } from './FeedbackDisplay'

export interface MultipleChoiceProps {
  question: Question
  onAnswer: (answer: string, correct: boolean) => void
}

export const MultipleChoice = ({ question, onAnswer }: MultipleChoiceProps): React.JSX.Element => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [focusedIndex, setFocusedIndex] = useState<number>(0)
  const questionState = useStore($questionState)

  const options = question.options || []

  const handleOptionSelect = useCallback(
    (option: string) => {
      if (questionState.submitted) {
        return
      }

      setSelectedOption(option)
    },
    [questionState.submitted]
  )

  const handleSubmit = useCallback(() => {
    if (!selectedOption || questionState.submitted) {
      return
    }

    const isCorrect = selectedOption === question.correctAnswer
    setQuestionAnswer(selectedOption, isCorrect)
    onAnswer(selectedOption, isCorrect)
  }, [selectedOption, questionState.submitted, question.correctAnswer, onAnswer])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (questionState.submitted) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setFocusedIndex(prev => (prev + 1) % options.length)
          break
        case 'ArrowUp':
          e.preventDefault()
          setFocusedIndex(prev => (prev - 1 + options.length) % options.length)
          break
        case 'Enter':
          e.preventDefault()
          if (selectedOption === null) {
            setSelectedOption(options[focusedIndex])
            return
          }
          handleSubmit()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [focusedIndex, options, questionState.submitted, selectedOption, handleSubmit])

  const handleContinue = useCallback(() => {
    // Reset question state for next question/chapter
    resetQuestionState()
    setSelectedOption(null)
  }, [])

  // Show feedback if question has been submitted
  if (questionState.submitted && questionState.isCorrect !== null) {
    return (
      <FeedbackDisplay
        correct={questionState.isCorrect}
        explanation={question.explanation}
        onContinue={handleContinue}
      />
    )
  }

  return (
    <div className='w-full max-w-2xl mx-auto p-6 space-y-6'>
      <div className='text-lg font-medium text-gray-900 dark:text-gray-100'>{question.prompt}</div>

      <div className='space-y-3'>
        {options.map((option, index) => {
          const isSelected = selectedOption === option
          const isFocused = focusedIndex === index
          const isDisabled = questionState.submitted

          return (
            <button
              key={option}
              onClick={() => handleOptionSelect(option)}
              disabled={isDisabled}
              className={`
                w-full text-left px-4 py-3 rounded-lg border-2 transition-all
                ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                }
                ${isFocused && !isDisabled ? 'ring-2 ring-blue-400 ring-offset-2' : ''}
                ${
                  isDisabled
                    ? 'opacity-60 cursor-not-allowed'
                    : 'hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 cursor-pointer'
                }
                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
              `}
            >
              {option}
            </button>
          )
        })}
      </div>

      {selectedOption && !questionState.submitted && (
        <Button onClick={handleSubmit} variant='primary' className='w-full'>
          Soumettre
        </Button>
      )}
    </div>
  )
}
