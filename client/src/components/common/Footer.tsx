import React from 'react';
import { Gamepad2, Shield, Heart, Github, Code } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full mt-20 border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-rose-500 p-0.5">
            <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center font-mono text-cyan-400 font-bold text-xs">
              9×9
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-200">
              Super Tic-Tac-Toe Arena
            </p>
            <p className="text-[10px] text-slate-500">
              High-performance Ultimate Tic-Tac-Toe with AI & Real-Time Multiplayer
            </p>
          </div>
        </div>

        {/* Quick Nav Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
          <button
            type="button"
            onClick={() => onNavigate('play')}
            className="hover:text-cyan-400 transition"
          >
            Play Game
          </button>
          <button
            type="button"
            onClick={() => onNavigate('rules')}
            className="hover:text-cyan-400 transition"
          >
            Rules & Mechanics
          </button>
          <button
            type="button"
            onClick={() => onNavigate('strategy')}
            className="hover:text-cyan-400 transition"
          >
            Strategy Guide
          </button>
          <button
            type="button"
            onClick={() => onNavigate('leaderboard')}
            className="hover:text-cyan-400 transition"
          >
            Leaderboard
          </button>
          <button
            type="button"
            onClick={() => onNavigate('about')}
            className="hover:text-cyan-400 transition"
          >
            About & Architecture
          </button>
        </div>

        <div className="text-[11px] text-slate-500 text-center md:text-right">
          Built with <span className="text-cyan-400">React</span>,{' '}
          <span className="text-rose-400">TypeScript</span> &{' '}
          <span className="text-amber-400">Socket.io</span>
        </div>
      </div>
    </footer>
  );
};
