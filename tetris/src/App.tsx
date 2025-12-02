import React from "react";
import { useGameLogic } from "./hooks/useGameLogic";
import { GameBoard } from "./components/GameBoard";
import { NextPiece } from "./components/NextPiece";
import { HoldPiece } from "./components/HoldPiece";
import { ScoreBoard } from "./components/ScoreBoard";
import { GameOver } from "./components/GameOver";
import { Controls } from "./components/Controls";

const App: React.FC = () => {
  const {
    board,
    currentPiece,
    nextPieces,
    holdPiece,
    canHold,
    score,
    level,
    lines,
    isGameOver,
    isPaused,
    combo,
    restart,
    ghostPosition,
    clearingLines,
  } = useGameLogic();

  return (
    <div className="app">
      <div className="background-effects">
        <div className="grid-bg" />
        <div className="glow-orb orb-1" />
        <div className="glow-orb orb-2" />
        <div className="glow-orb orb-3" />
      </div>

      <header className="game-header">
        <h1 className="game-title">
          <span className="title-neon">NEON</span>
          <span className="title-tetris">TETRIS</span>
        </h1>
      </header>

      <main className="game-container">
        <aside className="left-panel">
          <HoldPiece piece={holdPiece} canHold={canHold} />
          <ScoreBoard score={score} level={level} lines={lines} combo={combo} />
        </aside>

        <div className="center-panel">
          <GameBoard
            board={board}
            currentPiece={currentPiece}
            ghostPosition={ghostPosition}
            clearingLines={clearingLines}
            isPaused={isPaused}
          />
        </div>

        <aside className="right-panel">
          <NextPiece pieces={nextPieces} />
          <Controls />
        </aside>
      </main>

      {isGameOver && (
        <GameOver
          score={score}
          level={level}
          lines={lines}
          onRestart={restart}
        />
      )}
    </div>
  );
};

export default App;
