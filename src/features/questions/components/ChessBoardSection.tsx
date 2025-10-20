import { Chess } from 'chess.js'
import { ChessBoard } from '~/entities/chessboard/ChessBoard'
import { Question } from '~/types/story'

interface ChessBoardSectionProps {
  question: Question
  game: Chess
  userMove: string | null
  interactive: boolean
  questionSubmitted: boolean
  onMove: (move: { from: string; to: string }) => void
}

export const ChessBoardSection = ({
  question,
  game,
  userMove,
  interactive,
  questionSubmitted,
  onMove
}: ChessBoardSectionProps) => {
  return (
    <div className='flex justify-center'>
      <ChessBoard
        key={`${question.initialPosition || 'start'}-${userMove || 'initial'}-${questionSubmitted}`}
        position={game.fen()}
        interactive={interactive}
        onMove={onMove}
      />
    </div>
  )
}
