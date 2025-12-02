import React from "react";
import { Board, Tetromino, TetrominoType } from "../types/game";
import { BOARD_HEIGHT, BOARD_WIDTH, CELL_SIZE } from "../utils/constants";
import { TETROMINOS } from "../utils/tetrominos";

interface GameBoardProps {
  board: Board;
  currentPiece: Tetromino | null;
  ghostPosition: { x: number; y: number } | null;
  clearingLines: number[];
  isPaused: boolean;
}

interface CellProps {
  type: TetrominoType | null;
  isGhost?: boolean;
  isClearing?: boolean;
}

const Cell: React.FC<CellProps> = ({ type, isGhost, isClearing }) => {
  if (!type && !isGhost) {
    return <div className="cell empty" />;
  }

  const tetromino = type ? TETROMINOS[type] : null;
  const color = tetromino?.color || "#ffffff";

  const style: React.CSSProperties = isGhost
    ? {
        backgroundColor: "transparent",
        borderColor: color,
        opacity: 0.4,
      }
    : {
        backgroundColor: color,
        boxShadow: "none",
      };

  const classNames = [
    "cell",
    "filled",
    type?.toLowerCase(),
    isGhost && "ghost",
    isClearing && "clearing",
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={classNames} style={style} />;
};

// 현재 움직이는 피스를 위한 오버레이 컴포넌트
interface CurrentPieceOverlayProps {
  piece: Tetromino;
  ghostPosition: { x: number; y: number } | null;
}

const CurrentPieceOverlay: React.FC<CurrentPieceOverlayProps> = ({
  piece,
  ghostPosition,
}) => {
  const tetromino = TETROMINOS[piece.type];

  // 고스트 피스 렌더링
  const renderGhost = () => {
    if (!ghostPosition || ghostPosition.y === piece.position.y) return null;

    return (
      <div
        className="piece-overlay ghost-overlay"
        style={{
          transform: `translate(${ghostPosition.x * CELL_SIZE}px, ${
            ghostPosition.y * CELL_SIZE
          }px)`,
        }}
      >
        {piece.shape.map((row, y) =>
          row.map((cell, x) =>
            cell ? (
              <div
                key={`ghost-${y}-${x}`}
                className="overlay-cell ghost"
                style={{
                  left: x * CELL_SIZE,
                  top: y * CELL_SIZE,
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  borderColor: tetromino.color,
                }}
              />
            ) : null
          )
        )}
      </div>
    );
  };

  // 현재 피스 렌더링
  return (
    <>
      {renderGhost()}
      <div
        className="piece-overlay current-overlay"
        style={{
          transform: `translate(${piece.position.x * CELL_SIZE}px, ${
            piece.position.y * CELL_SIZE
          }px)`,
        }}
      >
        {piece.shape.map((row, y) =>
          row.map((cell, x) =>
            cell ? (
              <div
                key={`current-${y}-${x}`}
                className="overlay-cell current"
                style={{
                  left: x * CELL_SIZE,
                  top: y * CELL_SIZE,
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  backgroundColor: tetromino.color,
                  boxShadow: tetromino.glowColor,
                }}
              />
            ) : null
          )
        )}
      </div>
    </>
  );
};

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  currentPiece,
  ghostPosition,
  clearingLines,
  isPaused,
}) => {
  // 고정된 블록만 렌더링 (현재 피스는 오버레이로 처리)
  const renderBoard = () => {
    const cells: React.ReactNode[] = [];

    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        const cellType = board[y][x];
        const isClearing = clearingLines.includes(y);

        cells.push(
          <Cell key={`${y}-${x}`} type={cellType} isClearing={isClearing} />
        );
      }
    }

    return cells;
  };

  const boardStyle: React.CSSProperties = {
    width: BOARD_WIDTH * CELL_SIZE,
    height: BOARD_HEIGHT * CELL_SIZE,
    gridTemplateColumns: `repeat(${BOARD_WIDTH}, ${CELL_SIZE}px)`,
    gridTemplateRows: `repeat(${BOARD_HEIGHT}, ${CELL_SIZE}px)`,
  };

  return (
    <div className="game-board-container">
      <div className="game-board" style={boardStyle}>
        {renderBoard()}
        {currentPiece && (
          <CurrentPieceOverlay
            piece={currentPiece}
            ghostPosition={ghostPosition}
          />
        )}
        <div className="scanline" />
      </div>
      {isPaused && (
        <div className="pause-overlay">
          <div className="pause-text">PAUSED</div>
          <div className="pause-hint">Press P or ESC to resume</div>
        </div>
      )}
    </div>
  );
};
