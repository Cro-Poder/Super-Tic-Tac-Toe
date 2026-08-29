import React, { useState, useEffect } from 'react';
import { AIDifficulty, GameMode, PlayerSettings } from '../game/types.js';
import { useGame } from '../hooks/useGame.js';
import { useOnlineGame } from '../hooks/useOnlineGame.js';
import { useStats } from '../hooks/useStats.js';
import { SuperBoard } from '../components/game/SuperBoard.js';
import { GameHeader } from '../components/game/GameHeader.js';
import { GameControls } from '../components/game/GameControls.js';
import { MoveHistory } from '../components/game/MoveHistory.js';
import { GameStatusModal } from '../components/game/GameStatusModal.js';
import { LobbyModal } from '../components/online/LobbyModal.js';
import { RoomView } from '../components/online/RoomView.js';
import { Bot, Users, Radio, Sparkles } from 'lucide-react';

interface GamePageProps {
  initialMode?: GameMode;
  initialDifficulty?: AIDifficulty;
  settings: PlayerSettings;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  isLobbyOpen: boolean;
  setIsLobbyOpen: (open: boolean) => void;
}

export const GamePage: React.FC<GamePageProps> = ({
  initialMode = 'pvc',
  initialDifficulty = 'medium',
  settings,
  onToggleSound,
  onToggleMusic,
  isLobbyOpen,
  setIsLobbyOpen,
}) => {
  const [mode, setMode] = useState<GameMode>(initialMode);
  const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>(initialDifficulty);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { recordLocalResult, recordOnlineResult } = useStats();

  // Local Game Hook
  const localGame = useGame({
    mode,
    aiDifficulty,
    onGameOver: (winner, diff) => {
      recordLocalResult(winner, diff);
      setIsModalOpen(true);
    },
  });

  // Online Multiplayer Hook
  const onlineGame = useOnlineGame(settings.username, (winner, userSymbol) => {
    recordOnlineResult(winner, userSymbol);
    setIsModalOpen(true);
  });

  // Check URL query parameters for auto room join (e.g. ?room=XYZ123)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam && !onlineGame.roomCode) {
      setMode('pvp-online');
      onlineGame.joinRoom(roomParam);
    }
  }, [onlineGame]);

  const activeGameState =
    mode === 'pvp-online' ? onlineGame.gameState : localGame.gameState;

  const handleCellClick = (boardIndex: number, cellIndex: number) => {
    if (mode === 'pvp-online') {
      onlineGame.makeMove(boardIndex, cellIndex);
    } else {
      localGame.handleCellClick(boardIndex, cellIndex);
    }
  };

  const handleReset = () => {
    if (mode === 'pvp-online') {
      onlineGame.requestRematch();
    } else {
      localGame.resetGame();
    }
    setIsModalOpen(false);
  };

  const handleRematchModal = () => {
    handleReset();
    setIsModalOpen(false);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] px-3 sm:px-4 py-6 max-w-4xl mx-auto flex flex-col items-center justify-center animate-fadeIn">
      {/* Mode Switching Sub-Tabs */}
      {mode !== 'pvp-online' && (
        <div className="mb-4 flex flex-wrap items-center justify-center gap-1.5 p-1 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          {/* PvC Tab with Difficulty Pill */}
          <div className="flex items-center rounded-xl bg-slate-800/80 p-0.5 border border-slate-700">
            <button
              type="button"
              onClick={() => {
                setMode('pvc');
                localGame.resetGame();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                mode === 'pvc'
                  ? 'bg-cyan-500 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>VS AI</span>
            </button>

            {mode === 'pvc' && (
              <select
                value={aiDifficulty}
                onChange={(e) => {
                  setAiDifficulty(e.target.value as AIDifficulty);
                  localGame.resetGame();
                }}
                className="bg-transparent text-xs font-semibold text-cyan-300 font-mono py-1 px-2 focus:outline-none cursor-pointer"
              >
                <option value="easy" className="bg-slate-900 text-slate-200">
                  Easy
                </option>
                <option value="medium" className="bg-slate-900 text-slate-200">
                  Medium
                </option>
                <option value="hard" className="bg-slate-900 text-slate-200">
                  Hard
                </option>
              </select>
            )}
          </div>

          {/* Pass & Play Tab */}
          <button
            type="button"
            onClick={() => {
              setMode('pvp-local');
              localGame.resetGame();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              mode === 'pvp-local'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white bg-slate-800/40 border border-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Pass & Play</span>
          </button>

          {/* Online Tab Trigger */}
          <button
            type="button"
            onClick={() => setIsLobbyOpen(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/60"
          >
            <Radio className="w-3.5 h-3.5 text-rose-400" />
            <span>Online Match</span>
          </button>
        </div>
      )}

      {/* Online Room Active Banner & Live Chat/Emotes */}
      {mode === 'pvp-online' && onlineGame.roomCode && (
        <RoomView
          roomCode={onlineGame.roomCode}
          myRole={onlineGame.myRole}
          players={onlineGame.players}
          spectatorsCount={onlineGame.spectatorsCount}
          emotes={onlineGame.emotes}
          rematchStatus={onlineGame.rematchStatus}
          isGameOver={activeGameState.isGameOver}
          onSendEmote={onlineGame.sendEmote}
          onRequestRematch={onlineGame.requestRematch}
          onLeaveRoom={() => {
            onlineGame.leaveRoom();
            setMode('pvc');
          }}
        />
      )}

      {/* Game Header (turn, timers, active constraint banner) */}
      <GameHeader
        currentPlayer={activeGameState.currentPlayer}
        activeBoard={activeGameState.activeBoard}
        mode={mode}
        aiDifficulty={aiDifficulty}
        isAiThinking={localGame.isAiThinking}
        soundEnabled={settings.soundEnabled}
        musicEnabled={settings.musicEnabled}
        playerXName={
          mode === 'pvp-online'
            ? onlineGame.players.X?.name || 'Player X'
            : settings.username || 'Player X'
        }
        playerOName={
          mode === 'pvp-online'
            ? onlineGame.players.O?.name || 'Player O'
            : mode === 'pvc'
            ? `Cyber AI (${aiDifficulty})`
            : 'Player 2'
        }
        onToggleSound={onToggleSound}
        onToggleMusic={onToggleMusic}
      />

      {/* Main 9x9 SuperBoard */}
      <SuperBoard
        gameState={activeGameState}
        suggestedMove={localGame.suggestedMove}
        showCoordinates={settings.showBoardCoordinates}
        onCellClick={handleCellClick}
      />

      {/* Game Controls (Undo, Reset, Hint, Share) */}
      <GameControls
        mode={mode}
        canUndo={localGame.canUndo}
        isAiThinking={localGame.isAiThinking}
        isGameOver={activeGameState.isGameOver}
        isReplayMode={localGame.isReplayMode}
        onUndo={localGame.undoMove}
        onReset={handleReset}
        onHint={localGame.requestHint}
        onEnterReplay={() => localGame.enterReplayMode()}
      />

      {/* Move History Log & Replay Scrubber */}
      <MoveHistory
        moves={activeGameState.moves}
        isReplayMode={localGame.isReplayMode}
        replayIndex={localGame.replayIndex}
        totalSteps={localGame.totalHistorySteps}
        onStepReplay={localGame.stepReplay}
        onJumpToStep={localGame.enterReplayMode}
        onExitReplay={localGame.exitReplayMode}
      />

      {/* Game Result Modal (Victory/Draw) */}
      {isModalOpen && activeGameState.winner && (
        <GameStatusModal
          winner={activeGameState.winner}
          mode={mode}
          totalMoves={activeGameState.moves.length}
          onRematch={handleRematchModal}
          onReview={() => {
            setIsModalOpen(false);
            localGame.enterReplayMode();
          }}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* Online Lobby Modal (Create / Join room) */}
      {isLobbyOpen && (
        <LobbyModal
          onCreateRoom={(roomSettings) => {
            setMode('pvp-online');
            onlineGame.createRoom(roomSettings);
            setIsLobbyOpen(false);
          }}
          onJoinRoom={(code, asSpectator) => {
            setMode('pvp-online');
            onlineGame.joinRoom(code, asSpectator);
            setIsLobbyOpen(false);
          }}
          errorMsg={onlineGame.errorMsg}
          onClose={() => setIsLobbyOpen(false)}
        />
      )}
    </div>
  );
};
