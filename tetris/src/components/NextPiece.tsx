import React from "react";
import { TetrominoType } from "../types/game";
import { TETROMINOS } from "../utils/tetrominos";

interface NextPieceProps {
  pieces: TetrominoType[];
}

const MiniPiece: React.FC<{ type: TetrominoType; isMain?: boolean }> = ({
  type,
  isMain,
}) => {
  const tetromino = TETROMINOS[type];
  const shape = tetromino.shape;
  const cellSize = isMain ? 24 : 18;

  // 빈 행/열 제거하여 중앙 정렬
  const trimmedShape = trimShape(shape);
  const width = trimmedShape[0].length * cellSize;
  const height = trimmedShape.length * cellSize;

  return (
    <div
      className={`mini-piece ${isMain ? "main" : "queue"}`}
      style={{
        width: isMain ? 100 : 80,
        height: isMain ? 80 : 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${trimmedShape[0].length}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${trimmedShape.length}, ${cellSize}px)`,
          width,
          height,
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
    </div>
  );
};

// 빈 행/열 제거
const trimShape = (shape: number[][]): number[][] => {
  // 빈 행 제거
  const nonEmptyRows = shape.filter((row) => row.some((cell) => cell !== 0));

  if (nonEmptyRows.length === 0) return shape;

  // 빈 열 찾기
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

  // 빈 열 제거
  return nonEmptyRows.map((row) => row.slice(minCol, maxCol + 1));
};

export const NextPiece: React.FC<NextPieceProps> = ({ pieces }) => {
  if (pieces.length === 0) return null;

  const [mainPiece, ...queuePieces] = pieces;

  return (
    <div className="next-piece-container">
      <h3 className="panel-title">NEXT</h3>
      <div className="next-main">
        <MiniPiece type={mainPiece} isMain />
      </div>
      <div className="next-queue">
        {queuePieces.map((piece, index) => (
          <MiniPiece key={index} type={piece} />
        ))}
      </div>
    </div>
  );
};
