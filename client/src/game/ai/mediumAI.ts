import { GameSnapshot, PlayerSymbol } from '../types.js';
import { WINNING_COMBINATIONS } from '../constants.js';
import { applyMove, getLegalMoves } from '../rules.js';

// Positional Weights
const BOARD_WEIGHTS = [3, 2, 3, 2, 5, 2, 3, 2, 3]; // Center is 5, corners 3, edges 2
const CELL_WEIGHTS = [3, 2, 3, 2, 4, 2, 3, 2, 3];

export function evaluateBoardHeuristic(
  state: GameSnapshot,
  aiPlayer: PlayerSymbol
): number {
  if (state.isGameOver) {
    if (state.winner === aiPlayer) return 100000;
    if (state.winner === 'TIE') return 0;
    return -100000;
  }

  const opponent: PlayerSymbol = aiPlayer === 'X' ? 'O' : 'X';
  let score = 0;

  // 1. Evaluate Macro Board lines
  for (const combo of WINNING_COMBINATIONS) {
    let aiCount = 0;
    let oppCount = 0;
    for (const idx of combo) {
      if (state.miniWinners[idx] === aiPlayer) aiCount++;
      else if (state.miniWinners[idx] === opponent) oppCount++;
    }

    if (aiCount === 2 && oppCount === 0) score += 3000;
    else if (aiCount === 1 && oppCount === 0) score += 500;

    if (oppCount === 2 && aiCount === 0) score -= 3500; // Strong block incentive
    else if (oppCount === 1 && aiCount === 0) score -= 450;
  }

  // 2. Evaluate Mini-board ownership weighted by strategic position
  for (let b = 0; b < 9; b++) {
    const miniWinner = state.miniWinners[b];
    const bWeight = BOARD_WEIGHTS[b];

    if (miniWinner === aiPlayer) {
      score += 400 * bWeight;
    } else if (miniWinner === opponent) {
      score -= 400 * bWeight;
    } else {
      // In-progress mini board evaluation
      const miniBoard = state.board[b];
      for (const combo of WINNING_COMBINATIONS) {
        let miniAi = 0;
        let miniOpp = 0;
        for (const c of combo) {
          if (miniBoard[c] === aiPlayer) miniAi++;
          else if (miniBoard[c] === opponent) miniOpp++;
        }

        if (miniAi === 2 && miniOpp === 0) score += 50 * bWeight;
        if (miniOpp === 2 && miniAi === 0) score -= 60 * bWeight;
      }

      // Center cell of mini-board control
      if (miniBoard[4] === aiPlayer) score += 15 * bWeight;
      else if (miniBoard[4] === opponent) score -= 15 * bWeight;
    }
  }

  return score;
}

export function getMediumAIMove(
  state: GameSnapshot,
  aiPlayer: PlayerSymbol = 'O'
): { boardIndex: number; cellIndex: number } | null {
  const legalMoves = getLegalMoves(state);
  if (legalMoves.length === 0) return null;

  const opponent: PlayerSymbol = aiPlayer === 'X' ? 'O' : 'X';

  let bestMove = legalMoves[0];
  let bestScore = -Infinity;

  // Perform 2-ply Minimax search
  for (const move of legalMoves) {
    const nextState = applyMove(state, move.boardIndex, move.cellIndex);

    // If this move wins the whole game immediately
    if (nextState.isGameOver && nextState.winner === aiPlayer) {
      return move;
    }

    // Opponent's counter moves
    const opponentMoves = getLegalMoves(nextState);
    let minOpponentScore = Infinity;

    if (opponentMoves.length === 0 || nextState.isGameOver) {
      minOpponentScore = evaluateBoardHeuristic(nextState, aiPlayer);
    } else {
      for (const oppMove of opponentMoves) {
        const afterOppState = applyMove(
          nextState,
          oppMove.boardIndex,
          oppMove.cellIndex
        );
        const evalScore = evaluateBoardHeuristic(afterOppState, aiPlayer);
        if (evalScore < minOpponentScore) {
          minOpponentScore = evalScore;
        }
      }
    }

    // Add positional cell bonus
    const positionalBonus =
      BOARD_WEIGHTS[move.boardIndex] * 2 + CELL_WEIGHTS[move.cellIndex];
    const totalScore = minOpponentScore + positionalBonus;

    if (totalScore > bestScore) {
      bestScore = totalScore;
      bestMove = move;
    }
  }

  return bestMove;
}
