import { useStore } from '@nanostores/react'
import { useCallback, useEffect, useState } from 'react'
import { useChessGame } from '~/hooks/useChessGame'
import { useKeyboardInput } from '~/hooks/useKeyboardInput'
import { useMoveValidation } from '~/hooks/useMoveValidation'
import { $questionState } from '~/lib/stores/questionStore'
import { Question } from '~/types/story'
import { ChessBoardSection } from './components/ChessBoardSection'
import { KeyboardInputSection } from './components/KeyboardInputSection'
import { MoveStatusSection } from './components/MoveStatusSection'

export interface MoveBasedQuestionProps {
  question: Question
  onMove: (move: string, correct: boolean) => void
}

export const MoveBasedQuestion = ({
  question,
  onMove
}: MoveBasedQuestionProps): React.JSX.Element => {
  const questionState = useStore($questionState)
  const [boardLocked, setBoardLocked] = useState(false)

  // Custom hooks
  const { validateMove } = useMoveValidation({ question })

  const { game, userMove, handleRetry, makeMove } = useChessGame({
    question,
    onMove,
    validateMove,
    boardLocked,
    questionSubmitted: questionState.submitted
  })

  const {
    keyboardMove,
    setKeyboardMove,
    keyboardError,
    handleSubmit: handleKeyboardSubmit,
    handleKeyDown,
    reset: resetKeyboardInput
  } = useKeyboardInput({
    onSubmit: makeMove,
    disabled: boardLocked || questionState.submitted
  })

  // Lock board when question is submitted
  useEffect(() => {
    if (questionState.submitted) {
      setBoardLocked(true)
    }
  }, [questionState.submitted])

  // Reset keyboard input and board lock when question changes
  useEffect(() => {
    resetKeyboardInput()
    setBoardLocked(false)
  }, [question, resetKeyboardInput])

  // Handle chess board moves
  const handleChessBoardMove = useCallback(
    (move: { from: string; to: string }) => {
      const result = makeMove(move)
      if (result?.success && result.correct) {
        setBoardLocked(true)
      }
    },
    [makeMove]
  )

  return (
    <div className='w-full max-w-2xl mx-auto p-6 space-y-6'>
      <div className='text-lg font-medium text-gray-900 dark:text-gray-100'>{question.prompt}</div>

      <ChessBoardSection
        question={question}
        game={game}
        userMove={userMove}
        interactive={!boardLocked && !questionState.submitted}
        questionSubmitted={questionState.submitted}
        onMove={handleChessBoardMove}
      />

      <KeyboardInputSection
        keyboardMove={keyboardMove}
        setKeyboardMove={setKeyboardMove}
        keyboardError={keyboardError}
        onSubmit={handleKeyboardSubmit}
        onKeyDown={handleKeyDown}
        disabled={boardLocked || questionState.submitted}
      />

      <MoveStatusSection
        userMove={userMove}
        isCorrect={questionState.isCorrect ?? false}
        isSubmitted={questionState.submitted}
        question={question}
        onRetry={handleRetry}
      />
    </div>
  )
}
