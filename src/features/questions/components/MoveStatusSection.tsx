import { Button } from '~/components/Button'
import { Question } from '~/types/story'

interface MoveStatusSectionProps {
  userMove: string | null
  isCorrect: boolean
  isSubmitted: boolean
  question: Question
  onRetry: () => void
}

export const MoveStatusSection = ({
  userMove,
  isCorrect,
  isSubmitted,
  question,
  onRetry
}: MoveStatusSectionProps) => {
  if (!userMove || !isSubmitted) {
    return null
  }

  return (
    <div
      className={`
        p-4 rounded-lg border-2
        ${
          isCorrect
            ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
            : 'bg-red-50 dark:bg-red-900/20 border-red-500'
        }
      `}
    >
      <div className='flex items-center justify-between mb-2'>
        <p
          className={`font-medium ${
            isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
          }`}
        >
          {isCorrect ? '✓ Correct Move!' : '✗ Incorrect Move'}
        </p>
        {!isCorrect && (
          <Button onClick={onRetry} variant='primary'>
            Try Again
          </Button>
        )}
      </div>
      <p className='text-sm text-gray-600 dark:text-gray-400'>You played: {userMove}</p>
      {isCorrect && question.explanation && (
        <p className='text-sm mt-2 text-gray-700 dark:text-gray-300'>{question.explanation}</p>
      )}
    </div>
  )
}
