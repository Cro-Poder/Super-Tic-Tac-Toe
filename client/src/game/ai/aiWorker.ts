import { AIDifficulty, GameSnapshot, PlayerSymbol } from '../types.js';
import { getEasyAIMove } from './easyAI.js';
import { getMediumAIMove } from './mediumAI.js';
import { getHardAIMove } from './hardAI.js';

export function computeAIMove(
  state: GameSnapshot,
  difficulty: AIDifficulty,
  aiPlayer: PlayerSymbol = 'O'
): {
  move: { boardIndex: number; cellIndex: number } | null;
  stats?: { depth: number; nodes: number; durationMs: number };
} {
  switch (difficulty) {
    case 'easy': {
      const move = getEasyAIMove(state, aiPlayer);
      return { move };
    }
    case 'medium': {
      const move = getMediumAIMove(state, aiPlayer);
      return { move };
    }
    case 'hard': {
      const result = getHardAIMove(state, aiPlayer);
      return {
        move: result.bestMove,
        stats: {
          depth: result.depthReached,
          nodes: result.nodesEvaluated,
          durationMs: Math.round(result.durationMs),
        },
      };
    }
    default:
      return { move: getEasyAIMove(state, aiPlayer) };
  }
}
