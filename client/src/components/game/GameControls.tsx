import React from 'react';
import { RotateCcw, Lightbulb, RefreshCw, Flag, Share2, Eye } from 'lucide-react';
import { GameMode } from '../../game/types.js';

interface GameControlsProps {
  mode: GameMode;
  canUndo: boolean;
  isAiThinking?: boolean;
  isGameOver: boolean;
  isReplayMode?: boolean;
  onUndo: () => void;
  onReset: () => void;
  onHint: () => void;
  onForfeit?: () => void;
  onEnterReplay?: () => void;
  onShare?: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  mode,
  canUndo,
  isAiThinking = false,
  isGameOver,
  isReplayMode = false,
  onUndo,
  onReset,
  onHint,
  onForfeit,
  onEnterReplay,
  onShare,
}) => {
  return (
    <div className="w-full max-w-[620px] mx-auto mt-4 flex items-center justify-between gap-2 px-1">
      <div className="flex items-center gap-2">
        {/* Undo button (disabled in online multiplayer) */}
        {mode !== 'pvp-online' && (
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo || isAiThinking || isGameOver || isReplayMode}
            className={`
              px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all
              ${
                canUndo && !isAiThinking && !isGameOver && !isReplayMode
                  ? 'bg-slate-800/80 border-slate-700 hover:bg-slate-700 text-slate-200 shadow-sm active:scale-95'
                  : 'bg-slate-900/50 border-slate-800/50 text-slate-600 cursor-not-allowed'
              }
            `}
            title="Undo move"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Undo</span>
          </button>
        )}

        {/* AI Hint Assistant */}
        {mode !== 'pvp-online' && !isGameOver && !isReplayMode && (
          <button
            type="button"
            onClick={onHint}
            disabled={isAiThinking}
            className="px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-700/60 hover:bg-emerald-900/50 text-emerald-300 transition-all shadow-sm active:scale-95"
            title="Get tactical move recommendation"
          >
            <Lightbulb className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Hint</span>
          </button>
        )}

        {/* Replay Viewer Trigger */}
        {isGameOver && !isReplayMode && onEnterReplay && (
          <button
            type="button"
            onClick={onEnterReplay}
            className="px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-purple-950/50 border border-purple-700/60 hover:bg-purple-900/50 text-purple-300 transition-all shadow-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Review Game</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Share Button if available */}
        {onShare && (
          <button
            type="button"
            onClick={onShare}
            className="px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-slate-800/80 border border-slate-700 hover:bg-slate-700 text-slate-200 transition-all"
            title="Share Game"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Reset / Rematch */}
        <button
          type="button"
          onClick={onReset}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-cyan-950/40 border border-cyan-700/60 hover:bg-cyan-900/50 text-cyan-300 transition-all shadow-sm active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{isGameOver ? 'New Game' : 'Restart'}</span>
        </button>
      </div>
    </div>
  );
};
