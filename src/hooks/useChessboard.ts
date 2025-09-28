import { useStore } from '@nanostores/react'
import { chessStore, setChessPosition, setInteractive, setSelectedSquare } from '../stores/chessStore'

export const useChessboard = () => {
  const chess = useStore(chessStore)

  const handleSquareClick = (square: string) => {
    if (!chess.isInteractive) return
    
    // Simple square selection logic
    setSelectedSquare(chess.selectedSquare === square ? null : square)
  }

  const handlePieceDrop = (sourceSquare: string, targetSquare: string) => {
    if (!chess.isInteractive) return false
    
    // This would contain move validation logic
    // For now, we'll just allow the move
    return true
  }

  return {
    chess,
    setPosition: setChessPosition,
    setInteractive,
    onSquareClick: handleSquareClick,
    onPieceDrop: handlePieceDrop,
  }
}