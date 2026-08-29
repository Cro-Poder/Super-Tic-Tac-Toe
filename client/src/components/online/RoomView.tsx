import React, { useState } from 'react';
import { Copy, Check, Users, Eye, LogOut, MessageSquare } from 'lucide-react';
import { OnlinePlayer, EmoteItem } from '../../hooks/useOnlineGame.js';

interface RoomViewProps {
  roomCode: string;
  myRole: 'X' | 'O' | 'SPECTATOR' | null;
  players: { X: OnlinePlayer | null; O: OnlinePlayer | null };
  spectatorsCount: number;
  emotes: EmoteItem[];
  rematchStatus: { X: boolean; O: boolean };
  isGameOver: boolean;
  onSendEmote: (content: string, type?: 'emoji' | 'text') => void;
  onRequestRematch: () => void;
  onLeaveRoom: () => void;
}

const EMOJI_LIST = ['🔥', '🤯', '👏', '💀', '⚡', '🎯', '🤔', '🏆', '🎉', '😱'];

export const RoomView: React.FC<RoomViewProps> = ({
  roomCode,
  myRole,
  players,
  spectatorsCount,
  emotes,
  rematchStatus,
  isGameOver,
  onSendEmote,
  onRequestRematch,
  onLeaveRoom,
}) => {
  const [copied, setCopied] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const copyRoomLink = () => {
    const url = `${window.location.origin}?room=${roomCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (customMsg.trim()) {
      onSendEmote(customMsg.trim(), 'text');
      setCustomMsg('');
    }
  };

  return (
    <div className="w-full max-w-[620px] mx-auto mb-4 flex flex-col gap-2.5">
      {/* Room Top Header Bar */}
      <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold">Room Code:</span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-cyan-300 font-mono font-bold text-sm tracking-wider border border-slate-700">
            {roomCode}
          </span>
          <button
            type="button"
            onClick={copyRoomLink}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition flex items-center gap-1"
            title="Copy Invite Link"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Share Link'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {spectatorsCount > 0 && (
            <div className="flex items-center gap-1 text-xs text-purple-400 bg-purple-950/40 border border-purple-800/60 px-2 py-1 rounded-lg font-medium">
              <Eye className="w-3.5 h-3.5" />
              <span>{spectatorsCount}</span>
            </div>
          )}

          <span className="text-xs font-bold px-2 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
            Role: <strong className="text-cyan-400">{myRole || 'Guest'}</strong>
          </span>

          <button
            type="button"
            onClick={onLeaveRoom}
            className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 text-xs transition flex items-center gap-1"
            title="Leave Room"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Leave</span>
          </button>
        </div>
      </div>

      {/* Quick Reaction Emote Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-2 rounded-xl bg-slate-900/70 border border-slate-800/80">
        <span className="text-[10px] text-slate-500 font-bold uppercase mr-1 flex-shrink-0">
          React:
        </span>
        {EMOJI_LIST.map((emoji, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSendEmote(emoji, 'emoji')}
            className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 hover:scale-110 active:scale-95 text-base transition-all flex-shrink-0"
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Floating Emote Stream Display */}
      {emotes.length > 0 && (
        <div className="flex flex-wrap gap-2 max-h-16 overflow-y-auto px-1 py-0.5">
          {emotes.slice(-4).map((e) => (
            <div
              key={e.id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-xs text-slate-200 shadow-md animate-fadeIn"
            >
              <span className="text-[10px] text-cyan-400 font-semibold">{e.senderName}:</span>
              <span className="font-medium">{e.content}</span>
            </div>
          ))}
        </div>
      )}

      {/* Rematch Status Bar if Game is Over */}
      {isGameOver && (myRole === 'X' || myRole === 'O') && (
        <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-700/60 flex items-center justify-between">
          <div className="text-xs text-slate-300">
            Rematch votes:{' '}
            <span className={rematchStatus.X ? 'text-cyan-400 font-bold' : 'text-slate-500'}>
              Player X {rematchStatus.X ? '✓' : '...'}
            </span>{' '}
            |{' '}
            <span className={rematchStatus.O ? 'text-rose-400 font-bold' : 'text-slate-500'}>
              Player O {rematchStatus.O ? '✓' : '...'}
            </span>
          </div>
          <button
            type="button"
            onClick={onRequestRematch}
            className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-bold shadow-md transition active:scale-95"
          >
            {myRole && rematchStatus[myRole] ? 'Waiting for opponent...' : 'Vote Rematch'}
          </button>
        </div>
      )}
    </div>
  );
};
