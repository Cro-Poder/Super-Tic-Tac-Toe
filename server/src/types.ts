export type PlayerSymbol = 'X' | 'O';
export type BoardCell = PlayerSymbol | null;
export type MiniBoardState = BoardCell[]; // length 9
export type MacroBoardState = MiniBoardState[]; // length 9 (9 mini boards of 9 cells each)
export type BoardWinner = PlayerSymbol | 'TIE' | null;

export interface Move {
  boardIndex: number; // 0-8
  cellIndex: number;  // 0-8
  player: PlayerSymbol;
  timestamp: number;
}

export interface PlayerInfo {
  id: string;
  socketId: string;
  name: string;
  symbol: PlayerSymbol;
  isReady: boolean;
  connected: boolean;
  timeLeft?: number; // in seconds
}

export interface SpectatorInfo {
  id: string;
  socketId: string;
  name: string;
}

export interface GameState {
  board: MacroBoardState;
  miniWinners: BoardWinner[]; // length 9
  activeBoard: number | null; // null means any open board (wildcard)
  currentPlayer: PlayerSymbol;
  winner: BoardWinner;
  winningLine: number[] | null; // e.g. [0, 4, 8]
  winningMiniLines: Record<number, number[] | null>; // boardIndex -> winning line in that mini board
  moves: Move[];
  isStarted: boolean;
  isGameOver: boolean;
}

export interface RoomSettings {
  turnTimeLimit: number; // 0 = unlimited, or 15, 30, 60 seconds
  isPrivate: boolean;
  allowSpectators: boolean;
}

export interface Room {
  code: string;
  createdAt: number;
  hostId: string;
  players: Record<PlayerSymbol, PlayerInfo | null>;
  spectators: SpectatorInfo[];
  gameState: GameState;
  settings: RoomSettings;
  rematchRequested: {
    X: boolean;
    O: boolean;
  };
}

export interface EmoteMessage {
  senderId: string;
  senderName: string;
  senderSymbol?: PlayerSymbol | 'SPECTATOR';
  type: 'emoji' | 'text';
  content: string;
  timestamp: number;
}
