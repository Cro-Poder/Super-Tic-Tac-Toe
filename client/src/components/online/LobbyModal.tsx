import React, { useState } from 'react';
import { Users, Plus, ArrowRight, ShieldCheck, Clock, Eye, AlertCircle } from 'lucide-react';

interface LobbyModalProps {
  onCreateRoom: (settings: { turnTimeLimit: number; allowSpectators: boolean }) => void;
  onJoinRoom: (code: string, asSpectator: boolean) => void;
  errorMsg: string | null;
  onClose: () => void;
}

export const LobbyModal: React.FC<LobbyModalProps> = ({
  onCreateRoom,
  onJoinRoom,
  errorMsg,
  onClose,
}) => {
  const [tab, setTab] = useState<'create' | 'join'>('create');
  const [joinCode, setJoinCode] = useState('');
  const [turnTimer, setTurnTimer] = useState<number>(0);
  const [allowSpectators, setAllowSpectators] = useState(true);
  const [asSpectator, setAsSpectator] = useState(false);

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (joinCode.trim().length >= 4) {
      onJoinRoom(joinCode.trim().toUpperCase(), asSpectator);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl text-left">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display">
                Online Multiplayer
              </h2>
              <p className="text-xs text-slate-400">
                Play live with friends or spectate matches
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1"
          >
            ✕
          </button>
        </div>

        {/* Error notification if any */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/50 border border-rose-700/60 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Tab switcher */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-800/80 rounded-xl mb-5 border border-slate-700">
          <button
            type="button"
            onClick={() => setTab('create')}
            className={`py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              tab === 'create'
                ? 'bg-cyan-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Room</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('join')}
            className={`py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              tab === 'join'
                ? 'bg-cyan-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>Join Room</span>
          </button>
        </div>

        {/* Create Room Tab Content */}
        {tab === 'create' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Turn Timer</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'None', val: 0 },
                  { label: '15s', val: 15 },
                  { label: '30s', val: 30 },
                  { label: '60s', val: 60 },
                ].map((t) => (
                  <button
                    key={t.val}
                    type="button"
                    onClick={() => setTurnTimer(t.val)}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      turnTimer === t.val
                        ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300 shadow-sm'
                        : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-purple-400" />
                <div>
                  <p className="text-xs font-semibold text-slate-200">
                    Allow Spectators
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Let others watch the game via link
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={allowSpectators}
                onChange={(e) => setAllowSpectators(e.target.checked)}
                className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
              />
            </div>

            <button
              type="button"
              onClick={() =>
                onCreateRoom({ turnTimeLimit: turnTimer, allowSpectators })
              }
              className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition flex items-center justify-center gap-2 active:scale-98"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Create Game Room</span>
            </button>
          </div>
        )}

        {/* Join Room Tab Content */}
        {tab === 'join' && (
          <form onSubmit={handleJoinSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Room Code (6 Characters)
              </label>
              <input
                type="text"
                maxLength={8}
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="e.g. A9B2X7"
                className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-center font-mono text-lg font-bold tracking-widest text-cyan-300 uppercase focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-semibold text-slate-200">
                  Join as Spectator only
                </span>
              </div>
              <input
                type="checkbox"
                checked={asSpectator}
                onChange={(e) => setAsSpectator(e.target.checked)}
                className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
              />
            </div>

            <button
              type="submit"
              disabled={joinCode.trim().length < 4}
              className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white shadow-lg shadow-cyan-500/25 transition flex items-center justify-center gap-2 active:scale-98"
            >
              <ArrowRight className="w-4 h-4" />
              <span>Join Room</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
