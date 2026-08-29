import { useState, useCallback, useEffect, useRef } from 'react';
import {
  AIDifficulty,
  GameMode,
  GameSnapshot,
  Move,
  PlayerSymbol,
} from '../game/types.js';
import {
  applyMove,
  createInitialState,
  getLegalMoves,
  isMoveValid,
} from '../game/rules.js';
import { computeAIMove } from '../game/ai/aiWorker.js';
import { useAudio } from './useAudio.js';
import { fireVictoryConfetti } from '../utils/confetti.js';

interface UseGameProps {
  mode: GameMode;
  aiDifficulty?: AIDifficulty;
  onGameOver?: (winner: 'X' | 'O' | 'TIE', difficulty?: AIDifficulty) => void;
}

export function useGame({
  mode,
  aiDifficulty = 'medium',
  onGameOver,
}: UseGameProps) {
  const [gameState, setGameState] = useState<GameSnapshot>(createInitialState);
  const [history, setHistory] = useState<GameSnapshot[]>([createInitialState()]);
  const [replayIndex, setReplayIndex] = useState<number | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [suggestedMove, setSuggestedMove] = useState<{
    boardIndex: number;
    cellIndex: number;
  } | null>(null);

  const audio = useAudio();
  const stateRef = useRef(gameState);
  stateRef.current = gameState;

  // Active displayed state (either current live state or replay step)
  const currentDisplayState =
    replayIndex !== null && history[replayIndex]
      ? history[replayIndex]
      : gameState;

  // Reset Game
  const resetGame = useCallback(() => {
    const fresh = createInitialState();
    setGameState(fresh);
    setHistory([fresh]);
    setReplayIndex(null);
    setIsAiThinking(false);
    setSuggestedMove(null);
  }, []);

  // Handle AI turn when in PvC mode
  useEffect(() => {
    if (
      mode === 'pvc' &&
      gameState.currentPlayer === 'O' &&
      !gameState.isGameOver &&
      replayIndex === null
    ) {
      setIsAiThinking(true);

      const timer = setTimeout(() => {
        const aiResult = computeAIMove(
          stateRef.current,
          aiDifficulty,
          'O'
        );

        if (aiResult.move && !stateRef.current.isGameOver) {
          const { boardIndex, cellIndex } = aiResult.move;
          const next = applyMove(stateRef.current, boardIndex, cellIndex);

          audio.playMove('O');
          if (next.miniWinners[boardIndex] === 'O') {
            audio.playMiniBoardWin('O');
          }

          if (next.isGameOver) {
            if (next.winner === 'X') {
              audio.playVictory();
              fireVictoryConfetti();
            }
            onGameOver?.(next.winner!, aiDifficulty);
          }

          setGameState(next);
          setHistory((prev) => [...prev, next]);
        }
        setIsAiThinking(false);
      }, 350 + Math.random() * 250);

      return () => clearTimeout(timer);
    }
  }, [
    mode,
    gameState.currentPlayer,
    gameState.isGameOver,
    aiDifficulty,
    replayIndex,
    audio,
    onGameOver,
  ]);

  // Make Move
  const handleCellClick = useCallback(
    (boardIndex: number, cellIndex: number) => {
      // Prevent moves during replay or AI thinking or game over
      if (replayIndex !== null || isAiThinking || gameState.isGameOver) {
        return false;
      }

      // If PvC and it's AI turn
      if (mode === 'pvc' && gameState.currentPlayer === 'O') {
        return false;
      }

      if (!isMoveValid(gameState, boardIndex, cellIndex)) {
        audio.playError();
        return false;
      }

      const player = gameState.currentPlayer;
      const next = applyMove(gameState, boardIndex, cellIndex);

      audio.playMove(player);
      if (next.miniWinners[boardIndex] === player) {
        audio.playMiniBoardWin(player);
      }

      if (next.isGameOver) {
        if (next.winner) {
          audio.playVictory();
          fireVictoryConfetti();
        }
        onGameOver?.(next.winner!, mode === 'pvc' ? aiDifficulty : undefined);
      }

      setSuggestedMove(null);
      setGameState(next);
      setHistory((prev) => [...prev, next]);
      return true;
    },
    [
      replayIndex,
      isAiThinking,
      gameState,
      mode,
      audio,
      onGameOver,
      aiDifficulty,
    ]
  );

  // Undo Move
  const undoMove = useCallback(() => {
    if (replayIndex !== null || isAiThinking) return;

    if (mode === 'pvc') {
      // In PvC mode, undo 2 steps so player gets their turn back
      if (history.length > 2) {
        const targetState = history[history.length - 3];
        setGameState(targetState);
        setHistory((prev) => prev.slice(0, prev.length - 2));
        audio.playUndo();
      } else if (history.length === 2) {
        // Player made 1 move, AI hasn't moved or just started
        const targetState = history[0];
        setGameState(targetState);
        setHistory([targetState]);
        audio.playUndo();
      }
    } else {
      // In PvP local mode, undo 1 step
      if (history.length > 1) {
        const targetState = history[history.length - 2];
        setGameState(targetState);
        setHistory((prev) => prev.slice(0, prev.length - 1));
        audio.playUndo();
      }
    }
    setSuggestedMove(null);
  }, [history, mode, isAiThinking, replayIndex, audio]);

  // Request Hint
  const requestHint = useCallback(() => {
    if (gameState.isGameOver || isAiThinking) return;
    const aiResult = computeAIMove(
      gameState,
      'hard',
      gameState.currentPlayer
    );
    if (aiResult.move) {
      setSuggestedMove(aiResult.move);
      audio.playClick();
    }
  }, [gameState, isAiThinking, audio]);

  // Replay scrubber controls
  const enterReplayMode = useCallback((index?: number) => {
    setReplayIndex(index !== undefined ? index : history.length - 1);
  }, [history.length]);

  const exitReplayMode = useCallback(() => {
    setReplayIndex(null);
  }, []);

  const stepReplay = useCallback(
    (direction: 'prev' | 'next' | 'first' | 'last') => {
      setReplayIndex((current) => {
        const currentIdx = current ?? history.length - 1;
        if (direction === 'first') return 0;
        if (direction === 'last') return history.length - 1;
        if (direction === 'prev') return Math.max(0, currentIdx - 1);
        if (direction === 'next')
          return Math.min(history.length - 1, currentIdx + 1);
        return currentIdx;
      });
    },
    [history.length]
  );

  return {
    gameState: currentDisplayState,
    liveGameState: gameState,
    isReplayMode: replayIndex !== null,
    replayIndex,
    totalHistorySteps: history.length,
    isAiThinking,
    suggestedMove,
    legalMoves: getLegalMoves(currentDisplayState),
    handleCellClick,
    undoMove,
    resetGame,
    requestHint,
    enterReplayMode,
    exitReplayMode,
    stepReplay,
    canUndo: mode === 'pvc' ? history.length > 1 : history.length > 1,
  };
}
