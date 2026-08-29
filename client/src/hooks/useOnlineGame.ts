import { useState, useEffect, useCallback, useRef } from 'react';
import { getSocket } from '../services/socket.js';
import { getOrCreateUserId } from '../services/storage.js';
import {
  BoardWinner,
  GameSnapshot,
  Move,
  PlayerSymbol,
} from '../game/types.js';
import { createInitialState } from '../game/rules.js';
import { useAudio } from './useAudio.js';
import { fireVictoryConfetti } from '../utils/confetti.js';

export interface OnlinePlayer {
  id: string;
  name: string;
  symbol: PlayerSymbol;
  isReady: boolean;
  connected: boolean;
  timeLeft?: number;
}

export interface EmoteItem {
  id: string;
  senderId: string;
  senderName: string;
  senderSymbol?: PlayerSymbol | 'SPECTATOR';
  content: string;
  type: 'emoji' | 'text';
  timestamp: number;
}

export function useOnlineGame(userName: string, onMatchOver?: (winner: BoardWinner, userSymbol: 'X' | 'O') => void) {
  const [isConnected, setIsConnected] = useState(false);
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [myRole, setMyRole] = useState<'X' | 'O' | 'SPECTATOR' | null>(null);
  const [players, setPlayers] = useState<{ X: OnlinePlayer | null; O: OnlinePlayer | null }>({
    X: null,
    O: null,
  });
  const [spectatorsCount, setSpectatorsCount] = useState(0);
  const [gameState, setGameState] = useState<GameSnapshot>(createInitialState);
  const [rematchStatus, setRematchStatus] = useState<{ X: boolean; O: boolean }>({
    X: false,
    O: false,
  });
  const [emotes, setEmotes] = useState<EmoteItem[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [ping, setPing] = useState<number>(0);

  const audio = useAudio();
  const userId = getOrCreateUserId();
  const socket = getSocket();

  useEffect(() => {
    socket.connect();

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onRoomCreated(data: any) {
      if (data.success) {
        setRoomCode(data.room.code);
        setMyRole(data.role);
        setPlayers(data.room.players);
        setGameState(data.room.gameState);
        setRematchStatus(data.room.rematchRequested);
        setErrorMsg(null);
      }
    }

    function onRoomJoined(data: any) {
      if (data.success) {
        setRoomCode(data.room.code);
        setMyRole(data.role);
        setPlayers(data.room.players);
        setGameState(data.room.gameState);
        setSpectatorsCount(data.room.spectators?.length || 0);
        setRematchStatus(data.room.rematchRequested);
        setErrorMsg(null);
      }
    }

    function onRoomUpdated(data: any) {
      if (data.room) {
        setPlayers(data.room.players);
        setGameState(data.room.gameState);
        setSpectatorsCount(data.room.spectators?.length || 0);
        setRematchStatus(data.room.rematchRequested);
      }
    }

    function onMoveMade(data: { move: Move; gameState: GameSnapshot }) {
      setGameState(data.gameState);
      if (data.move) {
        audio.playMove(data.move.player);
        if (data.gameState.miniWinners[data.move.boardIndex] === data.move.player) {
          audio.playMiniBoardWin(data.move.player);
        }
      }
    }

    function onGameOver(data: { winner: BoardWinner; winningLine: number[]; gameState: GameSnapshot }) {
      setGameState(data.gameState);
      if (data.winner) {
        audio.playVictory();
        fireVictoryConfetti();
      }
      if (myRole === 'X' || myRole === 'O') {
        onMatchOver?.(data.winner, myRole);
      }
    }

    function onRematchRequested(data: { userId: string; rematchStatus: { X: boolean; O: boolean } }) {
      setRematchStatus(data.rematchStatus);
    }

    function onRematchStarted(data: { room: any; message: string }) {
      setGameState(data.room.gameState);
      setRematchStatus({ X: false, O: false });
    }

    function onEmoteReceived(msg: any) {
      audio.playEmote();
      setEmotes((prev) => [...prev.slice(-15), { ...msg, id: Math.random().toString() }]);
    }

    function onJoinError(err: { error: string }) {
      setErrorMsg(err.error || 'Failed to join room');
      audio.playError();
    }

    function onMoveError(err: { error: string }) {
      setErrorMsg(err.error || 'Invalid move');
      audio.playError();
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('room_created', onRoomCreated);
    socket.on('room_joined', onRoomJoined);
    socket.on('room_updated', onRoomUpdated);
    socket.on('move_made', onMoveMade);
    socket.on('game_over', onGameOver);
    socket.on('rematch_requested', onRematchRequested);
    socket.on('rematch_started', onRematchStarted);
    socket.on('emote_received', onEmoteReceived);
    socket.on('join_error', onJoinError);
    socket.on('move_error', onMoveError);

    // Heartbeat ping measurement
    const pingInterval = setInterval(() => {
      const start = Date.now();
      socket.emit('ping', () => {
        setPing(Date.now() - start);
      });
    }, 10000);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('room_created', onRoomCreated);
      socket.off('room_joined', onRoomJoined);
      socket.off('room_updated', onRoomUpdated);
      socket.off('move_made', onMoveMade);
      socket.off('game_over', onGameOver);
      socket.off('rematch_requested', onRematchRequested);
      socket.off('rematch_started', onRematchStarted);
      socket.off('emote_received', onEmoteReceived);
      socket.off('join_error', onJoinError);
      socket.off('move_error', onMoveError);
      clearInterval(pingInterval);
    };
  }, [socket, myRole, audio, onMatchOver]);

  const createRoom = useCallback(
    (settings?: any) => {
      setErrorMsg(null);
      socket.emit('create_room', {
        userId,
        userName: userName || 'Player 1',
        settings,
      });
    },
    [socket, userId, userName]
  );

  const joinRoom = useCallback(
    (code: string, asSpectator: boolean = false) => {
      setErrorMsg(null);
      socket.emit('join_room', {
        roomCode: code.toUpperCase(),
        userId,
        userName: userName || 'Player 2',
        asSpectator,
      });
    },
    [socket, userId, userName]
  );

  const makeMove = useCallback(
    (boardIndex: number, cellIndex: number) => {
      if (!roomCode || !myRole || myRole === 'SPECTATOR') return false;
      if (gameState.currentPlayer !== myRole || gameState.isGameOver) {
        audio.playError();
        return false;
      }

      socket.emit('make_move', {
        roomCode,
        userId,
        boardIndex,
        cellIndex,
      });
      return true;
    },
    [socket, roomCode, myRole, userId, gameState, audio]
  );

  const requestRematch = useCallback(() => {
    if (!roomCode) return;
    socket.emit('request_rematch', { roomCode, userId });
  }, [socket, roomCode, userId]);

  const sendEmote = useCallback(
    (content: string, type: 'emoji' | 'text' = 'emoji') => {
      if (!roomCode) return;
      socket.emit('send_emote', {
        roomCode,
        userId,
        userName,
        content,
        type,
      });
    },
    [socket, roomCode, userId, userName]
  );

  const leaveRoom = useCallback(() => {
    if (roomCode) {
      socket.emit('leave_room', { roomCode });
    }
    setRoomCode(null);
    setMyRole(null);
    setGameState(createInitialState());
    setPlayers({ X: null, O: null });
    setEmotes([]);
    setErrorMsg(null);
  }, [socket, roomCode]);

  return {
    isConnected,
    roomCode,
    myRole,
    players,
    spectatorsCount,
    gameState,
    rematchStatus,
    emotes,
    errorMsg,
    ping,
    createRoom,
    joinRoom,
    makeMove,
    requestRematch,
    sendEmote,
    leaveRoom,
    isMyTurn: myRole ? gameState.currentPlayer === myRole : false,
  };
}
