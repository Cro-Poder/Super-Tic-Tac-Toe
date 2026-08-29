import React, { useState } from 'react';
import {
  BarChart3,
  Trophy,
  Flame,
  Bot,
  Globe,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { useStats } from '../hooks/useStats.js';

export const StatisticsPage: React.FC = () => {
  const { stats, resetStats } = useStats();
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const winRate =
    stats.gamesPlayed > 0
      ? Math.round((stats.wins / stats.gamesPlayed) * 100)
      : 0;

  const getDifficultyWinRate = (played: number, wins: number) => {
    if (played === 0) return 0;
    return Math.round((wins / played) * 100);
  };

  const handleResetConfirm = () => {
    resetStats();
    setShowConfirmReset(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-10 max-w-4xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-700/60 text-xs font-semibold text-emerald-300 mb-3 shadow-sm">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Match Analytics</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-2 font-display">
          Career Statistics
        </h1>
        <p className="text-sm text-slate-400">
          Track your battle history, winning streaks, and AI mastery.
        </p>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center shadow-lg">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block mb-1">
            Total Matches
          </span>
          <span className="text-2xl sm:text-3xl font-black text-white font-mono">
            {stats.gamesPlayed}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-700/50 text-center shadow-lg">
          <span className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold block mb-1">
            Win Rate
          </span>
          <span className="text-2xl sm:text-3xl font-black text-cyan-300 font-mono">
            {winRate}%
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-700/50 text-center shadow-lg">
          <span className="text-[10px] uppercase tracking-wider text-rose-400 font-bold block mb-1 flex items-center justify-center gap-1">
            <Flame className="w-3 h-3 text-rose-400" />
            <span>Streak</span>
          </span>
          <span className="text-2xl sm:text-3xl font-black text-rose-300 font-mono">
            {stats.currentStreak}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-700/50 text-center shadow-lg">
          <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold block mb-1 flex items-center justify-center gap-1">
            <Trophy className="w-3 h-3 text-amber-400" />
            <span>Best Streak</span>
          </span>
          <span className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">
            {stats.bestStreak}
          </span>
        </div>
      </div>

      {/* Breakdown by AI Difficulty */}
      <div className="mb-8 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <Bot className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-bold text-white">
            Performance Against AI Opponents
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
          {/* Easy AI */}
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-emerald-400 uppercase text-sm">
                Easy AI
              </span>
              <span className="text-slate-400">
                {getDifficultyWinRate(
                  stats.byDifficulty.easy.played,
                  stats.byDifficulty.easy.wins
                )}
                % Win
              </span>
            </div>
            <div className="space-y-1 text-slate-300">
              <p>Played: {stats.byDifficulty.easy.played}</p>
              <p className="text-emerald-400">
                Wins: {stats.byDifficulty.easy.wins}
              </p>
              <p className="text-rose-400">
                Losses: {stats.byDifficulty.easy.losses}
              </p>
              <p className="text-slate-400">
                Draws: {stats.byDifficulty.easy.draws}
              </p>
            </div>
          </div>

          {/* Medium AI */}
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-amber-400 uppercase text-sm">
                Medium AI
              </span>
              <span className="text-slate-400">
                {getDifficultyWinRate(
                  stats.byDifficulty.medium.played,
                  stats.byDifficulty.medium.wins
                )}
                % Win
              </span>
            </div>
            <div className="space-y-1 text-slate-300">
              <p>Played: {stats.byDifficulty.medium.played}</p>
              <p className="text-emerald-400">
                Wins: {stats.byDifficulty.medium.wins}
              </p>
              <p className="text-rose-400">
                Losses: {stats.byDifficulty.medium.losses}
              </p>
              <p className="text-slate-400">
                Draws: {stats.byDifficulty.medium.draws}
              </p>
            </div>
          </div>

          {/* Hard AI */}
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-purple-400 uppercase text-sm">
                Hard AI (Minimax)
              </span>
              <span className="text-slate-400">
                {getDifficultyWinRate(
                  stats.byDifficulty.hard.played,
                  stats.byDifficulty.hard.wins
                )}
                % Win
              </span>
            </div>
            <div className="space-y-1 text-slate-300">
              <p>Played: {stats.byDifficulty.hard.played}</p>
              <p className="text-emerald-400">
                Wins: {stats.byDifficulty.hard.wins}
              </p>
              <p className="text-rose-400">
                Losses: {stats.byDifficulty.hard.losses}
              </p>
              <p className="text-slate-400">
                Draws: {stats.byDifficulty.hard.draws}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Online Multiplayer Stats */}
      <div className="mb-10 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-rose-400" />
          <h2 className="text-base font-bold text-white">
            Online Battle Records
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
          <div className="p-3 rounded-xl bg-slate-800/40">
            <span className="text-[10px] text-slate-500 uppercase block font-bold">
              Matches
            </span>
            <span className="text-lg font-bold text-slate-200">
              {stats.onlineMatches.played}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/40">
            <span className="text-[10px] text-slate-500 uppercase block font-bold">
              Victories
            </span>
            <span className="text-lg font-bold text-emerald-400">
              {stats.onlineMatches.wins}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/40">
            <span className="text-[10px] text-slate-500 uppercase block font-bold">
              Defeats
            </span>
            <span className="text-lg font-bold text-rose-400">
              {stats.onlineMatches.losses}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/40">
            <span className="text-[10px] text-slate-500 uppercase block font-bold">
              Stalemates
            </span>
            <span className="text-lg font-bold text-slate-400">
              {stats.onlineMatches.draws}
            </span>
          </div>
        </div>
      </div>

      {/* Reset Stats Action */}
      <div className="text-center">
        {!showConfirmReset ? (
          <button
            type="button"
            onClick={() => setShowConfirmReset(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-rose-400 bg-slate-900 hover:bg-rose-950/30 border border-slate-800 hover:border-rose-800/60 transition inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Career Stats</span>
          </button>
        ) : (
          <div className="inline-flex items-center gap-3 p-3 rounded-2xl bg-rose-950/60 border border-rose-700 text-xs text-rose-200 animate-fadeIn">
            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>Permanently clear all recorded statistics?</span>
            <button
              type="button"
              onClick={handleResetConfirm}
              className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
            >
              Yes, Reset
            </button>
            <button
              type="button"
              onClick={() => setShowConfirmReset(false)}
              className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
