import { useState } from 'react'
import { Question } from '../types/story'

interface QuestionComponentProps {
  question: Question
  onAnswer: (correct: boolean) => void
}

const QuestionComponent = ({ question, onAnswer }: QuestionComponentProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer)
    setShowFeedback(true)
    const isCorrect = answer === question.correctAnswer
    setTimeout(() => onAnswer(isCorrect), 1500)
  }

  if (question.type === 'multiple-choice' && question.options) {
    return (
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-xl font-semibold mb-4 text-slate-100">
          {question.prompt}
        </h3>
        
        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === option
            const isCorrect = option === question.correctAnswer
            const isWrong = isSelected && !isCorrect
            
            let buttonClass = "w-full p-4 text-left rounded-lg border-2 transition-all duration-200 "
            
            if (showFeedback) {
              if (isCorrect) {
                buttonClass += "bg-green-900 border-green-600 text-green-100"
              } else if (isWrong) {
                buttonClass += "bg-red-900 border-red-600 text-red-100"
              } else {
                buttonClass += "bg-slate-700 border-slate-600 text-slate-300"
              }
            } else {
              buttonClass += isSelected 
                ? "bg-blue-900 border-blue-600 text-blue-100" 
                : "bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600 hover:border-slate-500"
            }

            return (
              <button
                key={index}
                onClick={() => !showFeedback && handleAnswerSelect(option)}
                disabled={showFeedback}
                className={buttonClass}
              >
                {option}
              </button>
            )
          })}
        </div>

        {showFeedback && (
          <div className="mt-6 p-4 rounded-lg bg-slate-700 border border-slate-600">
            <div className={`flex items-center mb-2 ${
              selectedAnswer === question.correctAnswer ? 'text-green-400' : 'text-red-400'
            }`}>
              <span className="text-lg font-semibold">
                {selectedAnswer === question.correctAnswer ? '✓ Correct !' : '✗ Incorrect'}
              </span>
            </div>
            <p className="text-slate-200">{question.explanation}</p>
          </div>
        )}
      </div>
    )
  }

  return null
}

export default QuestionComponent