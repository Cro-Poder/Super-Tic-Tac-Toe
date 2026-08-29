import React from 'react';
import { CellValue, PlayerSymbol } from '../../game/types.js';

interface CellProps {
  value: CellValue;
  boardIndex: number;
  cellIndex: number;
  isValidMove: boolean;
  isLastMove: boolean;
  isSuggested: boolean;
  disabled: boolean;
  turn: PlayerSymbol;
  onClick: () => void;
}

export const Cell: React.FC<CellProps> = ({
  value,
  boardIndex,
  cellIndex,
  isValidMove,
  isLastMove,
  isSuggested,
  disabled,
  turn,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || value !== null}
      aria-label={`Board ${boardIndex + 1} Cell ${cellIndex + 1} ${value ? `occupied by ${value}` : 'empty'}`}
      className={`
        relative aspect-square w-full rounded-md flex items-center justify-center
        transition-all duration-150 group outline-none focus-visible:ring-2 focus-visible:ring-amber-400
        ${
          value === null
            ? isValidMove && !disabled
              ? 'bg-slate-800/40 hover:bg-slate-700/60 cursor-pointer border border-slate-700/50 hover:border-amber-400/60'
              : 'bg-slate-900/30 border border-slate-800/30 cursor-not-allowed opacity-60'
            : 'bg-slate-800/60 border border-slate-700/40 cursor-default'
        }
        ${isLastMove ? 'ring-2 ring-amber-400/80 shadow-md shadow-amber-400/20' : ''}
        ${isSuggested ? 'ring-2 ring-emerald-400 animate-pulse bg-emerald-950/30' : ''}
      `}
    >
      {/* If occupied by X */}
      {value === 'X' && (
        <svg
          viewBox="0 0 24 24"
          className="w-4/5 h-4/5 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" className="animate-draw-line" />
          <line x1="6" y1="6" x2="18" y2="18" className="animate-draw-line" />
        </svg>
      )}

      {/* If occupied by O */}
      {value === 'O' && (
        <svg
          viewBox="0 0 24 24"
          className="w-4/5 h-4/5 text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="8" className="animate-draw-line" />
        </svg>
      )}

      {/* Hover preview ghost symbol when valid */}
      {value === null && isValidMove && !disabled && (
        <div className="opacity-0 group-hover:opacity-40 transition-opacity duration-150">
          {turn === 'X' ? (
            <svg
              viewBox="0 0 24 24"
              className="w-3/5 h-3/5 text-cyan-300"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              className="w-3/5 h-3/5 text-rose-300"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <circle cx="12" cy="12" r="8" />
            </svg>
          )}
        </div>
      )}
    </button>
  );
};
