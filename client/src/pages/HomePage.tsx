import React from 'react';
import {
  Gamepad2,
  Users,
  Bot,
  Sparkles,
  BookOpen,
  Zap,
  BarChart3,
  Trophy,
  Settings as SettingsIcon,
  ShieldCheck,
  Cpu,
  Radio,
  History,
  ArrowRight,
} from 'lucide-react';
import { AIDifficulty, GameMode } from '../game/types.js';

interface HomePageProps {
  onStartGame: (mode: GameMode, difficulty?: AIDifficulty) => void;
  onNavigate: (page: string) => void;
  onOpenOnlineLobby: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onStartGame,
  onNavigate,
  onOpenOnlineLobby,
}) => {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-8 max-w-7xl mx-auto">
      {/* Background Animated Neon Orbs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-subtle" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-subtle" />

      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-12 animate-fadeIn">
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700 text-xs font-semibold text-cyan-300 mb-6 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
          <span>Next-Generation Ultimate Tic-Tac-Toe</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-4 font-display">
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-white bg-clip-text text-transparent">
            SUPER
          </span>{' '}
          <span className="bg-gradient-to-r from-rose-400 via-pink-300 to-purple-400 bg-clip-text text-transparent">
            TIC-TAC-TOE
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
          The ultimate test of foresight and spatial tactics. 9 interconnected
          boards where every move you make dictates where your opponent must
          respond next.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5">
          <button
            type="button"
            onClick={() => onStartGame('pvc', 'medium')}
            className="px-6 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-xl shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
          >
            <Bot className="w-4 h-4" />
            <span>Play vs AI</span>
          </button>

          <button
            type="button"
            onClick={onOpenOnlineLobby}
            className="px-6 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white shadow-xl shadow-rose-500/25 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
          >
            <Radio className="w-4 h-4" />
            <span>Online Multiplayer</span>
          </button>

          <button
            type="button"
            onClick={() => onStartGame('pvp-local')}
            className="px-6 py-3.5 rounded-2xl font-bold text-sm bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 shadow-lg transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            <span>Pass & Play</span>
          </button>
        </div>
      </div>

      {/* Main Menu Grid Cards */}
      <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
        {/* Play VS AI Card */}
        <div
          onClick={() => onStartGame('pvc', 'hard')}
          className="glass-card p-5 rounded-3xl cursor-pointer hover:border-cyan-500/50 hover:shadow-glow-x transition-all duration-300 group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-110 transition-transform">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1 group-hover:text-cyan-300 transition">
              AI Challenge (Easy / Med / Hard)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Battle intelligent bots powered by Alpha-Beta Minimax and tactical
              heuristics running in dedicated Web Workers.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-cyan-400">
            <span>Launch match</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Rules & Mechanics */}
        <div
          onClick={() => onNavigate('rules')}
          className="glass-card p-5 rounded-3xl cursor-pointer hover:border-amber-500/50 hover:shadow-glow-active transition-all duration-300 group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1 group-hover:text-amber-300 transition">
              Rules & Interactive Tutorial
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Learn the 4 golden mechanics of Ultimate Tic-Tac-Toe with live
              interactive mini-boards.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-amber-400">
            <span>Learn rules</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Strategies & Tactics */}
        <div
          onClick={() => onNavigate('strategy')}
          className="glass-card p-5 rounded-3xl cursor-pointer hover:border-purple-500/50 hover:shadow-glow-purple transition-all duration-300 group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 mb-3 group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1 group-hover:text-purple-300 transition">
              Strategy & Masterclass
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Master center control, the sacrifice gambit, dual-threat forks, and
              endgame traps.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-purple-400">
            <span>Explore tactics</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Match Statistics */}
        <div
          onClick={() => onNavigate('stats')}
          className="glass-card p-5 rounded-3xl cursor-pointer hover:border-emerald-500/50 transition-all duration-300 group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1 group-hover:text-emerald-300 transition">
              Career Statistics
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Review your win rates, winning streaks, records against AI
              tiers, and online battle history.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-emerald-400">
            <span>View stats</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Global Leaderboards */}
        <div
          onClick={() => onNavigate('leaderboard')}
          className="glass-card p-5 rounded-3xl cursor-pointer hover:border-yellow-500/50 transition-all duration-300 group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center text-yellow-400 mb-3 group-hover:scale-110 transition-transform">
              <Trophy className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1 group-hover:text-yellow-300 transition">
              Rankings & Hall of Fame
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Climb the competitive ladder from Bronze to Grandmaster with
              performance rating tracking.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-yellow-400">
            <span>Check ladder</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Settings & Customization */}
        <div
          onClick={() => onNavigate('settings')}
          className="glass-card p-5 rounded-3xl cursor-pointer hover:border-slate-500/50 transition-all duration-300 group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-slate-500/20 border border-slate-500/40 flex items-center justify-center text-slate-300 mb-3 group-hover:scale-110 transition-transform">
              <SettingsIcon className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1 group-hover:text-slate-200 transition">
              Settings & Themes
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Adjust Web Audio synthesizer volumes, ambient soundtrack, themes,
              custom avatars, and AI defaults.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-slate-400">
            <span>Configure</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Technology Feature Highlights */}
      <div className="w-full max-w-5xl p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 text-center">
          Engineered For Seamless Competitive Play
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3">
            <Radio className="w-6 h-6 text-rose-400 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-slate-200">Socket.io Sync</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Sub-50ms room synchronization & reconnection
            </p>
          </div>
          <div className="p-3">
            <Cpu className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-slate-200">Web Worker AI</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              60 FPS smooth UI during deep Minimax pruning
            </p>
          </div>
          <div className="p-3">
            <History className="w-6 h-6 text-amber-400 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-slate-200">Move Scrubber</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Step-by-step game replay and undo engine
            </p>
          </div>
          <div className="p-3">
            <Sparkles className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-slate-200">Web Audio Synth</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Zero asset latency with procedural soundscapes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
