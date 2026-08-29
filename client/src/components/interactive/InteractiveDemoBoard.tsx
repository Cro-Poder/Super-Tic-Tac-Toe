import React, { useState } from 'react';
import { GameSnapshot } from '../../game/types.js';
import { applyMove, createInitialState, isMoveValid } from '../../game/rules.js';
import { SuperBoard } from '../game/SuperBoard.js';
import { RefreshCw, Info } from 'lucide-react';

interface InteractiveDemoBoardProps {
  initialSetup?: (state: GameSnapshot) => GameSnapshot;
  description: string;
  tip?: string;
}

export const InteractiveDemoBoard: React.FC<InteractiveDemoBoardProps> = ({
  initialSetup,
  description,
  tip,
}) => {
  const [state, setState] = useState<GameSnapshot>(() => {
    const init = createInitialState();
    return initialSetup ? initialSetup(init) : init;
  });

  const handleCellClick = (boardIndex: number, cellIndex: number) => {
    if (isMoveValid(state, boardIndex, cellIndex)) {
      const next = applyMove(state, boardIndex, cellIndex);
      setState(next);
    }
  };

  const handleReset = () => {
    const fresh = createInitialState();
    setState(initialSetup ? initialSetup(fresh) : fresh);
  };

  return (
    <div className="w-full my-6 p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
      {/* Description header */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-200 leading-relaxed">
            {description}
          </p>
          {tip && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-400 font-medium">
              <Info className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{tip}</span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition flex items-center gap-1 text-xs font-semibold"
          title="Reset Interactive Scenario"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Embedded SuperBoard */}
      <div className="max-w-[420px] mx-auto">
        <SuperBoard
          gameState={state}
          suggestedMove={null}
          showCoordinates={true}
          onCellClick={handleCellClick}
        />
      </div>
    </div>
  );
};
