import {
  BoardWinner,
  CellValue,
  GameSnapshot,
  MacroBoardState,
  MiniBoardState,
  Move,
  PlayerSymbol,
} from './types.js';
import { WINNING_COMBINATIONS } from './constants.js';

export function check3x3Winner(cells: (CellValue | BoardWinner)[]): {
  winner: BoardWinner;
  line: number[] | null;
} {
  for (const combo of WINNING_COMBINATIONS) {
    const [a, b, c] = combo;
    if (
      cells[a] &&
      cells[a] !== 'TIE' &&
      cells[a] === cells[b] &&
      cells[a] === cells[c]
    ) {
      return { winner: cells[a] as PlayerSymbol, line: combo };
    }
  }

  const isFull = cells.every((c) => c !== null);
  if (isFull) {
    return { winner: 'TIE', line: null };
  }

  return { winner: null, line: null };
}

export function createInitialState(): GameSnapshot {
  const board: MacroBoardState = Array.from({ length: 9 }, () =>
    Array(9).fill(null)
  );
  const miniWinners: BoardWinner[] = Array(9).fill(null);
  const winningMiniLines: Record<number, number[] | null> = {};
  for (let i = 0; i < 9; i++) {
    winningMiniLines[i] = null;
  }

  return {
    board,
    miniWinners,
    activeBoard: null,
    currentPlayer: 'X',
    winner: null,
    winningLine: null,
    winningMiniLines,
    moves: [],
    isGameOver: false,
  };
}

export function cloneState(state: GameSnapshot): GameSnapshot {
  return {
    board: state.board.map((mini) => [...mini]),
    miniWinners: [...state.miniWinners],
    activeBoard: state.activeBoard,
    currentPlayer: state.currentPlayer,
    winner: state.winner,
    winningLine: state.winningLine ? [...state.winningLine] : null,
    winningMiniLines: { ...state.winningMiniLines },
    moves: state.moves.map((m) => ({ ...m })),
    isGameOver: state.isGameOver,
  };
}

export function generateNotation(boardIndex: number, cellIndex: number): string {
  const boardCol = (boardIndex % 3) + 1;
  const boardRow = Math.floor(boardIndex / 3) + 1;
  const cellCol = (cellIndex % 3) + 1;
  const cellRow = Math.floor(cellIndex / 3) + 1;
  return `B[${boardRow},${boardCol}]-c[${cellRow},${cellCol}]`;
}

export function getLegalMoves(
  state: GameSnapshot
): Array<{ boardIndex: number; cellIndex: number }> {
  if (state.isGameOver) return [];

  const legalMoves: Array<{ boardIndex: number; cellIndex: number }> = [];

  // If activeBoard is specified and that board is not won or full
  if (
    state.activeBoard !== null &&
    state.miniWinners[state.activeBoard] === null &&
    state.board[state.activeBoard].some((c) => c === null)
  ) {
    const b = state.activeBoard;
    for (let c = 0; c < 9; c++) {
      if (state.board[b][c] === null) {
        legalMoves.push({ boardIndex: b, cellIndex: c });
      }
    }
    return legalMoves;
  }

  // Otherwise, wildcard move across any board that is not won and not full
  for (let b = 0; b < 9; b++) {
    if (state.miniWinners[b] === null) {
      for (let c = 0; c < 9; c++) {
        if (state.board[b][c] === null) {
          legalMoves.push({ boardIndex: b, cellIndex: c });
        }
      }
    }
  }

  return legalMoves;
}

export function isMoveValid(
  state: GameSnapshot,
  boardIndex: number,
  cellIndex: number
): boolean {
  if (state.isGameOver) return false;
  if (boardIndex < 0 || boardIndex > 8 || cellIndex < 0 || cellIndex > 8) return false;

  // Mini board already won/tied
  if (state.miniWinners[boardIndex] !== null) return false;

  // Cell already filled
  if (state.board[boardIndex][cellIndex] !== null) return false;

  // Active board constraint
  if (state.activeBoard !== null && state.activeBoard !== boardIndex) {
    // If active board was actually available, user is restricted to it
    if (
      state.miniWinners[state.activeBoard] === null &&
      state.board[state.activeBoard].some((c) => c === null)
    ) {
      return false;
    }
  }

  return true;
}

export function applyMove(
  state: GameSnapshot,
  boardIndex: number,
  cellIndex: number
): GameSnapshot {
  const nextState = cloneState(state);
  const player = nextState.currentPlayer;

  // Record move
  const notation = generateNotation(boardIndex, cellIndex);
  nextState.board[boardIndex][cellIndex] = player;
  nextState.moves.push({
    boardIndex,
    cellIndex,
    player,
    timestamp: Date.now(),
    notation,
  });

  // Check mini board win
  const miniRes = check3x3Winner(nextState.board[boardIndex]);
  if (miniRes.winner) {
    nextState.miniWinners[boardIndex] = miniRes.winner;
    nextState.winningMiniLines[boardIndex] = miniRes.line;

    // Check macro board win
    const macroRes = check3x3Winner(nextState.miniWinners);
    if (macroRes.winner) {
      nextState.winner = macroRes.winner;
      nextState.winningLine = macroRes.line;
      nextState.isGameOver = true;
    }
  }

  // Check full macro board tie
  if (!nextState.isGameOver) {
    const allMiniDone = nextState.miniWinners.every((w) => w !== null);
    if (allMiniDone) {
      nextState.winner = 'TIE';
      nextState.isGameOver = true;
    }
  }

  // Determine next active board
  if (!nextState.isGameOver) {
    const targetBoardWon = nextState.miniWinners[cellIndex] !== null;
    const targetBoardFull = nextState.board[cellIndex].every((c) => c !== null);

    if (targetBoardWon || targetBoardFull) {
      nextState.activeBoard = null; // Wildcard!
    } else {
      nextState.activeBoard = cellIndex;
    }

    nextState.currentPlayer = player === 'X' ? 'O' : 'X';
  }

  return nextState;
}
