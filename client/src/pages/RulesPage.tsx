import React from 'react';
import { BookOpen, Target, Sparkles, Trophy, Grid3X3, ArrowRight, ShieldAlert } from 'lucide-react';
import { InteractiveDemoBoard } from '../components/interactive/InteractiveDemoBoard.js';
import { applyMove, createInitialState } from '../game/rules.js';

export const RulesPage: React.FC = () => {
  // Scenario 1: Demonstrating Redirection (Playing in top-right cell redirects to Board 3)
  const redirectionScenario = (state = createInitialState()) => {
    // X plays in Board 0 (Top-Left), cell 2 (Top-Right)
    return applyMove(state, 0, 2);
  };

  // Scenario 2: Demonstrating Wildcard Free Move (Center board is already won)
  const wildcardScenario = (state = createInitialState()) => {
    let s = state;
    // Win center board 4 for X
    s = applyMove(s, 4, 0); // X plays B4-c0 (sends O to B0)
    s = applyMove(s, 0, 4); // O plays B0-c4 (sends X to B4)
    s = applyMove(s, 4, 1); // X plays B4-c1 (sends O to B1)
    s = applyMove(s, 1, 4); // O plays B1-c4 (sends X to B4)
    s = applyMove(s, 4, 2); // X plays B4-c2 -> X wins B4!
    // Now if O plays in any board and sends X to board 4, board 4 is won so activeBoard becomes null (wildcard)!
    return s;
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-10 max-w-4xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-700/60 text-xs font-semibold text-cyan-300 mb-3 shadow-sm">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Official Rulebook</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-3 font-display">
          How To Play Super Tic-Tac-Toe
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
          Ultimate Tic-Tac-Toe transforms a classic game into a rich tactical
          battlefield where every individual move shapes the entire macro grid.
        </p>
      </div>

      {/* Rule 1: The 9×9 Structure */}
      <section className="mb-12 p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center font-bold font-mono text-cyan-400">
            1
          </div>
          <h2 className="text-xl font-bold text-white font-display">
            The Macro Board and 9 Mini-Boards
          </h2>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed mb-4">
          The game consists of a large 3×3 grid containing 9 smaller tic-tac-toe
          boards. In total, there are 81 individual playable cells.
        </p>
        <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 text-xs text-slate-300 flex items-start gap-3">
          <Grid3X3 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
          <span>
            Winning a mini-board converts that entire 3×3 sector into a giant claimed
            symbol (X or O) on the macro board.
          </span>
        </div>
      </section>

      {/* Rule 2: The Redirection Rule (Interactive Demo) */}
      <section className="mb-12 p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center font-bold font-mono text-amber-400">
            2
          </div>
          <h2 className="text-xl font-bold text-white font-display">
            The Forced Target Rule (Move Redirection)
          </h2>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed mb-3">
          <strong>The core mechanic of Ultimate Tic-Tac-Toe:</strong> Wherever you
          place your mark inside a mini-board dictates the exact mini-board your
          opponent must play in on their turn.
        </p>
        <ul className="text-xs text-slate-300 space-y-1.5 mb-4 list-disc list-inside">
          <li>
            If you place in the <strong>top-right cell</strong> of any board, your
            opponent is forced to play inside <strong>Board #3 (Top-Right)</strong>.
          </li>
          <li>
            If you place in the <strong>center cell</strong> of any board, your
            opponent is sent straight to <strong>Board #5 (Center)</strong>.
          </li>
        </ul>

        {/* Live Interactive Sandbox */}
        <InteractiveDemoBoard
          initialSetup={redirectionScenario}
          description="Interactive Demo: Player X just played in the top-right cell of Board #1. Notice how Board #3 (Top-Right) is now glowing amber as the mandatory target for Player O!"
          tip="Try clicking a cell inside the highlighted amber board to see where Player X gets redirected next!"
        />
      </section>

      {/* Rule 3: The Wildcard Rule */}
      <section className="mb-12 p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center font-bold font-mono text-rose-400">
            3
          </div>
          <h2 className="text-xl font-bold text-white font-display">
            The Wildcard / Free Choice Rule
          </h2>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed mb-3">
          If you are directed to a mini-board that has <strong>already been won</strong>{' '}
          or is completely <strong>full of marks</strong>, you are awarded a{' '}
          <strong className="text-amber-400">Wildcard Free Move</strong>.
        </p>
        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          During a Wildcard turn, all unfinished mini-boards ignite and you may play in{' '}
          <strong>any open cell across the entire board</strong>!
        </p>

        {/* Live Wildcard Demo */}
        <InteractiveDemoBoard
          initialSetup={wildcardScenario}
          description="Interactive Demo: The Center Board (Board #5) has already been won by X. If a player is sent to Board #5, they gain a Free Wildcard to place anywhere on the remaining 8 boards!"
          tip="Look at the board: Notice how all remaining open boards are active and accessible."
        />
      </section>

      {/* Rule 4: Winning the Macro Match */}
      <section className="mb-12 p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/50 flex items-center justify-center font-bold font-mono text-purple-400">
            4
          </div>
          <h2 className="text-xl font-bold text-white font-display">
            Winning Conditions & Draws
          </h2>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed mb-4">
          The ultimate objective is to achieve{' '}
          <strong className="text-white">3 claimed mini-boards in a row</strong>{' '}
          (horizontal, vertical, or diagonal) across the macro board.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60">
            <h4 className="font-bold text-cyan-400 mb-1 flex items-center gap-1.5">
              <Trophy className="w-4 h-4" />
              <span>Macro Victory</span>
            </h4>
            <p className="text-slate-300">
              Claim 3 mini-boards in a row (e.g., Top-Left, Center, Bottom-Right) to win
              the match immediately.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60">
            <h4 className="font-bold text-slate-400 mb-1 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" />
              <span>Draws / Stalemate</span>
            </h4>
            <p className="text-slate-300">
              If all 9 mini-boards become completed or tied without either player
              achieving 3-in-a-row on the macro grid, the match ends in a draw.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
