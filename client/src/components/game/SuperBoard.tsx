import React from 'react';
import { GameSnapshot } from '../../game/types.js';
import { MiniBoard } from './MiniBoard.js';

interface SuperBoardProps {
  gameState: GameSnapshot;
  suggestedMove: { boardIndex: number; cellIndex: number } | null;
  showCoordinates?: boolean;
  onCellClick: (boardIndex: number, cellIndex: number) => void;
}

export const SuperBoard: React.FC<SuperBoardProps> = ({
  gameState,
  suggestedMove,
  showCoordinates = true,
  onCellClick,
}) => {
  const {
    board,
    miniWinners,
    winningMiniLines,
    activeBoard,
    currentPlayer,
    winner,
    winningLine,
    moves,
    isGameOver,
  } = gameState;

  const lastMove = moves.length > 0 ? moves[moves.length - 1] : null;
  const isWildcard = activeBoard === null;

  // Calculate coordinates for the grand macro winning line (3x3 grid coords)
  const getMacroLineCoordinates = (line: number[] | null) => {
    if (!line || line.length !== 3) return null;
    const centers = [
      { x: 16.66, y: 16.66 }, // 0
      { x: 50.0, y: 16.66 },  // 1
      { x: 83.33, y: 16.66 }, // 2
      { x: 16.66, y: 50.0 },  // 3
      { x: 50.0, y: 50.0 },   // 4
      { x: 83.33, y: 50.0 },  // 5
      { x: 16.66, y: 83.33 }, // 6
      { x: 50.0, y: 83.33 },  // 7
      { x: 83.33, y: 83.33 }, // 8
    ];
    const start = centers[line[0]];
    const end = centers[line[2]];
    return { start, end };
  };

  const macroLine = getMacroLineCoordinates(winningLine);

  return (
    <div className="relative w-full max-w-[620px] aspect-square mx-auto select-none">
      {/* Outer Glow & Glass Card */}
      <div className="w-full h-full p-3 sm:p-4 rounded-3xl bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-xl flex flex-col justify-center">
        {/* 3x3 Grid of Mini Boards */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full h-full">
          {board.map((miniCells, bIdx) => (
            <MiniBoard
              key={bIdx}
              boardIndex={bIdx}
              cells={miniCells}
              winner={miniWinners[bIdx]}
              winningLine={winningMiniLines[bIdx]}
              isActive={activeBoard === bIdx}
              isWildcard={isWildcard}
              lastMove={lastMove}
              suggestedMove={suggestedMove}
              currentPlayer={currentPlayer}
              isGameOver={isGameOver}
              showCoordinates={showCoordinates}
              onCellClick={onCellClick}
            />
          ))}
        </div>
      </div>

      {/* Grand Macro Match Winning SVG Line */}
      {isGameOver && winner && winner !== 'TIE' && macroLine && (
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full pointer-events-none z-30 drop-shadow-[0_0_20px_rgba(245,158,11,0.9)]"
        >
          <line
            x1={macroLine.start.x}
            y1={macroLine.start.y}
            x2={macroLine.end.x}
            y2={macroLine.end.y}
            stroke={winner === 'X' ? '#38BDF8' : '#FB7185'}
            strokeWidth="5"
            strokeLinecap="round"
            className="animate-draw-line"
          />
        </svg>
      )}
    </div>
  );
};
