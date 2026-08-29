import React, { useState, useEffect } from 'react';
import {
  Gamepad2,
  BookOpen,
  Zap,
  BarChart3,
  Trophy,
  Settings as SettingsIcon,
  Info,
  Menu,
  X,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Download,
} from 'lucide-react';
import { ThemeMode } from '../../game/types.js';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  theme,
  onToggleTheme,
  soundEnabled,
  onToggleSound,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Gamepad2 },
    { id: 'play', label: 'Play Game', icon: Gamepad2 },
    { id: 'rules', label: 'Rules', icon: BookOpen },
    { id: 'strategy', label: 'Strategy', icon: Zap },
    { id: 'stats', label: 'Stats', icon: BarChart3 },
    { id: 'leaderboard', label: 'Rankings', icon: Trophy },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          type="button"
          onClick={() => {
            onNavigate('home');
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-rose-500 p-0.5 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black font-mono text-cyan-400 text-sm">
              9×9
            </div>
          </div>
          <div className="text-left">
            <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-rose-400 bg-clip-text text-transparent font-display">
              Super Tic-Tac-Toe
            </span>
            <span className="block text-[9px] uppercase tracking-widest text-slate-400 font-mono -mt-1">
              Ultimate Arena
            </span>
          </div>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`
                  px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all
                  ${
                    isActive
                      ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-600/50 shadow-sm shadow-cyan-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }
                `}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons (Sound, Theme, PWA, Mobile menu trigger) */}
        <div className="flex items-center gap-2">
          {deferredPrompt && (
            <button
              type="button"
              onClick={handleInstallClick}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 text-xs font-bold hover:bg-cyan-500/30 transition shadow-sm"
              title="Install Web App"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install App</span>
            </button>
          )}

          <button
            type="button"
            onClick={onToggleSound}
            aria-label="Toggle Sound"
            className={`p-2 rounded-xl border transition ${
              soundEnabled
                ? 'bg-slate-800/80 border-slate-700 text-slate-200 hover:text-white'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Toggle Dark / Light Theme"
            className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 hover:text-white transition"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-300" />}
          </button>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200"
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-6 bg-slate-900/95 border-b border-slate-800 animate-fadeIn">
          <div className="grid grid-cols-2 gap-2 pt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`
                    p-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition
                    ${
                      isActive
                        ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/60 shadow-sm'
                        : 'bg-slate-800/40 text-slate-300 hover:text-white border border-slate-800'
                    }
                  `}
                >
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
