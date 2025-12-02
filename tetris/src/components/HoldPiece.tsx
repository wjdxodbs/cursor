import React from "react";
import { TetrominoType } from "../types/game";
import { TETROMINOS } from "../utils/tetrominos";

interface HoldPieceProps {
  piece: TetrominoType | null;
  canHold: boolean;
}

// 빈 행/열 제거
const trimShape = (shape: number[][]): number[][] => {
  const nonEmptyRows = shape.filter((row) => row.some((cell) => cell !== 0));

  if (nonEmptyRows.length === 0) return shape;

  const cols = nonEmptyRows[0].length;
  let minCol = cols;
  let maxCol = 0;

  for (const row of nonEmptyRows) {
    for (let c = 0; c < row.length; c++) {
      if (row[c]) {
        minCol = Math.min(minCol, c);
        maxCol = Math.max(maxCol, c);
      }
    }
  }

  return nonEmptyRows.map((row) => row.slice(minCol, maxCol + 1));
};

export const HoldPiece: React.FC<HoldPieceProps> = ({ piece, canHold }) => {
  const cellSize = 24;

  const renderPiece = () => {
    if (!piece) {
      return <div className="hold-empty">-</div>;
    }

    const tetromino = TETROMINOS[piece];
    const trimmedShape = trimShape(tetromino.shape);
    const width = trimmedShape[0].length * cellSize;
    const height = trimmedShape.length * cellSize;

    return (
      <div
        className={`hold-piece ${!canHold ? "used" : ""}`}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${trimmedShape[0].length}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${trimmedShape.length}, ${cellSize}px)`,
          width,
          height,
          opacity: canHold ? 1 : 0.4,
        }}
      >
        {trimmedShape.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${y}-${x}`}
              className={`mini-cell ${cell ? "filled" : "empty"}`}
              style={
                cell
                  ? {
                      backgroundColor: tetromino.color,
                      boxShadow: tetromino.glowColor,
                    }
                  : {}
              }
            />
          ))
        )}
      </div>
    );
  };

  return (
    <div className="hold-piece-container">
      <h3 className="panel-title">HOLD</h3>
      <div className="hold-display">{renderPiece()}</div>
      <div className="hold-hint">[C] or [Shift]</div>
    </div>
  );
};
