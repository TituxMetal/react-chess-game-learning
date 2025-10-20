import { memo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Button } from '~/components/Button'

export interface FeedbackDisplayProps {
  correct: boolean
  explanation: string
  onContinue: () => void
}

export const FeedbackDisplay = memo(
  ({ correct, explanation, onContinue }: FeedbackDisplayProps): React.JSX.Element => {
    return (
      <div
        className={`
        w-full max-w-2xl mx-auto p-6 rounded-lg border-2 transition-all duration-300
        animate-in fade-in slide-in-from-bottom-4
        ${
          correct
            ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 border-green-400 dark:border-green-600'
            : 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200 border-orange-400 dark:border-orange-600'
        }
      `}
        role='status'
        aria-live='polite'
      >
        <div className='flex items-start gap-3 mb-4'>
          <span className='text-3xl flex-shrink-0' aria-hidden='true'>
            {correct ? '✓' : '⚠'}
          </span>
          <div className='flex-1'>
            <h2 className='text-2xl font-bold mb-4'>{correct ? 'Correct !' : 'Incorrect'}</h2>
            <div
              className={`
            prose prose-sm max-w-none
            ${correct ? 'prose-green' : 'prose-orange'}
            dark:prose-invert
          `}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{explanation}</ReactMarkdown>
            </div>
          </div>
        </div>

        <Button
          onClick={onContinue}
          variant={correct ? 'primary' : 'secondary'}
          className='w-full mt-4'
          aria-label='Continuer vers le prochain chapitre'
        >
          Continuer
        </Button>
      </div>
    )
  }
)
