import { TetrominoShapes, TetrominoType } from "../types/game";

export const TETROMINOS: TetrominoShapes = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: "#00ffff",
    glowColor: "0 0 8px #00ffff, 0 0 16px rgba(0, 255, 255, 0.5)",
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: "#ffff00",
    glowColor: "0 0 8px #ffff00, 0 0 16px rgba(255, 255, 0, 0.5)",
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: "#bf00ff",
    glowColor: "0 0 8px #bf00ff, 0 0 16px rgba(191, 0, 255, 0.5)",
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: "#00ff88",
    glowColor: "0 0 8px #00ff88, 0 0 16px rgba(0, 255, 136, 0.5)",
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: "#ff0044",
    glowColor: "0 0 8px #ff0044, 0 0 16px rgba(255, 0, 68, 0.5)",
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: "#0088ff",
    glowColor: "0 0 8px #0088ff, 0 0 16px rgba(0, 136, 255, 0.5)",
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: "#ff8800",
    glowColor: "0 0 8px #ff8800, 0 0 16px rgba(255, 136, 0, 0.5)",
  },
};

// 테트로미노 타입 배열
export const TETROMINO_TYPES: TetrominoType[] = [
  "I",
  "O",
  "T",
  "S",
  "Z",
  "J",
  "L",
];

// 랜덤 테트로미노 타입 생성
export const getRandomTetrominoType = (): TetrominoType => {
  return TETROMINO_TYPES[Math.floor(Math.random() * TETROMINO_TYPES.length)];
};

// 7-bag 랜더마이저 (더 공정한 블록 분배)
export const createBag = (): TetrominoType[] => {
  const bag = [...TETROMINO_TYPES];
  // Fisher-Yates 셔플
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
  return bag;
};

// 시계 방향 90도 회전
export const rotateMatrix = (matrix: number[][]): number[][] => {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const rotated: number[][] = [];

  for (let col = 0; col < cols; col++) {
    const newRow: number[] = [];
    for (let row = rows - 1; row >= 0; row--) {
      newRow.push(matrix[row][col]);
    }
    rotated.push(newRow);
  }

  return rotated;
};

// 반시계 방향 90도 회전
export const rotateMatrixCounterClockwise = (
  matrix: number[][]
): number[][] => {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const rotated: number[][] = [];

  for (let col = cols - 1; col >= 0; col--) {
    const newRow: number[] = [];
    for (let row = 0; row < rows; row++) {
      newRow.push(matrix[row][col]);
    }
    rotated.push(newRow);
  }

  return rotated;
};

// SRS (Super Rotation System) 벽 킥 데이터
// J, L, S, T, Z 피스용
export const WALL_KICK_DATA_JLSTZ = {
  "0->1": [
    { x: -1, y: 0 },
    { x: -1, y: -1 },
    { x: 0, y: 2 },
    { x: -1, y: 2 },
  ],
  "1->0": [
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: -2 },
    { x: 1, y: -2 },
  ],
  "1->2": [
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: -2 },
    { x: 1, y: -2 },
  ],
  "2->1": [
    { x: -1, y: 0 },
    { x: -1, y: -1 },
    { x: 0, y: 2 },
    { x: -1, y: 2 },
  ],
  "2->3": [
    { x: 1, y: 0 },
    { x: 1, y: -1 },
    { x: 0, y: 2 },
    { x: 1, y: 2 },
  ],
  "3->2": [
    { x: -1, y: 0 },
    { x: -1, y: 1 },
    { x: 0, y: -2 },
    { x: -1, y: -2 },
  ],
  "3->0": [
    { x: -1, y: 0 },
    { x: -1, y: 1 },
    { x: 0, y: -2 },
    { x: -1, y: -2 },
  ],
  "0->3": [
    { x: 1, y: 0 },
    { x: 1, y: -1 },
    { x: 0, y: 2 },
    { x: 1, y: 2 },
  ],
};

// I 피스용 벽 킥 데이터
export const WALL_KICK_DATA_I = {
  "0->1": [
    { x: -2, y: 0 },
    { x: 1, y: 0 },
    { x: -2, y: 1 },
    { x: 1, y: -2 },
  ],
  "1->0": [
    { x: 2, y: 0 },
    { x: -1, y: 0 },
    { x: 2, y: -1 },
    { x: -1, y: 2 },
  ],
  "1->2": [
    { x: -1, y: 0 },
    { x: 2, y: 0 },
    { x: -1, y: -2 },
    { x: 2, y: 1 },
  ],
  "2->1": [
    { x: 1, y: 0 },
    { x: -2, y: 0 },
    { x: 1, y: 2 },
    { x: -2, y: -1 },
  ],
  "2->3": [
    { x: 2, y: 0 },
    { x: -1, y: 0 },
    { x: 2, y: -1 },
    { x: -1, y: 2 },
  ],
  "3->2": [
    { x: -2, y: 0 },
    { x: 1, y: 0 },
    { x: -2, y: 1 },
    { x: 1, y: -2 },
  ],
  "3->0": [
    { x: 1, y: 0 },
    { x: -2, y: 0 },
    { x: 1, y: 2 },
    { x: -2, y: -1 },
  ],
  "0->3": [
    { x: -1, y: 0 },
    { x: 2, y: 0 },
    { x: -1, y: -2 },
    { x: 2, y: 1 },
  ],
};
