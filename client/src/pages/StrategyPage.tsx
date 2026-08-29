import React from 'react';
import { Zap, Crosshair, Sparkles, Target, Compass, Flame, CheckCircle2 } from 'lucide-react';
import { InteractiveDemoBoard } from '../components/interactive/InteractiveDemoBoard.js';
import { applyMove, createInitialState } from '../game/rules.js';

export const StrategyPage: React.FC = () => {
  // Strategy Scenario 1: Center Board Domination Setup
  const centerDominationScenario = (state = createInitialState()) => {
    let s = state;
    s = applyMove(s, 4, 4); // X plays center of center board
    return s;
  };

  // Strategy Scenario 2: Dual Threat Fork Setup
  const forkThreatScenario = (state = createInitialState()) => {
    let s = state;
    // Setup X with two threats on Board 0
    s = applyMove(s, 0, 0); // X plays TL
    s = applyMove(s, 0, 8); // O plays BR
    s = applyMove(s, 8, 0); // X plays TL
    s = applyMove(s, 0, 1); // O plays TC
    s = applyMove(s, 1, 0); // X plays TL -> X has [0,0] and redirects back
    return s;
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-10 max-w-4xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/60 border border-purple-700/60 text-xs font-semibold text-purple-300 mb-3 shadow-sm">
          <Zap className="w-3.5 h-3.5 text-purple-400" />
          <span>Tactical Masterclass</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-3 font-display">
          Strategies & Advanced Techniques
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
          Super Tic-Tac-Toe is not about winning small boards quickly—it is about
          controlling where your opponent is forced to play.
        </p>
      </div>

      {/* Chapter 1: Center Board Domination */}
      <section className="mb-12 p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center font-bold text-cyan-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-display">
              1. Control the Center Board (Board #5)
            </h2>
            <p className="text-xs text-cyan-400 font-semibold">
              The Hub of All 4 Winning Lines
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mb-4">
          Board #5 (Center) is part of 4 different macro winning lines (horizontal,
          vertical, and both diagonals). Controlling this board gives you immense
          spatial flexibility and cuts off half of your opponent's winning lines.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
            <h4 className="font-bold text-white mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Center Cell Magnet</span>
            </h4>
            <p className="text-slate-300">
              Playing in the center cell of <em>any</em> mini-board sends your opponent to
              Board #5. If you dominate Board #5, sending them there puts them in
              danger!
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
            <h4 className="font-bold text-white mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Center of the Center</span>
            </h4>
            <p className="text-slate-300">
              The single most coveted move on turn 1 is Board 5, Cell 5. It forces your
              opponent to respond immediately in Board 5 while claiming the center cell.
            </p>
          </div>
        </div>

        <InteractiveDemoBoard
          initialSetup={centerDominationScenario}
          description="Tactical Example: Player X claims the exact center cell of Board #5 on Turn 1. Notice how Player O is now forced into Board #5."
          tip="Experiment with where you can redirect Player X next."
        />
      </section>

      {/* Chapter 2: The Sacrifice to Dead Board Gambit */}
      <section className="mb-12 p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center font-bold text-rose-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-display">
              2. The "Sacrifice to Dead Board" Gambit
            </h2>
            <p className="text-xs text-rose-400 font-semibold">
              Sacrificing a Mini-Board for Massive Macro Tempo
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mb-4">
          Novice players try to win every mini-board. Master players intentionally
          allow the opponent to win an irrelevant corner board if it enables a{' '}
          <strong className="text-amber-400">Free Wildcard Move</strong> on the next
          turn to clinch the macro victory!
        </p>

        <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-800/50 text-xs text-slate-200">
          <p className="font-bold text-rose-300 mb-1">How The Gambit Works:</p>
          <ol className="space-y-1.5 list-decimal list-inside text-slate-300">
            <li>Let your opponent complete a small board that doesn't harm your macro line.</li>
            <li>On your next turn, play a move that sends them back into that completed board.</li>
            <li>Because that board is already won, you receive a free wildcard across the entire table!</li>
          </ol>
        </div>
      </section>

      {/* Chapter 3: Creating Dual-Threat Forks */}
      <section className="mb-12 p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center font-bold text-amber-400">
            <Crosshair className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-display">
              3. Constructing Dual-Threat Forks
            </h2>
            <p className="text-xs text-amber-400 font-semibold">
              Unstoppable 2-Way Attack Vectors
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mb-4">
          A fork occurs when a single move establishes two winning lines simultaneously.
          Because your opponent can only defend one board per turn, the other line is
          guaranteed to fall.
        </p>

        <InteractiveDemoBoard
          initialSetup={forkThreatScenario}
          description="Interactive Puzzle: Study Board #1 (Top-Left). Player X is setting up multiple alignment threats while redirecting Player O to safe peripheral boards."
          tip="Look for moves that force your opponent to send you right back to your target board!"
        />
      </section>

      {/* Summary Checklist */}
      <section className="p-6 rounded-3xl bg-gradient-to-r from-cyan-950/50 via-slate-900 to-purple-950/50 border border-slate-800">
        <h3 className="text-base font-bold text-white mb-3">
          Grandmaster Strategy Checklist
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/40">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span>Never make a move without checking where it sends the opponent.</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/40">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span>Prioritize macro board lines over small board victories.</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/40">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span>Keep corner boards active to avoid giving free wildcards.</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/40">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span>Look 2 turns ahead: Move ➔ Opponent Response ➔ Your Return Move.</span>
          </div>
        </div>
      </section>
    </div>
  );
};
