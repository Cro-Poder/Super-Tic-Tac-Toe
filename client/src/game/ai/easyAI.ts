import { GameSnapshot, PlayerSymbol } from '../types.js';
import { applyMove, getLegalMoves } from '../rules.js';

export function getEasyAIMove(
  state: GameSnapshot,
  aiPlayer: PlayerSymbol = 'O'
): { boardIndex: number; cellIndex: number } | null {
  const legalMoves = getLegalMoves(state);
  if (legalMoves.length === 0) return null;

  const opponent: PlayerSymbol = aiPlayer === 'X' ? 'O' : 'X';

  // 1. Check if any move immediately wins a mini board for AI
  for (const move of legalMoves) {
    const nextState = applyMove(state, move.boardIndex, move.cellIndex);
    if (nextState.miniWinners[move.boardIndex] === aiPlayer) {
      // 85% chance to take it
      if (Math.random() < 0.85) {
        return move;
      }
    }
  }

  // 2. Check if need to block an immediate mini board win by opponent
  for (const move of legalMoves) {
    const simulatedOpponentState = {
      ...state,
      currentPlayer: opponent,
    };
    const testState = applyMove(
      simulatedOpponentState,
      move.boardIndex,
      move.cellIndex
    );
    if (testState.miniWinners[move.boardIndex] === opponent) {
      if (Math.random() < 0.75) {
        return move;
      }
    }
  }

  // 3. Otherwise pick a random legal move
  const randomIndex = Math.floor(Math.random() * legalMoves.length);
  return legalMoves[randomIndex];
}
