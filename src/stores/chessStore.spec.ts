import { beforeEach, describe, expect, it } from 'vitest'
import { chessStore, setChessPosition, setInteractive, setSelectedSquare } from './chessStore'

describe('chessStore', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    chessStore.set({
      position: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      selectedSquare: null,
      validMoves: [],
      isInteractive: false
    })
  })

  describe('initial state', () => {
    it('should have correct initial chess position', () => {
      const state = chessStore.get()
      expect(state.position).toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
    })

    it('should have no selected square initially', () => {
      const state = chessStore.get()
      expect(state.selectedSquare).toBeNull()
    })

    it('should have empty valid moves initially', () => {
      const state = chessStore.get()
      expect(state.validMoves).toEqual([])
    })

    it('should not be interactive initially', () => {
      const state = chessStore.get()
      expect(state.isInteractive).toBe(false)
    })

    it('should have correct ChessState interface structure', () => {
      const state = chessStore.get()
      expect(state).toHaveProperty('position')
      expect(state).toHaveProperty('selectedSquare')
      expect(state).toHaveProperty('validMoves')
      expect(state).toHaveProperty('isInteractive')
    })
  })

  describe('setChessPosition', () => {
    it('should update chess position while preserving other state', () => {
      // Set some initial state
      chessStore.set({
        position: 'initial',
        selectedSquare: 'e4',
        validMoves: ['e5', 'e6'],
        isInteractive: true
      })

      const newPosition = 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2'
      setChessPosition(newPosition)

      const state = chessStore.get()
      expect(state.position).toBe(newPosition)
      expect(state.selectedSquare).toBe('e4') // preserved
      expect(state.validMoves).toEqual(['e5', 'e6']) // preserved
      expect(state.isInteractive).toBe(true) // preserved
    })

    it('should handle empty position string', () => {
      setChessPosition('')
      const state = chessStore.get()
      expect(state.position).toBe('')
    })

    it('should handle complex FEN positions', () => {
      const complexFEN = 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 4 4'
      setChessPosition(complexFEN)
      const state = chessStore.get()
      expect(state.position).toBe(complexFEN)
    })
  })

  describe('setInteractive', () => {
    it('should set interactive to true while preserving other state', () => {
      // Set some initial state
      chessStore.set({
        position: 'custom-position',
        selectedSquare: 'd4',
        validMoves: ['d5', 'd6'],
        isInteractive: false
      })

      setInteractive(true)

      const state = chessStore.get()
      expect(state.isInteractive).toBe(true)
      expect(state.position).toBe('custom-position') // preserved
      expect(state.selectedSquare).toBe('d4') // preserved
      expect(state.validMoves).toEqual(['d5', 'd6']) // preserved
    })

    it('should set interactive to false while preserving other state', () => {
      // Set some initial state
      chessStore.set({
        position: 'another-position',
        selectedSquare: 'a1',
        validMoves: ['a2', 'b1'],
        isInteractive: true
      })

      setInteractive(false)

      const state = chessStore.get()
      expect(state.isInteractive).toBe(false)
      expect(state.position).toBe('another-position') // preserved
      expect(state.selectedSquare).toBe('a1') // preserved
      expect(state.validMoves).toEqual(['a2', 'b1']) // preserved
    })

    it('should handle multiple interactive state changes', () => {
      setInteractive(true)
      expect(chessStore.get().isInteractive).toBe(true)

      setInteractive(false)
      expect(chessStore.get().isInteractive).toBe(false)

      setInteractive(true)
      expect(chessStore.get().isInteractive).toBe(true)
    })
  })

  describe('setSelectedSquare', () => {
    it('should set selected square to valid square while preserving other state', () => {
      // Set some initial state
      chessStore.set({
        position: 'test-position',
        selectedSquare: null,
        validMoves: ['e4', 'e5'],
        isInteractive: true
      })

      setSelectedSquare('e4')

      const state = chessStore.get()
      expect(state.selectedSquare).toBe('e4')
      expect(state.position).toBe('test-position') // preserved
      expect(state.validMoves).toEqual(['e4', 'e5']) // preserved
      expect(state.isInteractive).toBe(true) // preserved
    })

    it('should set selected square to null (deselect)', () => {
      // Set initial selected square
      chessStore.set({
        position: 'test-position',
        selectedSquare: 'h8',
        validMoves: [],
        isInteractive: false
      })

      setSelectedSquare(null)

      const state = chessStore.get()
      expect(state.selectedSquare).toBeNull()
    })

    it('should handle different square notations', () => {
      const squares = ['a1', 'h8', 'e4', 'd5', 'f7', 'b2']

      squares.forEach(square => {
        setSelectedSquare(square)
        expect(chessStore.get().selectedSquare).toBe(square)
      })
    })

    it('should handle switching between selected squares', () => {
      setSelectedSquare('e4')
      expect(chessStore.get().selectedSquare).toBe('e4')

      setSelectedSquare('d5')
      expect(chessStore.get().selectedSquare).toBe('d5')

      setSelectedSquare(null)
      expect(chessStore.get().selectedSquare).toBeNull()
    })
  })

  describe('store reactivity', () => {
    it('should notify subscribers when position changes', () => {
      let notificationCount = 0
      const unsubscribe = chessStore.subscribe(() => {
        notificationCount++
      })

      // Reset counter after initial subscription notification
      notificationCount = 0

      setChessPosition('new-position')
      expect(notificationCount).toBe(1)

      setChessPosition('another-position')
      expect(notificationCount).toBe(2)

      unsubscribe()
    })

    it('should notify subscribers when interactive state changes', () => {
      let notificationCount = 0
      const unsubscribe = chessStore.subscribe(() => {
        notificationCount++
      })

      // Reset counter after initial subscription notification
      notificationCount = 0

      setInteractive(true)
      expect(notificationCount).toBe(1)

      setInteractive(false)
      expect(notificationCount).toBe(2)

      unsubscribe()
    })

    it('should notify subscribers when selected square changes', () => {
      let notificationCount = 0
      const unsubscribe = chessStore.subscribe(() => {
        notificationCount++
      })

      // Reset counter after initial subscription notification
      notificationCount = 0

      setSelectedSquare('e4')
      expect(notificationCount).toBe(1)

      setSelectedSquare(null)
      expect(notificationCount).toBe(2)

      unsubscribe()
    })
  })

  describe('state immutability', () => {
    it('should not mutate original state when setting position', () => {
      const originalState = chessStore.get()
      const originalPosition = originalState.position

      setChessPosition('new-position')

      // Original state reference should remain unchanged
      expect(originalState.position).toBe(originalPosition)
      expect(chessStore.get().position).toBe('new-position')
    })

    it('should create new state object on each update', () => {
      const state1 = chessStore.get()
      setInteractive(true)
      const state2 = chessStore.get()

      expect(state1).not.toBe(state2) // Different object references
      expect(state1.isInteractive).toBe(false)
      expect(state2.isInteractive).toBe(true)
    })
  })

  describe('edge cases', () => {
    it('should handle rapid successive updates', () => {
      setChessPosition('pos1')
      setInteractive(true)
      setSelectedSquare('e4')
      setChessPosition('pos2')
      setSelectedSquare('d5')
      setInteractive(false)

      const finalState = chessStore.get()
      expect(finalState.position).toBe('pos2')
      expect(finalState.isInteractive).toBe(false)
      expect(finalState.selectedSquare).toBe('d5')
    })

    it('should maintain state consistency across multiple operations', () => {
      // Simulate a typical chess interaction sequence
      setInteractive(true)
      setSelectedSquare('e2')
      setChessPosition('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1')
      setSelectedSquare(null)

      const state = chessStore.get()
      expect(state.isInteractive).toBe(true)
      expect(state.selectedSquare).toBeNull()
      expect(state.position).toBe('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1')
    })
  })
})
