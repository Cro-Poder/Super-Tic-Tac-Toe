import React, { useState } from 'react';
import { Trophy, Medal, Crown, Star, Flame, Sparkles } from 'lucide-react';
import { useStats } from '../hooks/useStats.js';

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  tier: 'Grandmaster' | 'Master' | 'Diamond' | 'Platinum' | 'Gold';
  rating: number;
  wins: number;
  losses: number;
  streak: number;
}

const GLOBAL_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'VortexZero', avatar: '👑', tier: 'Grandmaster', rating: 2480, wins: 142, losses: 18, streak: 12 },
  { rank: 2, name: 'CyberStrategist', avatar: '⚡', tier: 'Grandmaster', rating: 2415, wins: 128, losses: 24, streak: 7 },
  { rank: 3, name: 'QuantumX', avatar: '🎯', tier: 'Grandmaster', rating: 2360, wins: 115, losses: 31, streak: 5 },
  { rank: 4, name: 'GridMaster99', avatar: '🔥', tier: 'Master', rating: 2240, wins: 98, losses: 29, streak: 4 },
  { rank: 5, name: 'AlphaMinimax', avatar: '🤖', tier: 'Master', rating: 2190, wins: 92, losses: 33, streak: 3 },
  { rank: 6, name: 'TacticalNinja', avatar: '🥷', tier: 'Diamond', rating: 2085, wins: 84, losses: 40, streak: 2 },
  { rank: 7, name: 'NeonKnight', avatar: '🛡️', tier: 'Diamond', rating: 1995, wins: 76, losses: 42, streak: 1 },
  { rank: 8, name: 'StalemateKing', avatar: '⏳', tier: 'Platinum', rating: 1850, wins: 64, losses: 48, streak: 0 },
];

export const LeaderboardPage: React.FC = () => {
  const { stats } = useStats();
  const [activeTab, setActiveTab] = useState<'global' | 'local'>('global');

  const userRating = 1200 + stats.wins * 25 - stats.losses * 15;

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Grandmaster':
        return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
      case 'Master':
        return 'text-purple-400 border-purple-500/40 bg-purple-500/10';
      case 'Diamond':
        return 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10';
      case 'Platinum':
        return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
      default:
        return 'text-slate-300 border-slate-700 bg-slate-800/40';
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-10 max-w-4xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-950/60 border border-yellow-700/60 text-xs font-semibold text-yellow-300 mb-3 shadow-sm">
          <Trophy className="w-3.5 h-3.5" />
          <span>Competitive Arena Ladder</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-2 font-display">
          Rankings & Hall of Fame
        </h1>
        <p className="text-sm text-slate-400">
          Climb the global competitive ladder and claim the Grandmaster rank.
        </p>
      </div>

      {/* User's Rating Card */}
      <div className="mb-8 p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/50 border border-cyan-500/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-2xl">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Your Competitive Rank</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                Active
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Win matches against AI and online rivals to increase your rating.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-center sm:text-right font-mono">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Rating</span>
            <span className="text-2xl font-black text-cyan-400">{Math.max(800, userRating)}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">W / L</span>
            <span className="text-sm font-bold text-slate-300">
              {stats.wins}W - {stats.losses}L
            </span>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-400" />
            <span>Top Competitive Players</span>
          </h3>
          <span className="text-xs text-slate-500 font-mono">Season 1 Active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 uppercase text-[10px] tracking-wider">
                <th className="pb-3 pl-2">#</th>
                <th className="pb-3">Player</th>
                <th className="pb-3">Tier</th>
                <th className="pb-3 text-right">Rating</th>
                <th className="pb-3 text-right">W / L</th>
                <th className="pb-3 text-right pr-2">Streak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {GLOBAL_LEADERBOARD.map((p) => (
                <tr key={p.rank} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 pl-2 font-bold text-slate-400">
                    {p.rank === 1 ? (
                      <Crown className="w-4 h-4 text-amber-400 inline" />
                    ) : p.rank === 2 ? (
                      <Medal className="w-4 h-4 text-slate-300 inline" />
                    ) : p.rank === 3 ? (
                      <Medal className="w-4 h-4 text-amber-600 inline" />
                    ) : (
                      p.rank
                    )}
                  </td>
                  <td className="py-3.5 font-sans font-semibold text-slate-200">
                    <span className="mr-2 text-base">{p.avatar}</span>
                    <span>{p.name}</span>
                  </td>
                  <td className="py-3.5 font-sans">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getTierColor(p.tier)}`}>
                      {p.tier}
                    </span>
                  </td>
                  <td className="py-3.5 text-right font-bold text-cyan-400">
                    {p.rating}
                  </td>
                  <td className="py-3.5 text-right text-slate-400">
                    <span className="text-emerald-400 font-bold">{p.wins}</span> /{' '}
                    <span className="text-rose-400">{p.losses}</span>
                  </td>
                  <td className="py-3.5 text-right pr-2">
                    {p.streak > 0 ? (
                      <span className="inline-flex items-center gap-1 text-rose-400 font-bold">
                        <Flame className="w-3 h-3 text-rose-400" />
                        {p.streak}
                      </span>
                    ) : (
                      <span className="text-slate-600">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
