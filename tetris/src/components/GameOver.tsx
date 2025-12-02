import React from "react";

interface GameOverProps {
  score: number;
  level: number;
  lines: number;
  onRestart: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({
  score,
  level,
  lines,
  onRestart,
}) => {
  return (
    <div className="game-over-overlay">
      <div className="game-over-content">
        <h2 className="game-over-title">GAME OVER</h2>

        <div className="game-over-stats">
          <div className="stat-item">
            <span className="stat-label">FINAL SCORE</span>
            <span className="stat-value">{score.toLocaleString()}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">LEVEL</span>
            <span className="stat-value">{level}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">LINES</span>
            <span className="stat-value">{lines}</span>
          </div>
        </div>

        <button className="restart-button" onClick={onRestart}>
          PLAY AGAIN
        </button>

        <div className="restart-hint">Press ENTER or SPACE to restart</div>
      </div>
    </div>
  );
};
