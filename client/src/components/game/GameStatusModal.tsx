import React from 'react';
import { BoardWinner, GameMode } from '../../game/types.js';
import { Trophy, RefreshCw, Eye, Share2, Sparkles } from 'lucide-react';

interface GameStatusModalProps {
  winner: BoardWinner;
  mode: GameMode;
  totalMoves: number;
  onRematch: () => void;
  onReview: () => void;
  onClose: () => void;
}

export const GameStatusModal: React.FC<GameStatusModalProps> = ({
  winner,
  mode,
  totalMoves,
  onRematch,
  onReview,
  onClose,
}) => {
  if (!winner) return null;

  const isTie = winner === 'TIE';
  const winnerTitle = isTie
    ? "It's a Stalemate Draw!"
    : `Player ${winner} Claims Victory!`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl text-center overflow-hidden">
        {/* Ambient Top Glow */}
        <div
          className={`absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-40 ${
            winner === 'X'
              ? 'bg-cyan-500'
              : winner === 'O'
              ? 'bg-rose-500'
              : 'bg-amber-500'
          }`}
        />

        {/* Victory Icon */}
        <div className="relative mx-auto mb-4 w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center shadow-lg">
          {isTie ? (
            <Sparkles className="w-8 h-8 text-amber-400" />
          ) : (
            <Trophy
              className={`w-8 h-8 ${
                winner === 'X' ? 'text-cyan-400' : 'text-rose-400'
              }`}
            />
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-black tracking-tight text-white mb-1 font-display">
          {winnerTitle}
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          {isTie
            ? 'All available boards filled without 3-in-a-row alignment on the macro board.'
            : `Achieved 3-in-a-row across the macro boards in ${totalMoves} moves.`}
        </p>

        {/* Match Stats Pill */}
        <div className="grid grid-cols-2 gap-3 mb-6 p-3 rounded-2xl bg-slate-800/40 border border-slate-800 font-mono text-xs">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">
              Total Moves
            </span>
            <span className="text-slate-200 font-bold text-sm">{totalMoves}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">
              Mode
            </span>
            <span className="text-cyan-400 font-bold uppercase text-xs">
              {mode}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onRematch}
            className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Play Again</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onReview}
              className="py-2.5 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center justify-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Review Moves</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
