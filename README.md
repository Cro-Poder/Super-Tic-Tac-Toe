# ⚡ Super Tic-Tac-Toe (Ultimate Tic-Tac-Toe) Arena

A high-performance, commercial-grade web application for **Super Tic-Tac-Toe (Ultimate Tic-Tac-Toe)** built with **React 18**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, **Socket.io**, and **Node.js Express**.

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-cyan.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)
![Socket.io](https://img.shields.io/badge/Socket.io-Realtime-black.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8.svg)

---

## 🎮 Game Overview

**Ultimate (Super) Tic-Tac-Toe** transforms the classic game into a deeply strategic 9×9 battleground:
* **9 Mini-Boards**: Arranged in a 3×3 macro grid (81 cells in total).
* **The Forced Redirection Rule**: Where you place your mark in a mini-board forces your opponent to make their next move in the corresponding mini-board.
* **Winning Small Boards**: Getting 3-in-a-row on a small board wins that board and claims that cell on the macro grid.
* **The Wildcard Rule**: If directed to an already completed or full board, the player gets a **Free Wildcard** to play anywhere on the board!
* **Winning the Match**: First player to align 3 claimed mini-boards in a row on the macro grid wins the game.

---

## ✨ Features

* 🤖 **3-Tier AI Opponent Engine**:
  * **Easy**: Random legal moves with single-move tactical awareness.
  * **Medium**: Positional weights (Center board 5x, corners 3x, edges 2x) with 2-ply Minimax.
  * **Hard**: Deep Minimax with **Alpha-Beta Pruning**, iterative deepening, move ordering heuristics, and transposition table caching running smoothly without UI lag.
* 🌐 **Real-Time Online Multiplayer**:
  * Create/Join rooms with 6-character room codes (e.g. `X8K2M9`).
  * Shareable direct invite links (`?room=XYZ123`).
  * Real-time board state synchronization via WebSockets (Socket.io).
  * In-game emote reactions and quick chat.
  * Spectator mode and disconnect/reconnect grace recovery.
* 👥 **Local Pass & Play**:
  * 2 players on the same device.
  * Full **Undo** system and move recommendation assistant (**Hint**).
* 📜 **Interactive Move History & Replay System**:
  * Move notation log (e.g. `B[1,1]-c[2,2]`).
  * Step-by-step scrubber (First, Previous, Next, Last) to review any phase of the match.
* 📚 **Interactive Rules & Strategy Masterclasses**:
  * Step-by-step rules with embedded sandbox boards.
  * Deep strategic guides covering Center Dominance, The "Sacrifice to Dead Board" Gambit, Dual-Threat Forks, and Endgame Traps.
* 📊 **Analytics & Leaderboard**:
  * Career win/loss/draw rates, win streaks, and records by AI difficulty.
  * Competitive ladder rankings with ELO ratings and tier badges.
* 🎵 **Zero-Dependency Web Audio API Synth**:
  * Procedurally synthesized sound effects (clicks, move chimes, victory fanfare, error buzzers).
  * Procedural chill Lo-Fi ambient synth soundtrack generator.
* 📱 **PWA & Responsive Design**:
  * Installable as a progressive web app on mobile and desktop.
  * Dark Mode, Light Mode, and Neon Cyberpunk themes.

---

## 🛠️ Project Structure

```
Super_Tic_Tac_Toe/
├── client/                     # Frontend Application
│   ├── public/                 # Favicon, SVG Logo, PWA Manifest
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Navbar, Footer
│   │   │   ├── game/           # SuperBoard, MiniBoard, Cell, GameHeader, GameControls, MoveHistory, GameStatusModal
│   │   │   ├── interactive/    # InteractiveDemoBoard (for tutorial sandboxes)
│   │   │   └── online/         # LobbyModal, RoomView (chat & emotes)
│   │   ├── game/               # Pure Game Logic & AI Algorithms
│   │   │   ├── types.ts        # Type definitions
│   │   │   ├── constants.ts    # Board coordinates & defaults
│   │   │   ├── rules.ts        # Complete rules engine & validation
│   │   │   └── ai/             # Easy, Medium, Hard Minimax + Worker
│   │   ├── hooks/              # useGame, useOnlineGame, useAudio, useSettings, useStats
│   │   ├── pages/              # Home, Game, Rules, Strategy, Statistics, Leaderboard, Settings, About
│   │   ├── services/           # socket.ts, storage.ts
│   │   └── utils/              # soundEffects.ts, soundtrack.ts, confetti.ts
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── server/                     # Real-Time WebSocket Backend
│   ├── src/
│   │   ├── server.ts           # Express + Socket.io entrypoint
│   │   ├── roomManager.ts      # Matchmaking, room codes, state validation, spectators
│   │   └── types.ts            # Server types
│   ├── package.json
│   └── tsconfig.json
├── render.yaml                 # Production Render Blueprint (Static Site + Web Service)
├── package.json                # Root orchestration scripts
└── README.md                   # Documentation
```

---

## 🚀 Getting Started Locally

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v8.0.0 or higher

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   cd Super_Tic_Tac_Toe
   ```

2. Install all dependencies across root, client, and server:
   ```bash
   npm run install:all
   ```

### Running in Development Mode

Run both the frontend client (Vite on port 3000) and backend server (Express + Socket.io on port 5000) concurrently:
```bash
npm run dev:all
```

Or run them individually:
* **Start Server**: `npm run dev:server` (Runs on `http://localhost:5000`)
* **Start Client**: `npm run dev` (Runs on `http://localhost:3000`)

Open your browser at **`http://localhost:3000`** to play!

---

## 🌐 Production Deployment Guide

### Deploying to Render

This repository includes a pre-configured [`render.yaml`](./render.yaml) blueprint for one-click deployment.

#### Option 1: Automatic Blueprint Deploy
1. Push your repository to GitHub / GitLab.
2. Log into [Render Dashboard](https://dashboard.render.com/).
3. Click **New +** ➔ **Blueprint**.
4. Connect your repository. Render will automatically detect `render.yaml` and provision:
   * **`super-tic-tac-toe-server`**: Node Web Service (free plan)
   * **`super-tic-tac-toe-client`**: Static Site (free plan)

#### Option 2: Manual Render Setup

**1. Backend Web Service:**
* **Root Directory**: `server`
* **Environment**: `Node`
* **Build Command**: `npm install && npm run build`
* **Start Command**: `npm run start`
* **Environment Variables**:
  * `PORT`: `10000`
  * `NODE_ENV`: `production`
  * `CLIENT_URL`: `https://<your-client-site>.onrender.com`

**2. Frontend Static Site:**
* **Root Directory**: `client`
* **Build Command**: `npm install && npm run build`
* **Publish Directory**: `./dist`
* **Environment Variables**:
  * `VITE_SERVER_URL`: `https://<your-server-service>.onrender.com`
* **Redirects/Rewrites**:
  * Type: `Rewrite`
  * Source: `/*`
  * Destination: `/index.html`

---

## 🧠 AI Engine Details

### 1. Easy Mode
Makes quick random legal moves with an 85% tactical preference to seize an instant mini-board victory or block an immediate mini-board alignment by the human player.

### 2. Medium Mode
Employs a multi-factor positional heuristic:
* **Center Board Weight**: 5.0× multiplier.
* **Corner Board Weight**: 3.0× multiplier.
* **Edge Board Weight**: 2.0× multiplier.
* Evaluates 2-in-a-row threats, mini-board center occupancy, and avoids sending the human player to boards where they can freely score.

### 3. Hard Mode (Minimax + Alpha-Beta Pruning)
* **Search Depth**: Dynamic 4-6 ply search adapted to branch density.
* **Transposition Table**: Memoizes board hashes to eliminate redundant branch calculations.
* **Move Ordering**: Pre-sorts high-value moves (center control, win lines) to maximize early alpha-beta branch pruning cutoffs.
* **Web Worker Execution**: Runs asynchronously without stalling the browser render loop.

---

## 📜 License

This project is open-source and released under the **MIT License**.
