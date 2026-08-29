import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { RoomManager } from './roomManager.js';
import { EmoteMessage, RoomSettings } from './types.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Allow wildcard or comma-separated origins from CLIENT_URL
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((u) => u.trim()).filter(Boolean)
  : ['*'];

app.use(
  cors({
    origin: (origin, callback) => {
      // In production and dev, allow all requests or validate against allowedOrigins
      if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive fallback to prevent breaking cross-domain deployments
      }
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
  })
);

app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  pingInterval: 10000,
  pingTimeout: 5000,
});

const roomManager = new RoomManager();

// REST Health Check & Info Endpoints
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get('/api/rooms/:code', (req, res) => {
  const room = roomManager.getRoom(req.params.code);
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  res.json({
    code: room.code,
    players: {
      X: room.players.X ? { name: room.players.X.name, connected: room.players.X.connected } : null,
      O: room.players.O ? { name: room.players.O.name, connected: room.players.O.connected } : null,
    },
    spectatorsCount: room.spectators.length,
    isStarted: room.gameState.isStarted,
    isGameOver: room.gameState.isGameOver,
  });
});

// Socket.io Game Events
io.on('connection', (socket: Socket) => {
  console.log(`[Socket Connected] ID: ${socket.id}`);

  // Create Room
  socket.on(
    'create_room',
    (
      payload: {
        userId: string;
        userName: string;
        settings?: Partial<RoomSettings>;
      },
      callback?: (response: any) => void
    ) => {
      try {
        const { userId, userName, settings } = payload;
        const room = roomManager.createRoom(userId, socket.id, userName, settings);
        socket.join(room.code);

        console.log(`[Room Created] Code: ${room.code} by ${userName} (${userId})`);

        const response = {
          success: true,
          room,
          role: 'X' as const,
          roomCode: room.code,
        };

        if (callback) callback(response);
        socket.emit('room_created', response);
      } catch (err: any) {
        console.error('Error creating room:', err);
        if (callback) callback({ success: false, error: err.message });
      }
    }
  );

  // Join Room
  socket.on(
    'join_room',
    (
      payload: {
        roomCode: string;
        userId: string;
        userName: string;
        asSpectator?: boolean;
      },
      callback?: (response: any) => void
    ) => {
      try {
        const { roomCode, userId, userName, asSpectator } = payload;
        const result = roomManager.joinRoom(
          roomCode,
          userId,
          socket.id,
          userName,
          asSpectator
        );

        if (!result.success || !result.room) {
          if (callback) callback({ success: false, error: result.error });
          socket.emit('join_error', { error: result.error });
          return;
        }

        socket.join(result.room.code);
        console.log(
          `[Player Joined] Code: ${result.room.code}, User: ${userName} as ${result.role}`
        );

        const response = {
          success: true,
          room: result.room,
          role: result.role,
        };

        if (callback) callback(response);
        socket.emit('room_joined', response);

        // Notify room members
        io.to(result.room.code).emit('room_updated', {
          room: result.room,
          message: `${userName} joined as ${result.role}`,
        });
      } catch (err: any) {
        console.error('Error joining room:', err);
        if (callback) callback({ success: false, error: err.message });
      }
    }
  );

  // Make Move
  socket.on(
    'make_move',
    (
      payload: {
        roomCode: string;
        userId: string;
        boardIndex: number;
        cellIndex: number;
      },
      callback?: (response: any) => void
    ) => {
      try {
        const { roomCode, userId, boardIndex, cellIndex } = payload;
        const result = roomManager.makeMove(roomCode, userId, boardIndex, cellIndex);

        if (!result.success || !result.room) {
          if (callback) callback({ success: false, error: result.error });
          socket.emit('move_error', { error: result.error });
          return;
        }

        if (callback) callback({ success: true, move: result.move });

        // Broadcast move and updated state to the entire room
        io.to(result.room.code).emit('move_made', {
          move: result.move,
          gameState: result.room.gameState,
        });

        if (result.room.gameState.isGameOver) {
          io.to(result.room.code).emit('game_over', {
            winner: result.room.gameState.winner,
            winningLine: result.room.gameState.winningLine,
            gameState: result.room.gameState,
          });
        }
      } catch (err: any) {
        console.error('Error handling move:', err);
        if (callback) callback({ success: false, error: err.message });
      }
    }
  );

  // Request Rematch
  socket.on(
    'request_rematch',
    (
      payload: { roomCode: string; userId: string },
      callback?: (response: any) => void
    ) => {
      const { roomCode, userId } = payload;
      const { room, reset } = roomManager.requestRematch(roomCode, userId);

      if (room) {
        if (reset) {
          io.to(room.code).emit('rematch_started', {
            room,
            message: 'Both players accepted! Starting new game...',
          });
        } else {
          io.to(room.code).emit('rematch_requested', {
            userId,
            rematchStatus: room.rematchRequested,
          });
        }
        if (callback) callback({ success: true, reset });
      }
    }
  );

  // Send Emote / Chat message
  socket.on(
    'send_emote',
    (payload: {
      roomCode: string;
      userId: string;
      userName: string;
      content: string;
      type?: 'emoji' | 'text';
    }) => {
      const { roomCode, userId, userName, content, type = 'emoji' } = payload;
      const room = roomManager.getRoom(roomCode);
      if (!room) return;

      let senderSymbol: 'X' | 'O' | 'SPECTATOR' = 'SPECTATOR';
      if (room.players.X && room.players.X.id === userId) senderSymbol = 'X';
      if (room.players.O && room.players.O.id === userId) senderSymbol = 'O';

      const emoteMessage: EmoteMessage = {
        senderId: userId,
        senderName: userName,
        senderSymbol,
        type,
        content: content.slice(0, 100), // sanitize length
        timestamp: Date.now(),
      };

      io.to(room.code).emit('emote_received', emoteMessage);
    }
  );

  // Leave Room explicitly
  socket.on('leave_room', (payload: { roomCode: string }) => {
    const { roomCode } = payload;
    socket.leave(roomCode);
    const { room, disconnectedPlayer, role } = roomManager.handleDisconnect(socket.id);
    if (room && disconnectedPlayer) {
      io.to(room.code).emit('player_left', {
        player: disconnectedPlayer,
        role,
        room,
      });
    }
  });

  // Ping heartbeat responder
  socket.on('ping', (callback?: () => void) => {
    if (typeof callback === 'function') {
      callback();
    }
  });

  // Handle Disconnect
  socket.on('disconnect', () => {
    console.log(`[Socket Disconnected] ID: ${socket.id}`);
    const { room, disconnectedPlayer, role } = roomManager.handleDisconnect(socket.id);
    if (room && disconnectedPlayer) {
      io.to(room.code).emit('player_disconnected', {
        player: disconnectedPlayer,
        role,
        room,
      });
    }
  });
});

// Process error and termination handlers for graceful Render shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

server.listen(PORT, () => {
  console.log(`===========================================`);
  console.log(`🚀 Super Tic-Tac-Toe Game Server Active`);
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌐 Health endpoint: http://localhost:${PORT}/api/health`);
  console.log(`===========================================`);
});
