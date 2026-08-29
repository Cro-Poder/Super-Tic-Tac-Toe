import { DEFAULT_SETTINGS, INITIAL_STATISTICS } from '../game/constants.js';
import { GameStatistics, PlayerSettings } from '../game/types.js';

const SETTINGS_KEY = 'super_ttt_settings_v1';
const STATS_KEY = 'super_ttt_stats_v1';
const USER_ID_KEY = 'super_ttt_user_id';

export function getStoredSettings(): PlayerSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: PlayerSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {}
}

export function getStoredStatistics(): GameStatistics {
  if (typeof window === 'undefined') return INITIAL_STATISTICS;
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return INITIAL_STATISTICS;
    return { ...INITIAL_STATISTICS, ...JSON.parse(raw) };
  } catch (e) {
    return INITIAL_STATISTICS;
  }
}

export function saveStoredStatistics(stats: GameStatistics): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) {}
}

export function getOrCreateUserId(): string {
  if (typeof window === 'undefined') return 'guest_' + Math.random().toString(36).substring(2, 9);
  try {
    let id = localStorage.getItem(USER_ID_KEY);
    if (!id) {
      id = 'user_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
      localStorage.setItem(USER_ID_KEY, id);
    }
    return id;
  } catch (e) {
    return 'guest_' + Math.random().toString(36).substring(2, 9);
  }
}
