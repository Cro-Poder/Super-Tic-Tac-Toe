import { GameStatistics, PlayerSettings } from './types.js';

export const WINNING_COMBINATIONS = [
  [0, 1, 2], // Row 0
  [3, 4, 5], // Row 1
  [6, 7, 8], // Row 2
  [0, 3, 6], // Col 0
  [1, 4, 7], // Col 1
  [2, 5, 8], // Col 2
  [0, 4, 8], // Diag \
  [2, 4, 6], // Diag /
];

export const BOARD_NAMES = [
  'Top-Left',
  'Top-Center',
  'Top-Right',
  'Middle-Left',
  'Center',
  'Middle-Right',
  'Bottom-Left',
  'Bottom-Center',
  'Bottom-Right',
];

export const BOARD_COORDINATES = [
  'TL', 'TC', 'TR',
  'ML', 'CC', 'MR',
  'BL', 'BC', 'BR'
];

export const DEFAULT_SETTINGS: PlayerSettings = {
  username: 'Player 1',
  avatar: '⚡',
  soundEnabled: true,
  musicEnabled: false,
  soundVolume: 0.7,
  musicVolume: 0.35,
  theme: 'dark',
  animationsEnabled: true,
  defaultAIDifficulty: 'medium',
  showBoardCoordinates: true,
  autoHintEnabled: false,
};

export const INITIAL_STATISTICS: GameStatistics = {
  gamesPlayed: 0,
  wins: 0,
  losses: 0,
  draws: 0,
  currentStreak: 0,
  bestStreak: 0,
  byDifficulty: {
    easy: { played: 0, wins: 0, losses: 0, draws: 0 },
    medium: { played: 0, wins: 0, losses: 0, draws: 0 },
    hard: { played: 0, wins: 0, losses: 0, draws: 0 },
  },
  onlineMatches: {
    played: 0,
    wins: 0,
    losses: 0,
    draws: 0,
  },
};
