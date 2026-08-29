import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Volume2,
  Music,
  Moon,
  Sun,
  Bot,
  User,
  Sparkles,
  Check,
  CheckCircle2,
} from 'lucide-react';
import { AIDifficulty, ThemeMode } from '../game/types.js';
import { useSettings } from '../hooks/useSettings.js';

const AVATAR_OPTIONS = ['⚡', '🤖', '👑', '🎯', '🔥', '🥷', '🛡️', '👾', '🌟', '🎲'];

export const SettingsPage: React.FC = () => {
  const { settings, updateSetting, toggleSound, toggleMusic } = useSettings();
  const [savedBadge, setSavedBadge] = useState(false);

  const triggerSavedIndicator = () => {
    setSavedBadge(true);
    setTimeout(() => setSavedBadge(false), 1800);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-10 max-w-3xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700 text-xs font-semibold text-slate-300 mb-3 shadow-sm">
          <SettingsIcon className="w-3.5 h-3.5 text-cyan-400" />
          <span>System Preferences</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-2 font-display">
          Settings & Customization
        </h1>
        <p className="text-sm text-slate-400">
          Personalize audio synthesizers, visual themes, and player identity.
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Identity Card */}
        <section className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-cyan-400" />
            <span>Player Identity</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                maxLength={20}
                value={settings.username}
                onChange={(e) => {
                  updateSetting('username', e.target.value);
                  triggerSavedIndicator();
                }}
                className="w-full max-w-sm px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Player Avatar
              </label>
              <div className="flex flex-wrap gap-2">
                {AVATAR_OPTIONS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => {
                      updateSetting('avatar', av);
                      triggerSavedIndicator();
                    }}
                    className={`w-11 h-11 rounded-xl text-xl flex items-center justify-center border transition ${
                      settings.avatar === av
                        ? 'bg-cyan-950/80 border-cyan-500 shadow-glow-x scale-105'
                        : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Audio & Synthesizers */}
        <section className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-cyan-400" />
            <span>Sound Effects & Audio Synth</span>
          </h2>

          <div className="space-y-5">
            {/* SFX Toggle & Volume Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-200">
                    Sound Effects (Web Audio Synth)
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Clicks, chimes, victory fanfare, and error buzzers
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    toggleSound();
                    triggerSavedIndicator();
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                    settings.soundEnabled
                      ? 'bg-cyan-500 text-white border-cyan-400 shadow-md'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {settings.soundEnabled ? 'ON' : 'OFF'}
                </button>
              </div>

              {settings.soundEnabled && (
                <div className="flex items-center gap-3 pt-1">
                  <span className="text-[10px] text-slate-500 font-mono w-10">
                    {Math.round(settings.soundVolume * 100)}%
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.soundVolume}
                    onChange={(e) => {
                      updateSetting('soundVolume', parseFloat(e.target.value));
                      triggerSavedIndicator();
                    }}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>
              )}
            </div>

            {/* Ambient Synth Lo-Fi Soundtrack */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <Music className="w-3.5 h-3.5 text-purple-400" />
                    <span>Ambient Synth Soundtrack</span>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Procedural lo-fi background chords
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    toggleMusic();
                    triggerSavedIndicator();
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                    settings.musicEnabled
                      ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-500/25'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {settings.musicEnabled ? 'PLAYING' : 'OFF'}
                </button>
              </div>

              {settings.musicEnabled && (
                <div className="flex items-center gap-3 pt-1">
                  <span className="text-[10px] text-slate-500 font-mono w-10">
                    {Math.round(settings.musicVolume * 100)}%
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.musicVolume}
                    onChange={(e) => {
                      updateSetting('musicVolume', parseFloat(e.target.value));
                      triggerSavedIndicator();
                    }}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-400"
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Visual Themes & Gameplay */}
        <section className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>Theme & Gameplay Preferences</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Color Palette Theme
              </label>
              <div className="grid grid-cols-3 gap-2 max-w-md">
                {[
                  { id: 'dark', label: 'Dark Space', icon: Moon },
                  { id: 'light', label: 'Clean Light', icon: Sun },
                  { id: 'cyberpunk', label: 'Neon Cyber', icon: Sparkles },
                ].map((t) => {
                  const Icon = t.icon;
                  const isSel = settings.theme === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        updateSetting('theme', t.id as ThemeMode);
                        triggerSavedIndicator();
                      }}
                      className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                        isSel
                          ? 'bg-cyan-950/70 border-cyan-500 text-cyan-300 shadow-sm'
                          : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-xs font-bold">{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Default AI Opponent Difficulty
              </label>
              <div className="grid grid-cols-3 gap-2 max-w-md">
                {(['easy', 'medium', 'hard'] as AIDifficulty[]).map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => {
                      updateSetting('defaultAIDifficulty', diff);
                      triggerSavedIndicator();
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold uppercase transition ${
                      settings.defaultAIDifficulty === diff
                        ? 'bg-cyan-950/70 border-cyan-500 text-cyan-300 shadow-sm'
                        : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-white'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <div>
                <p className="text-xs font-semibold text-slate-200">
                  Show Board Coordinates
                </p>
                <p className="text-[11px] text-slate-400">
                  Display #1..#9 badges on mini-boards
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.showBoardCoordinates}
                onChange={(e) => {
                  updateSetting('showBoardCoordinates', e.target.checked);
                  triggerSavedIndicator();
                }}
                className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
              />
            </div>
          </div>
        </section>
      </div>

      {/* Auto-saved indicator toast */}
      {savedBadge && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-950/90 border border-emerald-500 text-emerald-300 text-xs font-bold shadow-xl animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Preferences Saved</span>
        </div>
      )}
    </div>
  );
};
