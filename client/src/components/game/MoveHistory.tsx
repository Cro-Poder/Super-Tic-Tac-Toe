import React from 'react';
import { Move } from '../../game/types.js';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, History } from 'lucide-react';

interface MoveHistoryProps {
  moves: Move[];
  isReplayMode: boolean;
  replayIndex: number | null;
  totalSteps: number;
  onStepReplay: (direction: 'first' | 'prev' | 'next' | 'last') => void;
  onJumpToStep: (stepIndex: number) => void;
  onExitReplay: () => void;
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({
  moves,
  isReplayMode,
  replayIndex,
  totalSteps,
  onStepReplay,
  onJumpToStep,
  onExitReplay,
}) => {
  const currentStep = replayIndex !== null ? replayIndex : totalSteps - 1;

  return (
    <div className="w-full max-w-[620px] mx-auto mt-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
      {/* Header & Replay Controls */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Move History {moves.length > 0 && `(${moves.length} moves)`}
          </h3>
        </div>

        {/* Step controls */}
        {totalSteps > 1 && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onStepReplay('first')}
              disabled={currentStep <= 0}
              aria-label="Jump to start"
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800/80 text-slate-300 text-xs transition"
            >
              <ChevronsLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onStepReplay('prev')}
              disabled={currentStep <= 0}
              aria-label="Previous step"
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800/80 text-slate-300 text-xs transition"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <span className="px-2 font-mono text-xs text-slate-400 font-semibold">
              {currentStep + 1} / {totalSteps}
            </span>

            <button
              type="button"
              onClick={() => onStepReplay('next')}
              disabled={currentStep >= totalSteps - 1}
              aria-label="Next step"
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800/80 text-slate-300 text-xs transition"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onStepReplay('last')}
              disabled={currentStep >= totalSteps - 1}
              aria-label="Jump to end"
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800/80 text-slate-300 text-xs transition"
            >
              <ChevronsRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Move Log list */}
      <div className="mt-3 max-h-36 overflow-y-auto pr-1 space-y-1.5 font-mono text-xs">
        {moves.length === 0 ? (
          <p className="text-slate-500 italic text-center py-2">
            No moves played yet. Click any cell to begin!
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-1.5">
            {moves.map((move, idx) => {
              const isSelected = currentStep === idx + 1;
              return (
                <button
                  type="button"
                  key={idx}
                  onClick={() => onJumpToStep(idx + 1)}
                  className={`
                    px-2.5 py-1.5 rounded-lg text-left flex items-center justify-between transition-all
                    ${
                      isSelected
                        ? 'bg-cyan-950/60 border border-cyan-500/80 text-cyan-300 shadow-sm'
                        : 'bg-slate-800/40 hover:bg-slate-800/80 text-slate-300 border border-slate-800'
                    }
                  `}
                >
                  <span className="text-slate-500 font-semibold">{idx + 1}.</span>
                  <span
                    className={`font-bold ${
                      move.player === 'X' ? 'text-cyan-400' : 'text-rose-400'
                    }`}
                  >
                    {move.player}
                  </span>
                  <span className="text-slate-300">{move.notation}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {isReplayMode && (
        <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-purple-400 font-medium animate-pulse">
            ● Replay Navigation Mode Active
          </span>
          <button
            type="button"
            onClick={onExitReplay}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 underline"
          >
            Return to Live Board
          </button>
        </div>
      )}
    </div>
  );
};
