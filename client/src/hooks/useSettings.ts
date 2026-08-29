import { useState, useEffect, useCallback } from 'react';
import { PlayerSettings } from '../game/types.js';
import { getStoredSettings, saveStoredSettings } from '../services/storage.js';
import { soundEffects } from '../utils/soundEffects.js';
import { ambientSoundtrack } from '../utils/soundtrack.js';

export function useSettings() {
  const [settings, setSettings] = useState<PlayerSettings>(getStoredSettings);

  useEffect(() => {
    // Apply sound settings to utilities
    soundEffects.setMuted(!settings.soundEnabled);
    soundEffects.setVolume(settings.soundVolume);

    ambientSoundtrack.setVolume(settings.musicVolume);
    if (settings.musicEnabled) {
      ambientSoundtrack.start();
    } else {
      ambientSoundtrack.stop();
    }

    // Apply theme class to document
    const root = document.documentElement;
    root.classList.remove('dark', 'light', 'cyberpunk');
    if (settings.theme === 'light') {
      root.classList.add('light');
    } else if (settings.theme === 'cyberpunk') {
      root.classList.add('dark', 'cyberpunk');
    } else {
      root.classList.add('dark');
    }

    saveStoredSettings(settings);
  }, [settings]);

  const updateSetting = useCallback(<K extends keyof PlayerSettings>(
    key: K,
    value: PlayerSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleSound = useCallback(() => {
    setSettings((prev) => {
      const next = !prev.soundEnabled;
      soundEffects.setMuted(!next);
      return { ...prev, soundEnabled: next };
    });
  }, []);

  const toggleMusic = useCallback(() => {
    setSettings((prev) => {
      const next = !prev.musicEnabled;
      if (next) ambientSoundtrack.start();
      else ambientSoundtrack.stop();
      return { ...prev, musicEnabled: next };
    });
  }, []);

  return {
    settings,
    updateSetting,
    toggleSound,
    toggleMusic,
    setSettings,
  };
}
