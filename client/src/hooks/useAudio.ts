import { useCallback } from 'react';
import { PlayerSymbol } from '../game/types.js';
import { soundEffects } from '../utils/soundEffects.js';
import { ambientSoundtrack } from '../utils/soundtrack.js';

export function useAudio() {
  const playClick = useCallback(() => soundEffects.playClick(), []);
  const playMove = useCallback((player: PlayerSymbol) => soundEffects.playMove(player), []);
  const playMiniBoardWin = useCallback((player: PlayerSymbol) => soundEffects.playMiniBoardWin(player), []);
  const playVictory = useCallback(() => soundEffects.playVictory(), []);
  const playError = useCallback(() => soundEffects.playError(), []);
  const playUndo = useCallback(() => soundEffects.playUndo(), []);
  const playEmote = useCallback(() => soundEffects.playEmote(), []);

  return {
    playClick,
    playMove,
    playMiniBoardWin,
    playVictory,
    playError,
    playUndo,
    playEmote,
    toggleMusic: () => ambientSoundtrack.toggle(),
    isMusicPlaying: () => ambientSoundtrack.getIsPlaying(),
  };
}
