import React from "react";

interface ScoreBoardProps {
  score: number;
  level: number;
  lines: number;
  combo: number;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  score,
  level,
  lines,
  combo,
}) => {
  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  return (
    <div className="score-board">
      <div className="score-item score-main">
        <span className="score-label">SCORE</span>
        <span className="score-value">{formatNumber(score)}</span>
      </div>

      <div className="score-row">
        <div className="score-item">
          <span className="score-label">LEVEL</span>
          <span className="score-value level">{level}</span>
        </div>

        <div className="score-item">
          <span className="score-label">LINES</span>
          <span className="score-value lines">{formatNumber(lines)}</span>
        </div>
      </div>

      {combo > 1 && (
        <div className="combo-display">
          <span className="combo-text">COMBO</span>
          <span className="combo-value">x{combo}</span>
        </div>
      )}
    </div>
  );
};
