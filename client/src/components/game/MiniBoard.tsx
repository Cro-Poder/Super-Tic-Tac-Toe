import React from 'react';
import { BoardWinner, MiniBoardState, PlayerSymbol } from '../../game/types.js';
import { Cell } from './Cell.js';

interface MiniBoardProps {
  boardIndex: number;
  cells: MiniBoardState;
  winner: BoardWinner;
  winningLine: number[] | null;
  isActive: boolean;
  isWildcard: boolean;
  lastMove: { boardIndex: number; cellIndex: number } | null;
  suggestedMove: { boardIndex: number; cellIndex: number } | null;
  currentPlayer: PlayerSymbol;
  isGameOver: boolean;
  showCoordinates: boolean;
  onCellClick: (boardIndex: number, cellIndex: number) => void;
}

export const MiniBoard: React.FC<MiniBoardProps> = ({
  boardIndex,
  cells,
  winner,
  winningLine,
  isActive,
  isWildcard,
  lastMove,
  suggestedMove,
  currentPlayer,
  isGameOver,
  showCoordinates,
  onCellClick,
}) => {
  const isWon = winner !== null;
  const shouldHighlightActive = (isActive || isWildcard) && !isWon && !isGameOver;

  return (
    <div
      className={`
        relative p-2 rounded-xl transition-all duration-300 flex flex-col justify-center items-center
        ${
          shouldHighlightActive
            ? 'active-board-glow bg-amber-500/10 border-2 border-amber-400/90'
            : isWon
            ? 'bg-slate-900/80 border border-slate-700/60'
            : 'bg-slate-900/50 border border-slate-800/80'
        }
      `}
    >
      {/* Board coordinate indicator */}
      {showCoordinates && (
        <span className="absolute top-1 left-2 text-[10px] font-mono font-bold text-slate-500/70 select-none">
          #{boardIndex + 1}
        </span>
      )}

      {/* 3x3 Grid of cells */}
      <div className="grid grid-cols-3 gap-1.5 w-full aspect-square">
        {cells.map((val, cellIdx) => {
          const isCurrentCellLastMove =
            lastMove?.boardIndex === boardIndex && lastMove?.cellIndex === cellIdx;
          const isCurrentCellSuggested =
            suggestedMove?.boardIndex === boardIndex &&
            suggestedMove?.cellIndex === cellIdx;

          const isCellValidMove =
            !isWon &&
            !isGameOver &&
            (isActive || isWildcard) &&
            val === null;

          return (
            <Cell
              key={cellIdx}
              value={val}
              boardIndex={boardIndex}
              cellIndex={cellIdx}
              isValidMove={isCellValidMove}
              isLastMove={isCurrentCellLastMove}
              isSuggested={isCurrentCellSuggested}
              disabled={isGameOver || isWon || (!isActive && !isWildcard)}
              turn={currentPlayer}
              onClick={() => onCellClick(boardIndex, cellIdx)}
            />
          );
        })}
      </div>

      {/* Won Mini-Board Large Overlay */}
      {isWon && (
        <div className="absolute inset-0 rounded-xl backdrop-blur-[2px] bg-slate-950/75 flex items-center justify-center pointer-events-none z-10 transition-all duration-300 animate-fadeIn">
          {winner === 'X' && (
            <svg
              viewBox="0 0 100 100"
              className="w-4/5 h-4/5 text-cyan-400 drop-shadow-[0_0_20px_rgba(6,182,212,0.8)]"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              strokeLinecap="round"
            >
              <line x1="20" y1="20" x2="80" y2="80" className="animate-draw-line" />
              <line x1="80" y1="20" x2="20" y2="80" className="animate-draw-line" />
            </svg>
          )}

          {winner === 'O' && (
            <svg
              viewBox="0 0 100 100"
              className="w-4/5 h-4/5 text-rose-400 drop-shadow-[0_0_20px_rgba(244,63,94,0.8)]"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              strokeLinecap="round"
            >
              <circle cx="50" cy="50" r="32" className="animate-draw-line" />
            </svg>
          )}

          {winner === 'TIE' && (
            <div className="text-center font-mono font-black text-slate-400 text-xl tracking-wider uppercase drop-shadow-md">
              TIE
            </div>
          )}
        </div>
      )}
    </div>
  );
};
