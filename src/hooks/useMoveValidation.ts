import { useCallback } from 'react'
import { Question } from '~/types/story'

interface UseMoveValidationProps {
  question: Question
}

export const useMoveValidation = ({ question }: UseMoveValidationProps) => {
  const validateMove = useCallback(
    (moveStr: string): boolean => {
      const correctAnswers = Array.isArray(question.correctAnswer)
        ? question.correctAnswer
        : [question.correctAnswer]

      // Check for exact match
      if (correctAnswers.includes(moveStr)) {
        return true
      }

      // Check for pattern matching (e.g., "pawn.*", "any legal pawn move")
      for (const pattern of correctAnswers) {
        if (!pattern.includes('*') && !pattern.startsWith('/')) {
          continue
        }

        try {
          const regex = new RegExp(pattern.replace('*', '.*'))
          if (regex.test(moveStr)) {
            return true
          }
        } catch {
          // Invalid regex pattern, skip
          continue
        }
      }

      return false
    },
    [question.correctAnswer]
  )

  return { validateMove }
}
