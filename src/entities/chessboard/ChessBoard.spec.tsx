import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ChessBoard } from './ChessBoard'

// Mock react-chessboard component
vi.mock('react-chessboard', () => ({
  Chessboard: ({
    options
  }: {
    options?: {
      position?: string
      boardOrientation?: string
      allowDragging?: boolean
      onPieceDrop?: (args: {
        piece: { pieceType: string }
        sourceSquare: string
        targetSquare: string | null
      }) => boolean
      boardStyle?: Record<string, string>
    }
  }) => (
    <div
      data-testid='chessboard'
      data-position={options?.position || ''}
      data-orientation={options?.boardOrientation || 'white'}
      data-draggable={String(options?.allowDragging !== false)}
      data-board-style={JSON.stringify(options?.boardStyle || {})}
      onClick={() => {
        // Simulate piece drop for testing
        if (options?.onPieceDrop) {
          options.onPieceDrop({
            piece: { pieceType: 'wP' },
            sourceSquare: 'e2',
            targetSquare: 'e4'
          })
        }
      }}
    >
      Mocked Chessboard
    </div>
  )
}))

const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

describe('ChessBoard Component', () => {
  describe('Position Handling', () => {
    it('should render with starting position', () => {
      render(<ChessBoard position={STARTING_FEN} />)
      const board = screen.getByTestId('chessboard')
      expect(board).toBeInTheDocument()
      expect(board).toHaveAttribute('data-position', STARTING_FEN)
    })

    it('should accept and display custom FEN position', () => {
      const customFEN = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1'
      render(<ChessBoard position={customFEN} />)
      const board = screen.getByTestId('chessboard')
      expect(board).toHaveAttribute('data-position', customFEN)
    })

    it('should convert "startpos" keyword to starting position', () => {
      render(<ChessBoard position='startpos' />)
      const board = screen.getByTestId('chessboard')
      expect(board).toHaveAttribute('data-position', STARTING_FEN)
    })

    it('should show fallback and log warning for invalid FEN', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const invalidFEN = 'invalid-fen'

      render(<ChessBoard position={invalidFEN} />)
      const board = screen.getByTestId('chessboard')

      expect(board).toHaveAttribute('data-position', STARTING_FEN)
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        `Invalid FEN position provided: "${invalidFEN}". Falling back to starting position.`
      )

      consoleWarnSpy.mockRestore()
    })

    it('should handle FEN with only position part (no metadata)', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const partialFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'

      render(<ChessBoard position={partialFEN} />)
      const board = screen.getByTestId('chessboard')

      expect(board).toHaveAttribute('data-position', STARTING_FEN)
      expect(consoleWarnSpy).toHaveBeenCalled()

      consoleWarnSpy.mockRestore()
    })
  })

  describe('Board Orientation', () => {
    it('should default to white orientation', () => {
      render(<ChessBoard position={STARTING_FEN} />)
      const board = screen.getByTestId('chessboard')
      expect(board).toHaveAttribute('data-orientation', 'white')
    })

    it('should change perspective to black orientation', () => {
      render(<ChessBoard position={STARTING_FEN} orientation='black' />)
      const board = screen.getByTestId('chessboard')
      expect(board).toHaveAttribute('data-orientation', 'black')
    })
  })

  describe('Interactive Mode', () => {
    it('should enable piece movement by default', () => {
      render(<ChessBoard position={STARTING_FEN} />)
      const board = screen.getByTestId('chessboard')
      expect(board).toHaveAttribute('data-draggable', 'true')
    })

    it('should disable piece dragging in read-only mode', () => {
      render(<ChessBoard position={STARTING_FEN} interactive={false} />)
      const board = screen.getByTestId('chessboard')
      expect(board).toHaveAttribute('data-draggable', 'false')
    })

    it('should call onMove callback when piece is dropped in interactive mode', () => {
      const onMoveMock = vi.fn()
      render(<ChessBoard position={STARTING_FEN} interactive={true} onMove={onMoveMock} />)

      const board = screen.getByTestId('chessboard')
      board.click() // Simulate piece drop from mock

      expect(onMoveMock).toHaveBeenCalledWith({ from: 'e2', to: 'e4' })
    })

    it('should not call onMove callback in read-only mode', () => {
      const onMoveMock = vi.fn()
      render(<ChessBoard position={STARTING_FEN} interactive={false} onMove={onMoveMock} />)

      const board = screen.getByTestId('chessboard')
      board.click() // Simulate piece drop from mock

      expect(onMoveMock).not.toHaveBeenCalled()
    })
  })

  describe('Responsive Sizing', () => {
    it('should render with responsive container classes', () => {
      const { container } = render(<ChessBoard position={STARTING_FEN} />)
      const boardContainer = container.querySelector('div')

      expect(boardContainer).toHaveClass('mx-auto', 'w-full', 'max-w-[280px]', 'md:max-w-[500px]')
    })

    it('should maintain aspect ratio in container', () => {
      const { container } = render(<ChessBoard position={STARTING_FEN} />)
      const boardContainer = container.querySelector('div')

      // Verify responsive classes are applied for square maintenance
      expect(boardContainer).toHaveClass('w-full')
    })
  })

  describe('Component Styling', () => {
    it('should apply custom board styling', () => {
      render(<ChessBoard position={STARTING_FEN} />)
      const board = screen.getByTestId('chessboard')
      const boardStyle = JSON.parse(board.getAttribute('data-board-style') || '{}')

      expect(boardStyle).toHaveProperty('borderRadius', '4px')
      expect(boardStyle).toHaveProperty('boxShadow', '0 2px 10px rgba(0, 0, 0, 0.5)')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty position string gracefully', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      render(<ChessBoard position='' />)
      const board = screen.getByTestId('chessboard')

      expect(board).toHaveAttribute('data-position', STARTING_FEN)
      expect(consoleWarnSpy).toHaveBeenCalled()

      consoleWarnSpy.mockRestore()
    })

    it('should handle FEN with extra whitespace', () => {
      const fenWithWhitespace =
        '  rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1  '
      render(<ChessBoard position={fenWithWhitespace} />)
      const board = screen.getByTestId('chessboard')

      expect(board).toHaveAttribute('data-position', fenWithWhitespace)
    })
  })
})
