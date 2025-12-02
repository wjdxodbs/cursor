export type TetrominoType = "I" | "O" | "T" | "S" | "Z" | "J" | "L";

export type CellValue = TetrominoType | null;

export type Board = CellValue[][];

export interface Position {
  x: number;
  y: number;
}

export interface Tetromino {
  shape: number[][];
  type: TetrominoType;
  position: Position;
}

export interface GameState {
  board: Board;
  currentPiece: Tetromino | null;
  nextPieces: TetrominoType[];
  holdPiece: TetrominoType | null;
  canHold: boolean;
  score: number;
  level: number;
  lines: number;
  isGameOver: boolean;
  isPaused: boolean;
  combo: number;
}

export interface TetrominoData {
  shape: number[][];
  color: string;
  glowColor: string;
}

export type TetrominoShapes = Record<TetrominoType, TetrominoData>;
