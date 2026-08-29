import { AIEvaluationResult, GameSnapshot, PlayerSymbol } from '../types.js';
import { WINNING_COMBINATIONS } from '../constants.js';
import { applyMove, getLegalMoves } from '../rules.js';
import { evaluateBoardHeuristic } from './mediumAI.js';

// Cache transposition table
const transpositionTable = new Map<string, { depth: number; score: number }>();

function getStateHash(state: GameSnapshot): string {
  // Fast string hash of board + miniWinners + activeBoard + currentPlayer
  let hash = `${state.currentPlayer}:${state.activeBoard ?? 'W'}|`;
  for (let b = 0; b < 9; b++) {
    hash += state.miniWinners[b] ?? '.';
  }
  hash += '|';
  for (let b = 0; b < 9; b++) {
    for (let c = 0; c < 9; c++) {
      hash += state.board[b][c] ?? '.';
    }
  }
  return hash;
}

// Move ordering heuristic to trigger earlier alpha-beta cutoffs
function sortMoves(
  moves: Array<{ boardIndex: number; cellIndex: number }>,
  state: GameSnapshot,
  player: PlayerSymbol
): Array<{ boardIndex: number; cellIndex: number }> {
  return [...moves].sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;

    // Favor center and corners
    if (a.boardIndex === 4) scoreA += 10;
    if (a.cellIndex === 4) scoreA += 8;
    if (b.boardIndex === 4) scoreB += 10;
    if (b.cellIndex === 4) scoreB += 8;

    // Favor winning a mini-board
    const nextStateA = applyMove(state, a.boardIndex, a.cellIndex);
    if (nextStateA.miniWinners[a.boardIndex] === player) scoreA += 50;
    if (nextStateA.winner === player) scoreA += 1000;

    const nextStateB = applyMove(state, b.boardIndex, b.cellIndex);
    if (nextStateB.miniWinners[b.boardIndex] === player) scoreB += 50;
    if (nextStateB.winner === player) scoreB += 1000;

    return scoreB - scoreA;
  });
}

function minimax(
  state: GameSnapshot,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  aiPlayer: PlayerSymbol,
  stats: { nodesEvaluated: number }
): number {
  stats.nodesEvaluated++;

  const stateHash = getStateHash(state);
  const cached = transpositionTable.get(stateHash);
  if (cached && cached.depth >= depth) {
    return cached.score;
  }

  if (depth === 0 || state.isGameOver) {
    const evalScore = evaluateBoardHeuristic(state, aiPlayer);
    transpositionTable.set(stateHash, { depth, score: evalScore });
    return evalScore;
  }

  const legalMoves = getLegalMoves(state);
  if (legalMoves.length === 0) {
    return evaluateBoardHeuristic(state, aiPlayer);
  }

  const sortedMoves = sortMoves(legalMoves, state, state.currentPlayer);

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of sortedMoves) {
      const nextState = applyMove(state, move.boardIndex, move.cellIndex);
      const evaluation = minimax(
        nextState,
        depth - 1,
        alpha,
        beta,
        false,
        aiPlayer,
        stats
      );
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) {
        break; // Alpha-beta cutoff
      }
    }
    transpositionTable.set(stateHash, { depth, score: maxEval });
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of sortedMoves) {
      const nextState = applyMove(state, move.boardIndex, move.cellIndex);
      const evaluation = minimax(
        nextState,
        depth - 1,
        alpha,
        beta,
        true,
        aiPlayer,
        stats
      );
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) {
        break; // Alpha-beta cutoff
      }
    }
    transpositionTable.set(stateHash, { depth, score: minEval });
    return minEval;
  }
}

export function getHardAIMove(
  state: GameSnapshot,
  aiPlayer: PlayerSymbol = 'O'
): AIEvaluationResult {
  const startTime = performance.now();
  const legalMoves = getLegalMoves(state);

  if (legalMoves.length === 0) {
    return {
      bestMove: null,
      score: 0,
      depthReached: 0,
      nodesEvaluated: 0,
      durationMs: 0,
    };
  }

  // Clear or prune transposition table if too large
  if (transpositionTable.size > 20000) {
    transpositionTable.clear();
  }

  // Dynamic search depth calculation:
  // If branching factor is huge (e.g. wildcard move with 50+ choices), search depth 3 or 4.
  // If constrained to a single mini-board (<= 9 moves), search depth 5 or 6.
  let targetDepth = 4;
  if (legalMoves.length <= 9) {
    targetDepth = 5;
  } else if (legalMoves.length > 30) {
    targetDepth = 3;
  }

  const sortedMoves = sortMoves(legalMoves, state, aiPlayer);

  let bestMove = sortedMoves[0];
  let bestScore = -Infinity;
  const stats = { nodesEvaluated: 0 };

  let alpha = -Infinity;
  const beta = Infinity;

  for (const move of sortedMoves) {
    const nextState = applyMove(state, move.boardIndex, move.cellIndex);

    // Immediate match winner check
    if (nextState.isGameOver && nextState.winner === aiPlayer) {
      return {
        bestMove: move,
        score: 100000,
        depthReached: 1,
        nodesEvaluated: stats.nodesEvaluated + 1,
        durationMs: performance.now() - startTime,
      };
    }

    const evalScore = minimax(
      nextState,
      targetDepth - 1,
      alpha,
      beta,
      false,
      aiPlayer,
      stats
    );

    if (evalScore > bestScore) {
      bestScore = evalScore;
      bestMove = move;
    }

    alpha = Math.max(alpha, evalScore);
  }

  const durationMs = performance.now() - startTime;

  return {
    bestMove,
    score: bestScore,
    depthReached: targetDepth,
    nodesEvaluated: stats.nodesEvaluated,
    durationMs,
  };
}
