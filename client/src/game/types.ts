export type PlayerSymbol = 'X' | 'O';
export type CellValue = PlayerSymbol | null;
export type BoardWinner = PlayerSymbol | 'TIE' | null;

export type MiniBoardState = CellValue[]; // length 9 (indices 0..8)
export type MacroBoardState = MiniBoardState[]; // length 9 (9 mini-boards of 9 cells)

export type GameMode = 'pvc' | 'pvp-local' | 'pvp-online' | 'replay';
export type AIDifficulty = 'easy' | 'medium' | 'hard';
export type ThemeMode = 'dark' | 'light' | 'cyberpunk';

export interface Move {
  boardIndex: number; // 0-8 (macro board position)
  cellIndex: number;  // 0-8 (mini board cell position)
  player: PlayerSymbol;
  timestamp: number;
  notation?: string;  // e.g. "B5-c2"
}

export interface GameSnapshot {
  board: MacroBoardState;
  miniWinners: BoardWinner[];
  activeBoard: number | null;
  currentPlayer: PlayerSymbol;
  winner: BoardWinner;
  winningLine: number[] | null;
  winningMiniLines: Record<number, number[] | null>;
  moves: Move[];
  isGameOver: boolean;
}

export interface PlayerSettings {
  username: string;
  avatar: string;
  soundEnabled: boolean;
  musicEnabled: boolean;
  soundVolume: number; // 0 to 1
  musicVolume: number; // 0 to 1
  theme: ThemeMode;
  animationsEnabled: boolean;
  defaultAIDifficulty: AIDifficulty;
  showBoardCoordinates: boolean;
  autoHintEnabled: boolean;
}

export interface GameStatistics {
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  currentStreak: number;
  bestStreak: number;
  byDifficulty: {
    easy: { played: number; wins: number; losses: number; draws: number };
    medium: { played: number; wins: number; losses: number; draws: number };
    hard: { played: number; wins: number; losses: number; draws: number };
  };
  onlineMatches: {
    played: number;
    wins: number;
    losses: number;
    draws: number;
  };
}

export interface AIEvaluationResult {
  bestMove: { boardIndex: number; cellIndex: number } | null;
  score: number;
  depthReached: number;
  nodesEvaluated: number;
  durationMs: number;
}
