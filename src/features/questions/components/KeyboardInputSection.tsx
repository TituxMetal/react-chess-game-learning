import { Button } from '~/components/Button'

interface KeyboardInputSectionProps {
  keyboardMove: string
  setKeyboardMove: (move: string) => void
  keyboardError: string | null
  onSubmit: () => void
  onKeyDown: (e: React.KeyboardEvent) => void
  disabled: boolean
}

export const KeyboardInputSection = ({
  keyboardMove,
  setKeyboardMove,
  keyboardError,
  onSubmit,
  onKeyDown,
  disabled
}: KeyboardInputSectionProps) => {
  return (
    <div className='space-y-3'>
      <label
        htmlFor='move-input'
        className='block text-sm font-medium text-gray-700 dark:text-gray-300'
      >
        Or enter move in algebraic notation:
      </label>

      <div className='flex gap-2'>
        <input
          id='move-input'
          type='text'
          value={keyboardMove}
          onChange={e => setKeyboardMove(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={disabled}
          placeholder='e.g., e2e4 or e4'
          className={`
            flex-1 px-4 py-2 rounded-lg border-2 transition-all
            ${
              disabled
                ? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 cursor-not-allowed opacity-60'
                : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-400'
            }
            text-gray-900 dark:text-gray-100
            focus:outline-none
          `}
        />

        <Button onClick={onSubmit} disabled={disabled || !keyboardMove.trim()} variant='primary'>
          Submit Move
        </Button>
      </div>

      {keyboardError && <p className='text-sm text-red-600 dark:text-red-400'>{keyboardError}</p>}
    </div>
  )
}
