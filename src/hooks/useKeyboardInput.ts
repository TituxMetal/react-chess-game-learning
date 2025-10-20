import { useCallback, useState } from 'react'

interface UseKeyboardInputProps {
  onSubmit: (move: string) => { error?: string; success?: boolean } | null
  disabled: boolean
}

export const useKeyboardInput = ({ onSubmit, disabled }: UseKeyboardInputProps) => {
  const [keyboardMove, setKeyboardMove] = useState('')
  const [keyboardError, setKeyboardError] = useState<string | null>(null)

  const handleSubmit = useCallback(() => {
    if (disabled || !keyboardMove.trim()) {
      return
    }

    setKeyboardError(null)
    const result = onSubmit(keyboardMove)
    
    if (result?.error) {
      setKeyboardError(result.error)
    }
  }, [onSubmit, disabled, keyboardMove])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleSubmit()
      }
    },
    [handleSubmit]
  )

  const reset = useCallback(() => {
    setKeyboardMove('')
    setKeyboardError(null)
  }, [])

  return {
    keyboardMove,
    setKeyboardMove,
    keyboardError,
    handleSubmit,
    handleKeyDown,
    reset
  }
}
