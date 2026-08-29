import React from 'react';
import { AIDifficulty, GameMode, PlayerSymbol } from '../../game/types.js';
import { BOARD_NAMES } from '../../game/constants.js';
import { Volume2, VolumeX, Music, Bot, User, Sparkles, Loader2 } from 'lucide-react';

interface GameHeaderProps {
  currentPlayer: PlayerSymbol;
  activeBoard: number | null;
  mode: GameMode;
  aiDifficulty?: AIDifficulty;
  isAiThinking?: boolean;
  soundEnabled: boolean;
  musicEnabled: boolean;
  playerXName?: string;
  playerOName?: string;
  onToggleSound: () => void;
  onToggleMusic: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  currentPlayer,
  activeBoard,
  mode,
  aiDifficulty,
  isAiThinking = false,
  soundEnabled,
  musicEnabled,
  playerXName = 'Player X',
  playerOName = 'Player O',
  onToggleSound,
  onToggleMusic,
}) => {
  const isWildcard = activeBoard === null;

  return (
    <div className="w-full max-w-[620px] mx-auto mb-4 flex flex-col gap-3">
      {/* Top Bar with Mode Badge & Sound Toggles */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-slate-800 border border-slate-700 text-slate-300 flex items-center gap-1.5 shadow-sm">
            {mode === 'pvc' ? (
              <>
                <Bot className="w-3.5 h-3.5 text-cyan-400" />
                <span>VS AI ({aiDifficulty})</span>
              </>
            ) : mode === 'pvp-online' ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Online Match</span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>Pass & Play</span>
              </>
            )}
          </span>
        </div>

        {/* Audio Quick Toggles */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onToggleSound}
            aria-label="Toggle Sound"
            className={`p-2 rounded-lg border transition-all ${
              soundEnabled
                ? 'bg-slate-800/80 border-slate-700 text-slate-200 hover:text-white'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={onToggleMusic}
            aria-label="Toggle Ambient Music"
            className={`p-2 rounded-lg border transition-all ${
              musicEnabled
                ? 'bg-purple-950/60 border-purple-700/60 text-purple-300 hover:text-purple-100 shadow-sm shadow-purple-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            <Music className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Turn Indicator Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Player X Banner */}
        <div
          className={`
            p-3 rounded-2xl border transition-all duration-300 flex items-center justify-between
            ${
              currentPlayer === 'X'
                ? 'bg-cyan-950/40 border-cyan-500/80 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/50'
                : 'bg-slate-900/50 border-slate-800/80 opacity-60'
            }
          `}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center font-black text-cyan-400 font-mono">
              X
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-300 truncate max-w-[100px] sm:max-w-[130px]">
                {playerXName}
              </p>
              <p className="text-[10px] text-cyan-400 font-medium">
                {currentPlayer === 'X' ? 'Playing now' : 'Waiting'}
              </p>
            </div>
          </div>
          {currentPlayer === 'X' && (
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-sm shadow-cyan-400" />
          )}
        </div>

        {/* Player O Banner */}
        <div
          className={`
            p-3 rounded-2xl border transition-all duration-300 flex items-center justify-between
            ${
              currentPlayer === 'O'
                ? 'bg-rose-950/40 border-rose-500/80 shadow-lg shadow-rose-500/10 ring-1 ring-rose-500/50'
                : 'bg-slate-900/50 border-slate-800/80 opacity-60'
            }
          `}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center font-black text-rose-400 font-mono">
              O
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-300 truncate max-w-[100px] sm:max-w-[130px]">
                {playerOName}
              </p>
              <p className="text-[10px] text-rose-400 font-medium flex items-center gap-1">
                {isAiThinking ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Thinking...</span>
                  </>
                ) : currentPlayer === 'O' ? (
                  'Playing now'
                ) : (
                  'Waiting'
                )}
              </p>
            </div>
          </div>
          {currentPlayer === 'O' && (
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-pulse shadow-sm shadow-rose-400" />
          )}
        </div>
      </div>

      {/* Target Board Notification Banner */}
      <div
        className={`
          px-3.5 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-all
          ${
            isWildcard
              ? 'bg-amber-950/40 border border-amber-500/50 text-amber-300 shadow-sm shadow-amber-500/10'
              : 'bg-slate-800/60 border border-slate-700/60 text-slate-300'
          }
        `}
      >
        <div className="flex items-center gap-2">
          {isWildcard ? (
            <>
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              <span>
                <strong>Free Move (Wildcard):</strong> Target board is full or won. Pick any open board!
              </span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>
                Target Constraint: <strong>Board #{activeBoard + 1} ({BOARD_NAMES[activeBoard]})</strong>
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
