import React, { useState } from 'react';
import { AIDifficulty, GameMode } from './game/types.js';
import { useSettings } from './hooks/useSettings.js';
import { Navbar } from './components/common/Navbar.js';
import { Footer } from './components/common/Footer.js';
import { HomePage } from './pages/HomePage.js';
import { GamePage } from './pages/GamePage.js';
import { RulesPage } from './pages/RulesPage.js';
import { StrategyPage } from './pages/StrategyPage.js';
import { StatisticsPage } from './pages/StatisticsPage.js';
import { LeaderboardPage } from './pages/LeaderboardPage.js';
import { SettingsPage } from './pages/SettingsPage.js';
import { AboutPage } from './pages/AboutPage.js';

export function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [gameMode, setGameMode] = useState<GameMode>('pvc');
  const [gameDifficulty, setGameDifficulty] = useState<AIDifficulty>('medium');
  const [isLobbyOpen, setIsLobbyOpen] = useState(false);

  const { settings, updateSetting, toggleSound, toggleMusic } = useSettings();

  const handleStartGame = (mode: GameMode, difficulty?: AIDifficulty) => {
    setGameMode(mode);
    if (difficulty) setGameDifficulty(difficulty);
    setCurrentPage('play');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenOnlineLobby = () => {
    setGameMode('pvp-online');
    setIsLobbyOpen(true);
    setCurrentPage('play');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleTheme = () => {
    const nextTheme = settings.theme === 'light' ? 'dark' : 'light';
    updateSetting('theme', nextTheme);
  };

  return (
    <div className="min-h-screen flex flex-col bg-cyber-bg text-slate-100 cyber-grid-bg">
      {/* Top Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        theme={settings.theme}
        onToggleTheme={handleToggleTheme}
        soundEnabled={settings.soundEnabled}
        onToggleSound={toggleSound}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onStartGame={handleStartGame}
            onNavigate={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenOnlineLobby={handleOpenOnlineLobby}
          />
        )}

        {currentPage === 'play' && (
          <GamePage
            initialMode={gameMode}
            initialDifficulty={gameDifficulty}
            settings={settings}
            onToggleSound={toggleSound}
            onToggleMusic={toggleMusic}
            isLobbyOpen={isLobbyOpen}
            setIsLobbyOpen={setIsLobbyOpen}
          />
        )}

        {currentPage === 'rules' && <RulesPage />}

        {currentPage === 'strategy' && <StrategyPage />}

        {currentPage === 'stats' && <StatisticsPage />}

        {currentPage === 'leaderboard' && <LeaderboardPage />}

        {currentPage === 'settings' && <SettingsPage />}

        {currentPage === 'about' && <AboutPage />}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
export default App;
