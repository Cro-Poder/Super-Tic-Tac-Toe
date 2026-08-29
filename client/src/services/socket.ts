import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocketUrl(): string {
  // 1. Allow runtime query override (?server=http://...)
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const queryServer = params.get('server');
    if (queryServer) {
      return queryServer.replace(/\/$/, '');
    }
  }

  // 2. Vite Build-time Environment Variable
  const envUrl = (import.meta as any).env?.VITE_SERVER_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    let formatted = envUrl.trim().replace(/\/$/, '');
    if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
      formatted = `https://${formatted}`;
    }
    return formatted;
  }

  // 3. Local development fallback
  if (typeof window !== 'undefined') {
    if (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname.startsWith('192.168.')
    ) {
      return 'http://localhost:5000';
    }

    // 4. Production on same-origin or Render fallback
    return window.location.origin;
  }

  return 'http://localhost:5000';
}

export function getSocket(): Socket {
  if (!socket) {
    const url = getSocketUrl();
    console.log(`[Socket] Initializing connection to: ${url}`);
    socket = io(url, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 15,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      transports: ['websocket', 'polling'], // Prioritize WebSocket with polling fallback
    });
  }
  return socket;
}

