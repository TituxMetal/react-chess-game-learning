import { atom } from 'nanostores'

export interface ChessState {
  position: string
  selectedSquare: string | null
  validMoves: string[]
  isInteractive: boolean
}

export const chessStore = atom<ChessState>({
  position: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  selectedSquare: null,
  validMoves: [],
  isInteractive: false,
})

export const setChessPosition = (position: string) => {
  chessStore.set({
    ...chessStore.get(),
    position,
  })
}

export const setInteractive = (interactive: boolean) => {
  chessStore.set({
    ...chessStore.get(),
    isInteractive: interactive,
  })
}

export const setSelectedSquare = (square: string | null) => {
  chessStore.set({
    ...chessStore.get(),
    selectedSquare: square,
  })
}