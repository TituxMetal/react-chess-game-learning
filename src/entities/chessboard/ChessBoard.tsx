import { memo } from 'react'
import { Chessboard } from 'react-chessboard'

const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

export interface ChessBoardProps {
  position: string // FEN notation or 'startpos'
  orientation?: 'white' | 'black' // Default: 'white'
  interactive?: boolean // Default: true, false for read-only display
  onMove?: (move: { from: string; to: string }) => void // For future move validation
}

/**
 * ChessBoard - Wrapper component for react-chessboard library
 *
 * Features:
 * - Position handling: Converts 'startpos' keyword to starting FEN
 * - Error boundaries: Graceful fallback for invalid FEN positions
 * - Responsive design: Container-based sizing for mobile/desktop
 * - Read-only mode: Disable piece dragging for display-only chapters
 */
export const ChessBoard = memo(
  ({ position, orientation = 'white', interactive = true, onMove }: ChessBoardProps) => {
    // Convert 'startpos' to starting FEN
    let boardPosition = position === 'startpos' ? STARTING_FEN : position

    // Validate FEN format (basic check)
    // A valid FEN has 6 space-separated parts: position, turn, castling, en passant, halfmove, fullmove
    const fenParts = boardPosition.split(' ')
    const isValidFEN = fenParts.length >= 4 // Minimum required parts

    if (!isValidFEN) {
      console.warn(
        `Invalid FEN position provided: "${boardPosition}". Falling back to starting position.`
      )
      boardPosition = STARTING_FEN
    }

    // Handle piece drag for interactive mode
    const handlePieceDrop = ({
      sourceSquare,
      targetSquare
    }: {
      piece: { pieceType: string }
      sourceSquare: string
      targetSquare: string | null
    }) => {
      if (!targetSquare || !interactive) return false

      // Call the parent onMove handler - parent will update position if move is legal
      onMove?.({ from: sourceSquare, to: targetSquare })

      // Allow visual move - parent will override position if move is illegal
      return true
    }

    return (
      <div className='mx-auto w-full max-w-[280px] md:max-w-[500px]'>
        <Chessboard
          options={{
            position: boardPosition,
            boardOrientation: orientation,
            allowDragging: interactive,
            onPieceDrop: handlePieceDrop,
            boardStyle: {
              borderRadius: '4px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
            }
          }}
        />
      </div>
    )
  }
)
