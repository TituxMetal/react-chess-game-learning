import { Chess } from 'chess.js'
import { useCallback, useEffect, useState } from 'react'
import { resetQuestionState, setQuestionAnswer } from '~/lib/stores/questionStore'
import { Question } from '~/types/story'

const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

interface UseChessGameProps {
  question: Question
  onMove: (move: string, correct: boolean) => void
  validateMove: (moveStr: string) => boolean
  boardLocked: boolean
  questionSubmitted: boolean
}

/**
 * Custom hook for managing chess game state and move validation in move-based questions.
 *
 * This hook encapsulates the complex logic for handling chess positions, move validation,
 * and game state management for interactive chess questions. It manages the chess.js
 * game instance, handles move input in multiple formats, and coordinates with the
 * question store for answer tracking.
 *
 * @param props - Configuration object for the chess game hook
 * @param props.question - The current question containing chess position and validation data
 * @param props.onMove - Callback function called when a valid move is made
 * @param props.validateMove - Function to validate if a move is correct for the question
 * @param props.boardLocked - Whether the board should accept user input
 * @param props.questionSubmitted - Whether the question has been submitted
 *
 * @returns Object containing game state and control functions
 *
 * @example
 * ```typescript
 * const { game, userMove, handleRetry, makeMove } = useChessGame({
 *   question: currentQuestion,
 *   onMove: (move, correct) => console.log(`Move ${move} is ${correct ? 'correct' : 'incorrect'}`),
 *   validateMove: (move) => move === 'e2e4',
 *   boardLocked: false,
 *   questionSubmitted: false
 * });
 * ```
 */
export const useChessGame = ({
  question,
  onMove,
  validateMove,
  boardLocked,
  questionSubmitted
}: UseChessGameProps) => {
  const initialFen =
    question.initialPosition === 'start' || !question.initialPosition
      ? STARTING_FEN
      : question.initialPosition

  const [game, setGame] = useState<Chess>(new Chess(initialFen))
  const [userMove, setUserMove] = useState<string | null>(null)

  // Reset game when question changes
  useEffect(() => {
    const fen =
      question.initialPosition === 'start' || !question.initialPosition
        ? STARTING_FEN
        : question.initialPosition
    setGame(new Chess(fen))
    setUserMove(null)
    // Reset question state to ensure clean slate for new question
    resetQuestionState()
  }, [question.initialPosition, question.prompt])

  const handleRetry = useCallback(() => {
    // Reset to initial position
    const fen =
      question.initialPosition === 'start' || !question.initialPosition
        ? STARTING_FEN
        : question.initialPosition
    setGame(new Chess(fen))
    setUserMove(null)
    // Reset question store state
    resetQuestionState()
  }, [question.initialPosition])

  const makeMove = useCallback(
    (moveInput: string | { from: string; to: string }) => {
      if (boardLocked || questionSubmitted) {
        return null
      }

      const gameCopy = new Chess(game.fen())

      try {
        let chessMove
        let moveStr: string

        if (typeof moveInput === 'string') {
          // Keyboard input - algebraic notation
          chessMove = gameCopy.move(moveInput.trim().toLowerCase())
          if (chessMove === null) {
            return { error: 'Invalid move notation' }
          }
          moveStr = `${chessMove.from}${chessMove.to}`
        } else {
          // Drag and drop input
          chessMove = gameCopy.move({
            from: moveInput.from,
            to: moveInput.to,
            promotion: 'q' // Always promote to queen for simplicity
          })
          if (chessMove === null) {
            return { error: 'Illegal move' }
          }
          moveStr = `${moveInput.from}${moveInput.to}`
        }

        // Update game state
        setGame(gameCopy)
        setUserMove(moveStr)

        // Validate the move
        const isCorrect = validateMove(moveStr)

        // Always update the state and call onMove
        setQuestionAnswer(moveStr, isCorrect)
        onMove(moveStr, isCorrect)

        return { success: true, move: moveStr, correct: isCorrect }
      } catch (error) {
        return {
          error:
            typeof moveInput === 'string'
              ? 'Invalid move format. Use algebraic notation (e.g., e2e4 or e4)'
              : 'Invalid move'
        }
      }
    },
    [game, boardLocked, questionSubmitted, validateMove, onMove]
  )

  return {
    game,
    userMove,
    handleRetry,
    makeMove
  }
}
