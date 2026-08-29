import React from 'react';
import { Info, Code, Cpu, Shield, Sparkles, Terminal, Keyboard } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-10 max-w-4xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-700/60 text-xs font-semibold text-cyan-300 mb-3 shadow-sm">
          <Info className="w-3.5 h-3.5" />
          <span>System Information</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-2 font-display">
          About Super Tic-Tac-Toe
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
          The mathematical depth, technical architecture, and game design behind the platform.
        </p>
      </div>

      <div className="space-y-8">
        {/* Game Theory Depth */}
        <section className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <span>Mathematical Complexity</span>
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed mb-3">
            While classic 3×3 Tic-Tac-Toe contains only 255,168 unique games and is
            easily solved, <strong>Ultimate (Super) Tic-Tac-Toe</strong> contains an
            estimated <strong className="text-cyan-400 font-mono">10^30</strong> legal
            board states and a game-tree complexity comparable to Checkers.
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            The forced-redirection mechanic creates non-local coupling across boards:
            a tactical move in the bottom-right corner immediately alters the opponent's
            strategic possibilities in the top-left board.
          </p>
        </section>

        {/* Technical Architecture */}
        <section className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Code className="w-5 h-5 text-rose-400" />
            <span>Modern Technology Stack</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60">
              <h4 className="font-bold text-cyan-400 mb-1">Frontend Engineering</h4>
              <p className="text-slate-300">
                React 18, TypeScript 5, Vite, Tailwind CSS, Framer Motion, Lucide Icons, and Canvas Confetti.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60">
              <h4 className="font-bold text-rose-400 mb-1">Real-Time Networking</h4>
              <p className="text-slate-300">
                Node.js + Express backend with Socket.io WebSockets, room management, and heartbeat reconnects.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60">
              <h4 className="font-bold text-purple-400 mb-1">AI Engine</h4>
              <p className="text-slate-300">
                Alpha-Beta Minimax with dynamic depth heuristics & transposition table memoization.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60">
              <h4 className="font-bold text-amber-400 mb-1">Audio Synthesizer</h4>
              <p className="text-slate-300">
                100% zero-dependency procedural Web Audio API sound synthesis and ambient chord progressions.
              </p>
            </div>
          </div>
        </section>

        {/* Keyboard Shortcuts & Accessibility */}
        <section className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-emerald-400" />
            <span>Accessibility & Keyboard Controls</span>
          </h2>

          <div className="space-y-2 text-xs font-mono text-slate-300">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
              <span className="text-slate-400 font-sans">Cell Navigation</span>
              <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-cyan-300 font-bold">
                Tab / Shift+Tab
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
              <span className="text-slate-400 font-sans">Make Move</span>
              <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-cyan-300 font-bold">
                Space / Enter
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
