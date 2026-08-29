import {
  BoardWinner,
  GameState,
  MacroBoardState,
  Move,
  PlayerInfo,
  PlayerSymbol,
  Room,
  RoomSettings,
  SpectatorInfo,
} from './types.js';

// All 8 possible winning lines on a 3x3 grid (indices 0..8)
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

export function check3x3Winner(cells: BoardWinner[]): {
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

  // Check tie (if all 9 cells are filled / decided and no winner)
  const isFull = cells.every((cell) => cell !== null);
  if (isFull) {
    return { winner: 'TIE', line: null };
  }

  return { winner: null, line: null };
}

export function createInitialGameState(): GameState {
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
    activeBoard: null, // first move can be anywhere
    currentPlayer: 'X',
    winner: null,
    winningLine: null,
    winningMiniLines,
    moves: [],
    isStarted: false,
    isGameOver: false,
  };
}

export class RoomManager {
  private rooms: Map<string, Room> = new Map();
  // Map socketId -> { roomCode, playerId, isSpectator }
  private socketLookup: Map<
    string,
    { roomCode: string; playerId: string; isSpectator: boolean }
  > = new Map();

  private generateCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  public createRoom(
    hostId: string,
    socketId: string,
    hostName: string,
    settings?: Partial<RoomSettings>
  ): Room {
    let code = this.generateCode();
    while (this.rooms.has(code)) {
      code = this.generateCode();
    }

    const hostPlayer: PlayerInfo = {
      id: hostId,
      socketId,
      name: hostName || 'Player X',
      symbol: 'X',
      isReady: true,
      connected: true,
      timeLeft: settings?.turnTimeLimit || 0,
    };

    const room: Room = {
      code,
      createdAt: Date.now(),
      hostId,
      players: {
        X: hostPlayer,
        O: null,
      },
      spectators: [],
      gameState: createInitialGameState(),
      settings: {
        turnTimeLimit: settings?.turnTimeLimit ?? 0,
        isPrivate: settings?.isPrivate ?? false,
        allowSpectators: settings?.allowSpectators ?? true,
      },
      rematchRequested: {
        X: false,
        O: false,
      },
    };

    this.rooms.set(code, room);
    this.socketLookup.set(socketId, {
      roomCode: code,
      playerId: hostId,
      isSpectator: false,
    });
    return room;
  }

  public joinRoom(
    code: string,
    userId: string,
    socketId: string,
    userName: string,
    asSpectator: boolean = false
  ): { success: boolean; room?: Room; error?: string; role?: 'X' | 'O' | 'SPECTATOR' } {
    const formattedCode = code.trim().toUpperCase();
    const room = this.rooms.get(formattedCode);

    if (!room) {
      return { success: false, error: 'Room not found. Please check the code.' };
    }

    // Check if player is reconnecting
    if (room.players.X && room.players.X.id === userId) {
      room.players.X.socketId = socketId;
      room.players.X.connected = true;
      if (userName) room.players.X.name = userName;
      this.socketLookup.set(socketId, {
        roomCode: formattedCode,
        playerId: userId,
        isSpectator: false,
      });
      return { success: true, room, role: 'X' };
    }

    if (room.players.O && room.players.O.id === userId) {
      room.players.O.socketId = socketId;
      room.players.O.connected = true;
      if (userName) room.players.O.name = userName;
      this.socketLookup.set(socketId, {
        roomCode: formattedCode,
        playerId: userId,
        isSpectator: false,
      });
      return { success: true, room, role: 'O' };
    }

    // If spectator requested or game full
    if (asSpectator || (room.players.X && room.players.O)) {
      if (!room.settings.allowSpectators) {
        return { success: false, error: 'This room does not allow spectators.' };
      }
      const existingSpecIndex = room.spectators.findIndex((s) => s.id === userId);
      if (existingSpecIndex !== -1) {
        room.spectators[existingSpecIndex].socketId = socketId;
      } else {
        const spectator: SpectatorInfo = {
          id: userId,
          socketId,
          name: userName || `Spectator ${room.spectators.length + 1}`,
        };
        room.spectators.push(spectator);
      }
      this.socketLookup.set(socketId, {
        roomCode: formattedCode,
        playerId: userId,
        isSpectator: true,
      });
      return { success: true, room, role: 'SPECTATOR' };
    }

    // Assign Player O
    if (!room.players.O) {
      const playerO: PlayerInfo = {
        id: userId,
        socketId,
        name: userName || 'Player O',
        symbol: 'O',
        isReady: true,
        connected: true,
        timeLeft: room.settings.turnTimeLimit,
      };
      room.players.O = playerO;
      room.gameState.isStarted = true; // both players ready
      this.socketLookup.set(socketId, {
        roomCode: formattedCode,
        playerId: userId,
        isSpectator: false,
      });
      return { success: true, room, role: 'O' };
    }

    // Fallback as Player X if host left before start
    if (!room.players.X) {
      const playerX: PlayerInfo = {
        id: userId,
        socketId,
        name: userName || 'Player X',
        symbol: 'X',
        isReady: true,
        connected: true,
        timeLeft: room.settings.turnTimeLimit,
      };
      room.players.X = playerX;
      this.socketLookup.set(socketId, {
        roomCode: formattedCode,
        playerId: userId,
        isSpectator: false,
      });
      return { success: true, room, role: 'X' };
    }

    return { success: false, error: 'Cannot join room.' };
  }

  public getRoom(code: string): Room | undefined {
    return this.rooms.get(code.toUpperCase());
  }

  public getSocketInfo(socketId: string) {
    return this.socketLookup.get(socketId);
  }

  public handleDisconnect(socketId: string): {
    room?: Room;
    disconnectedPlayer?: PlayerInfo | SpectatorInfo;
    role?: 'X' | 'O' | 'SPECTATOR';
  } {
    const lookup = this.socketLookup.get(socketId);
    if (!lookup) return {};

    const room = this.rooms.get(lookup.roomCode);
    if (!room) {
      this.socketLookup.delete(socketId);
      return {};
    }

    let role: 'X' | 'O' | 'SPECTATOR' = 'SPECTATOR';
    let disconnectedPlayer: PlayerInfo | SpectatorInfo | undefined;

    if (room.players.X && room.players.X.socketId === socketId) {
      room.players.X.connected = false;
      role = 'X';
      disconnectedPlayer = room.players.X;
    } else if (room.players.O && room.players.O.socketId === socketId) {
      room.players.O.connected = false;
      role = 'O';
      disconnectedPlayer = room.players.O;
    } else {
      room.spectators = room.spectators.filter((s) => s.socketId !== socketId);
      disconnectedPlayer = { id: lookup.playerId, socketId, name: 'Spectator' };
    }

    this.socketLookup.delete(socketId);

    // Clean up empty room if both players are disconnected and no spectators
    const bothDisconnected =
      (!room.players.X || !room.players.X.connected) &&
      (!room.players.O || !room.players.O.connected) &&
      room.spectators.length === 0;

    if (bothDisconnected) {
      // Give 5 minutes before deleting room or delete if brand new
      setTimeout(() => {
        const current = this.rooms.get(lookup.roomCode);
        if (
          current &&
          (!current.players.X || !current.players.X.connected) &&
          (!current.players.O || !current.players.O.connected) &&
          current.spectators.length === 0
        ) {
          this.rooms.delete(lookup.roomCode);
        }
      }, 5 * 60 * 1000);
    }

    return { room, disconnectedPlayer, role };
  }

  public makeMove(
    roomCode: string,
    userId: string,
    boardIndex: number,
    cellIndex: number
  ): { success: boolean; error?: string; room?: Room; move?: Move } {
    const room = this.rooms.get(roomCode.toUpperCase());
    if (!room) {
      return { success: false, error: 'Room not found' };
    }

    const { gameState, players } = room;

    if (gameState.isGameOver) {
      return { success: false, error: 'Game is already over' };
    }

    if (!gameState.isStarted || !players.X || !players.O) {
      return { success: false, error: 'Waiting for opponent to join' };
    }

    const currentTurn = gameState.currentPlayer;
    const activePlayerInfo = players[currentTurn];

    if (!activePlayerInfo || activePlayerInfo.id !== userId) {
      return { success: false, error: 'Not your turn' };
    }

    // Validate board index range
    if (boardIndex < 0 || boardIndex > 8 || cellIndex < 0 || cellIndex > 8) {
      return { success: false, error: 'Invalid move coordinates' };
    }

    // Validate active board constraint
    if (gameState.activeBoard !== null && gameState.activeBoard !== boardIndex) {
      const isConstraintBoardOpen =
        gameState.miniWinners[gameState.activeBoard] === null &&
        gameState.board[gameState.activeBoard].some((c) => c === null);

      if (isConstraintBoardOpen) {
        return {
          success: false,
          error: `Must play in board #${gameState.activeBoard + 1}`,
        };
      }
    }

    // Validate if the mini-board is already completed (won or tied)
    if (gameState.miniWinners[boardIndex] !== null) {
      return { success: false, error: 'That small board is already completed' };
    }

    // Validate cell emptiness
    if (gameState.board[boardIndex][cellIndex] !== null) {
      return { success: false, error: 'Cell is already occupied' };
    }

    // Apply move
    const newMove: Move = {
      boardIndex,
      cellIndex,
      player: currentTurn,
      timestamp: Date.now(),
    };

    gameState.board[boardIndex][cellIndex] = currentTurn;
    gameState.moves.push(newMove);

    // Check if this move wins the mini-board
    const miniResult = check3x3Winner(gameState.board[boardIndex]);
    if (miniResult.winner) {
      gameState.miniWinners[boardIndex] = miniResult.winner;
      gameState.winningMiniLines[boardIndex] = miniResult.line;

      // Check if this claims the macro board
      const macroResult = check3x3Winner(gameState.miniWinners);
      if (macroResult.winner) {
        gameState.winner = macroResult.winner;
        gameState.winningLine = macroResult.line;
        gameState.isGameOver = true;
      }
    }

    // Check if macro board is full / tie
    if (!gameState.isGameOver) {
      const allMiniCompleted = gameState.miniWinners.every((w) => w !== null);
      if (allMiniCompleted) {
        gameState.winner = 'TIE';
        gameState.isGameOver = true;
      }
    }

    // Calculate next active board:
    // If the mini-board at cellIndex is already won/tied or full, next active board is null (wildcard)
    if (!gameState.isGameOver) {
      const nextTargetBoardWinner = gameState.miniWinners[cellIndex];
      const isNextBoardFull = gameState.board[cellIndex].every((c) => c !== null);

      if (nextTargetBoardWinner !== null || isNextBoardFull) {
        gameState.activeBoard = null; // Free to choose any open board!
      } else {
        gameState.activeBoard = cellIndex;
      }

      // Switch turn
      gameState.currentPlayer = currentTurn === 'X' ? 'O' : 'X';
    }

    return { success: true, room, move: newMove };
  }

  public requestRematch(
    roomCode: string,
    userId: string
  ): { room?: Room; reset: boolean } {
    const room = this.rooms.get(roomCode.toUpperCase());
    if (!room) return { reset: false };

    let playerSymbol: PlayerSymbol | null = null;
    if (room.players.X && room.players.X.id === userId) playerSymbol = 'X';
    if (room.players.O && room.players.O.id === userId) playerSymbol = 'O';

    if (!playerSymbol) return { reset: false, room };

    room.rematchRequested[playerSymbol] = true;

    // If both players accepted rematch
    if (room.rematchRequested.X && room.rematchRequested.O) {
      room.gameState = createInitialGameState();
      room.gameState.isStarted = true;
      room.rematchRequested = { X: false, O: false };
      return { room, reset: true };
    }

    return { room, reset: false };
  }

  public resetRoomGame(roomCode: string): Room | null {
    const room = this.rooms.get(roomCode.toUpperCase());
    if (!room) return null;
    room.gameState = createInitialGameState();
    room.gameState.isStarted = !!(room.players.X && room.players.O);
    room.rematchRequested = { X: false, O: false };
    return room;
  }
}
