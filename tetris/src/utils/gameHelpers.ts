import {
  Board,
  CellValue,
  Position,
  Tetromino,
  TetrominoType,
} from "../types/game";
import { BOARD_HEIGHT, BOARD_WIDTH } from "./constants";
import {
  TETROMINOS,
  rotateMatrix,
  WALL_KICK_DATA_I,
  WALL_KICK_DATA_JLSTZ,
} from "./tetrominos";

// 빈 보드 생성
export const createEmptyBoard = (): Board => {
  return Array.from({ length: BOARD_HEIGHT }, () =>
    Array.from({ length: BOARD_WIDTH }, () => null)
  );
};

// 새 테트로미노 생성
export const createTetromino = (type: TetrominoType): Tetromino => {
  const shape = TETROMINOS[type].shape.map((row) => [...row]);
  return {
    shape,
    type,
    position: {
      x: Math.floor((BOARD_WIDTH - shape[0].length) / 2),
      y: 0,
    },
  };
};

// 충돌 감지
export const checkCollision = (
  board: Board,
  shape: number[][],
  position: Position
): boolean => {
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const newX = position.x + x;
        const newY = position.y + y;

        // 보드 경계 체크
        if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
          return true;
        }

        // 다른 블록과 충돌 체크 (y >= 0인 경우만)
        if (newY >= 0 && board[newY][newX] !== null) {
          return true;
        }
      }
    }
  }
  return false;
};

// 회전 시도 (벽 킥 포함)
export const tryRotate = (
  board: Board,
  piece: Tetromino,
  currentRotation: number,
  clockwise: boolean = true
): { shape: number[][]; rotation: number } | null => {
  const newRotation = clockwise
    ? (currentRotation + 1) % 4
    : (currentRotation + 3) % 4;

  let rotatedShape = piece.shape;
  if (clockwise) {
    rotatedShape = rotateMatrix(piece.shape);
  } else {
    // 반시계 방향 = 시계 방향 3번
    rotatedShape = rotateMatrix(rotateMatrix(rotateMatrix(piece.shape)));
  }

  // O 피스는 회전해도 모양이 같음
  if (piece.type === "O") {
    return { shape: rotatedShape, rotation: newRotation };
  }

  // 벽 킥 데이터 선택
  const kickData = piece.type === "I" ? WALL_KICK_DATA_I : WALL_KICK_DATA_JLSTZ;
  const kickKey = `${currentRotation}->${newRotation}` as keyof typeof kickData;
  const kicks = kickData[kickKey] || [];

  // 먼저 기본 위치에서 시도
  if (!checkCollision(board, rotatedShape, piece.position)) {
    return { shape: rotatedShape, rotation: newRotation };
  }

  // 벽 킥 시도
  for (const kick of kicks) {
    const newPosition = {
      x: piece.position.x + kick.x,
      y: piece.position.y + kick.y,
    };

    if (!checkCollision(board, rotatedShape, newPosition)) {
      // 벽 킥 성공 - 위치도 함께 업데이트 필요
      return { shape: rotatedShape, rotation: newRotation };
    }
  }

  return null;
};

// 테트로미노를 보드에 배치
export const placePiece = (board: Board, piece: Tetromino): Board => {
  const newBoard = board.map((row) => [...row]);

  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const boardY = piece.position.y + y;
        const boardX = piece.position.x + x;

        if (
          boardY >= 0 &&
          boardY < BOARD_HEIGHT &&
          boardX >= 0 &&
          boardX < BOARD_WIDTH
        ) {
          newBoard[boardY][boardX] = piece.type;
        }
      }
    }
  }

  return newBoard;
};

// 완성된 라인 찾기
export const findCompletedLines = (board: Board): number[] => {
  const completedLines: number[] = [];

  for (let y = 0; y < BOARD_HEIGHT; y++) {
    if (board[y].every((cell) => cell !== null)) {
      completedLines.push(y);
    }
  }

  return completedLines;
};

// 라인 제거
export const clearLines = (board: Board, lines: number[]): Board => {
  if (lines.length === 0) return board;

  const newBoard = board.filter((_, index) => !lines.includes(index));

  // 위에 빈 라인 추가
  const emptyLines = Array.from({ length: lines.length }, () =>
    Array.from({ length: BOARD_WIDTH }, () => null as CellValue)
  );

  return [...emptyLines, ...newBoard];
};

// 고스트 피스 위치 계산 (하드 드롭 위치)
export const getGhostPosition = (board: Board, piece: Tetromino): Position => {
  let ghostY = piece.position.y;

  while (
    !checkCollision(board, piece.shape, { x: piece.position.x, y: ghostY + 1 })
  ) {
    ghostY++;
  }

  return { x: piece.position.x, y: ghostY };
};

// 점수 계산
export const calculateScore = (
  linesCleared: number,
  level: number,
  combo: number,
  scoreTable: Record<number, number>,
  comboMultiplier: number
): number => {
  if (linesCleared === 0) return 0;

  const baseScore = scoreTable[linesCleared] || 0;
  const levelBonus = baseScore * level;
  const comboBonus = combo > 0 ? combo * comboMultiplier * level : 0;

  return levelBonus + comboBonus;
};

// 게임 속도 계산
export const calculateSpeed = (
  level: number,
  initialSpeed: number,
  speedDecrease: number,
  minSpeed: number
): number => {
  const speed = initialSpeed - (level - 1) * speedDecrease;
  return Math.max(speed, minSpeed);
};

// 보드와 현재 피스를 병합하여 표시용 보드 생성
export const getMergedBoard = (
  board: Board,
  currentPiece: Tetromino | null,
  showGhost: boolean = true
): { board: Board; ghostY: number | null } => {
  const mergedBoard = board.map((row) => [...row]);
  let ghostY: number | null = null;

  if (currentPiece) {
    // 고스트 피스 표시
    if (showGhost) {
      const ghostPos = getGhostPosition(board, currentPiece);
      ghostY = ghostPos.y;
    }

    // 현재 피스 표시
    for (let y = 0; y < currentPiece.shape.length; y++) {
      for (let x = 0; x < currentPiece.shape[y].length; x++) {
        if (currentPiece.shape[y][x]) {
          const boardY = currentPiece.position.y + y;
          const boardX = currentPiece.position.x + x;

          if (
            boardY >= 0 &&
            boardY < BOARD_HEIGHT &&
            boardX >= 0 &&
            boardX < BOARD_WIDTH
          ) {
            mergedBoard[boardY][boardX] = currentPiece.type;
          }
        }
      }
    }
  }

  return { board: mergedBoard, ghostY };
};
