import { useState, useCallback } from 'react';
import { AIDifficulty, BoardWinner, GameStatistics } from '../game/types.js';
import { getStoredStatistics, saveStoredStatistics } from '../services/storage.js';
import { INITIAL_STATISTICS } from '../game/constants.js';

export function useStats() {
  const [stats, setStats] = useState<GameStatistics>(getStoredStatistics);

  const recordLocalResult = useCallback(
    (winner: BoardWinner, difficulty?: AIDifficulty) => {
      setStats((prev) => {
        const next: GameStatistics = JSON.parse(JSON.stringify(prev));
        next.gamesPlayed++;

        if (winner === 'X') {
          next.wins++;
          next.currentStreak++;
          if (next.currentStreak > next.bestStreak) {
            next.bestStreak = next.currentStreak;
          }
        } else if (winner === 'O') {
          next.losses++;
          next.currentStreak = 0;
        } else {
          next.draws++;
          next.currentStreak = 0;
        }

        if (difficulty) {
          const diffStats = next.byDifficulty[difficulty];
          diffStats.played++;
          if (winner === 'X') diffStats.wins++;
          else if (winner === 'O') diffStats.losses++;
          else diffStats.draws++;
        }

        saveStoredStatistics(next);
        return next;
      });
    },
    []
  );

  const recordOnlineResult = useCallback((winner: BoardWinner, userSymbol: 'X' | 'O') => {
    setStats((prev) => {
      const next: GameStatistics = JSON.parse(JSON.stringify(prev));
      next.gamesPlayed++;
      next.onlineMatches.played++;

      if (winner === userSymbol) {
        next.wins++;
        next.onlineMatches.wins++;
        next.currentStreak++;
        if (next.currentStreak > next.bestStreak) {
          next.bestStreak = next.currentStreak;
        }
      } else if (winner === 'TIE') {
        next.draws++;
        next.onlineMatches.draws++;
        next.currentStreak = 0;
      } else {
        next.losses++;
        next.onlineMatches.losses++;
        next.currentStreak = 0;
      }

      saveStoredStatistics(next);
      return next;
    });
  }, []);

  const resetStats = useCallback(() => {
    saveStoredStatistics(INITIAL_STATISTICS);
    setStats(INITIAL_STATISTICS);
  }, []);

  return {
    stats,
    recordLocalResult,
    recordOnlineResult,
    resetStats,
  };
}
