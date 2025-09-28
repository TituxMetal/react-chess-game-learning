import { Chessboard } from 'react-chessboard'
import { useChessboard } from '../hooks/useChessboard'

interface ChessboardComponentProps {
  position?: string
  interactive?: boolean
  size?: number
}

const ChessboardComponent = ({ 
  position, 
  interactive = false, 
  size = 400 
}: ChessboardComponentProps) => {
  const { chess, setPosition, setInteractive, onSquareClick, onPieceDrop } = useChessboard()

  // Update position when prop changes
  if (position && position !== chess.position) {
    setPosition(position)
  }

  // Update interactivity when prop changes
  if (interactive !== chess.isInteractive) {
    setInteractive(interactive)
  }

  return (
    <div className="flex justify-center p-4">
      <div 
        className="rounded-lg overflow-hidden shadow-2xl border-2 border-dark-700"
        style={{ width: size, height: size }}
      >
        <Chessboard
          position={chess.position}
          onSquareClick={onSquareClick}
          onPieceDrop={onPieceDrop}
          arePiecesDraggable={interactive}
          boardWidth={size}
          customBoardStyle={{
            borderRadius: '8px',
          }}
          customDarkSquareStyle={{
            backgroundColor: '#475569',
          }}
          customLightSquareStyle={{
            backgroundColor: '#cbd5e1',
          }}
        />
      </div>
    </div>
  )
}

export default ChessboardComponent