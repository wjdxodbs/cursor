import { useCallback, useEffect, useRef, useState } from 'react';
import { GameState, Tetromino, TetrominoType } from '../types/game';
import {
  COMBO_MULTIPLIER,
  HARD_DROP_SCORE,
  INITIAL_SPEED,
  LINES_PER_LEVEL,
  MIN_SPEED,
  SCORE_TABLE,
  SOFT_DROP_SCORE,
  SPEED_DECREASE_PER_LEVEL,
} from '../utils/constants';
import {
  calculateScore,
  calculateSpeed,
  checkCollision,
  clearLines,
  createEmptyBoard,
  createTetromino,
  findCompletedLines,
  getGhostPosition,
  placePiece,
  tryRotate,
} from '../utils/gameHelpers';
import { createBag } from '../utils/tetrominos';

const QUEUE_SIZE = 4;

interface UseGameLogicReturn extends GameState {
  moveLeft: () => void;
  moveRight: () => void;
  moveDown: () => boolean;
  hardDrop: () => void;
  rotate: (clockwise?: boolean) => void;
  hold: () => void;
  togglePause: () => void;
  restart: () => void;
  ghostPosition: { x: number; y: number } | null;
  currentRotation: number;
  clearingLines: number[];
}

export const useGameLogic = (): UseGameLogicReturn => {
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState<Tetromino | null>(null);
  const [nextPieces, setNextPieces] = useState<TetrominoType[]>([]);
  const [holdPiece, setHoldPiece] = useState<TetrominoType | null>(null);
  const [canHold, setCanHold] = useState(true);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [combo, setCombo] = useState(0);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [clearingLines, setClearingLines] = useState<number[]>([]);
  
  const bagRef = useRef<TetrominoType[]>([]);
  const dropIntervalRef = useRef<number | null>(null);
  
  // 새 피스 가져오기
  const getNextPiece = useCallback((): TetrominoType => {
    if (bagRef.current.length === 0) {
      bagRef.current = createBag();
    }
    return bagRef.current.pop()!;
  }, []);
  
  // 큐 채우기
  const fillQueue = useCallback(() => {
    const queue: TetrominoType[] = [];
    while (queue.length < QUEUE_SIZE) {
      queue.push(getNextPiece());
    }
    return queue;
  }, [getNextPiece]);
  
  // 다음 피스 스폰
  const spawnNextPiece = useCallback(() => {
    setNextPieces(prev => {
      const next = [...prev];
      const nextType = next.shift()!;
      next.push(getNextPiece());
      
      const newPiece = createTetromino(nextType);
      
      // 게임 오버 체크
      if (checkCollision(board, newPiece.shape, newPiece.position)) {
        setIsGameOver(true);
        return prev;
      }
      
      setCurrentPiece(newPiece);
      setCurrentRotation(0);
      setCanHold(true);
      
      return next;
    });
  }, [board, getNextPiece]);
  
  // 피스 고정 (pieceToLock이 주어지면 해당 피스를, 아니면 currentPiece를 고정)
  const lockPiece = useCallback((pieceToLock?: Tetromino) => {
    const piece = pieceToLock || currentPiece;
    if (!piece) return;
    
    const newBoard = placePiece(board, piece);
    const completedLines = findCompletedLines(newBoard);
    
    if (completedLines.length > 0) {
      // 라인 클리어 애니메이션
      setClearingLines(completedLines);
      
      setTimeout(() => {
        const clearedBoard = clearLines(newBoard, completedLines);
        setBoard(clearedBoard);
        setClearingLines([]);
        
        // 점수 계산
        const earnedScore = calculateScore(
          completedLines.length,
          level,
          combo,
          SCORE_TABLE,
          COMBO_MULTIPLIER
        );
        setScore(prev => prev + earnedScore);
        
        // 라인 & 레벨 업데이트
        const newLines = lines + completedLines.length;
        setLines(newLines);
        
        const newLevel = Math.floor(newLines / LINES_PER_LEVEL) + 1;
        if (newLevel > level) {
          setLevel(newLevel);
        }
        
        // 콤보 증가
        setCombo(prev => prev + 1);
        
        // 다음 피스
        setCurrentPiece(null);
        spawnNextPiece();
      }, 300);
    } else {
      setBoard(newBoard);
      setCombo(0);
      setCurrentPiece(null);
      spawnNextPiece();
    }
  }, [board, currentPiece, level, lines, combo, spawnNextPiece]);
  
  // 아래로 이동
  const moveDown = useCallback((): boolean => {
    if (!currentPiece || isGameOver || isPaused) return false;
    
    const newPosition = {
      x: currentPiece.position.x,
      y: currentPiece.position.y + 1,
    };
    
    if (checkCollision(board, currentPiece.shape, newPosition)) {
      lockPiece();
      return false;
    }
    
    setCurrentPiece(prev => prev ? { ...prev, position: newPosition } : null);
    return true;
  }, [board, currentPiece, isGameOver, isPaused, lockPiece]);
  
  // 왼쪽 이동
  const moveLeft = useCallback(() => {
    if (!currentPiece || isGameOver || isPaused) return;
    
    const newPosition = {
      x: currentPiece.position.x - 1,
      y: currentPiece.position.y,
    };
    
    if (!checkCollision(board, currentPiece.shape, newPosition)) {
      setCurrentPiece(prev => prev ? { ...prev, position: newPosition } : null);
    }
  }, [board, currentPiece, isGameOver, isPaused]);
  
  // 오른쪽 이동
  const moveRight = useCallback(() => {
    if (!currentPiece || isGameOver || isPaused) return;
    
    const newPosition = {
      x: currentPiece.position.x + 1,
      y: currentPiece.position.y,
    };
    
    if (!checkCollision(board, currentPiece.shape, newPosition)) {
      setCurrentPiece(prev => prev ? { ...prev, position: newPosition } : null);
    }
  }, [board, currentPiece, isGameOver, isPaused]);
  
  // 하드 드롭
  const hardDrop = useCallback(() => {
    if (!currentPiece || isGameOver || isPaused) return;
    
    const ghostPos = getGhostPosition(board, currentPiece);
    const dropDistance = ghostPos.y - currentPiece.position.y;
    
    // 점수 추가
    setScore(prev => prev + dropDistance * HARD_DROP_SCORE);
    
    // 고스트 위치로 이동한 피스를 직접 고정
    const droppedPiece: Tetromino = {
      ...currentPiece,
      position: ghostPos,
    };
    
    lockPiece(droppedPiece);
  }, [board, currentPiece, isGameOver, isPaused, lockPiece]);
  
  // 회전
  const rotate = useCallback((clockwise: boolean = true) => {
    if (!currentPiece || isGameOver || isPaused) return;
    
    const result = tryRotate(board, currentPiece, currentRotation, clockwise);
    
    if (result) {
      // 벽 킥 위치 재계산
      let newPosition = currentPiece.position;
      
      // 벽 킥 시도를 다시 해서 위치 찾기
      if (checkCollision(board, result.shape, currentPiece.position)) {
        const kickData = currentPiece.type === 'I' 
          ? { '0->1': [{ x: -2, y: 0 }, { x: 1, y: 0 }, { x: -2, y: 1 }, { x: 1, y: -2 }],
              '1->0': [{ x: 2, y: 0 }, { x: -1, y: 0 }, { x: 2, y: -1 }, { x: -1, y: 2 }],
              '1->2': [{ x: -1, y: 0 }, { x: 2, y: 0 }, { x: -1, y: -2 }, { x: 2, y: 1 }],
              '2->1': [{ x: 1, y: 0 }, { x: -2, y: 0 }, { x: 1, y: 2 }, { x: -2, y: -1 }],
              '2->3': [{ x: 2, y: 0 }, { x: -1, y: 0 }, { x: 2, y: -1 }, { x: -1, y: 2 }],
              '3->2': [{ x: -2, y: 0 }, { x: 1, y: 0 }, { x: -2, y: 1 }, { x: 1, y: -2 }],
              '3->0': [{ x: 1, y: 0 }, { x: -2, y: 0 }, { x: 1, y: 2 }, { x: -2, y: -1 }],
              '0->3': [{ x: -1, y: 0 }, { x: 2, y: 0 }, { x: -1, y: -2 }, { x: 2, y: 1 }] }
          : { '0->1': [{ x: -1, y: 0 }, { x: -1, y: -1 }, { x: 0, y: 2 }, { x: -1, y: 2 }],
              '1->0': [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: -2 }, { x: 1, y: -2 }],
              '1->2': [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: -2 }, { x: 1, y: -2 }],
              '2->1': [{ x: -1, y: 0 }, { x: -1, y: -1 }, { x: 0, y: 2 }, { x: -1, y: 2 }],
              '2->3': [{ x: 1, y: 0 }, { x: 1, y: -1 }, { x: 0, y: 2 }, { x: 1, y: 2 }],
              '3->2': [{ x: -1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: -2 }, { x: -1, y: -2 }],
              '3->0': [{ x: -1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: -2 }, { x: -1, y: -2 }],
              '0->3': [{ x: 1, y: 0 }, { x: 1, y: -1 }, { x: 0, y: 2 }, { x: 1, y: 2 }] };
        
        const kickKey = `${currentRotation}->${result.rotation}` as keyof typeof kickData;
        const kicks = kickData[kickKey] || [];
        
        for (const kick of kicks) {
          const testPosition = {
            x: currentPiece.position.x + kick.x,
            y: currentPiece.position.y + kick.y,
          };
          
          if (!checkCollision(board, result.shape, testPosition)) {
            newPosition = testPosition;
            break;
          }
        }
      }
      
      setCurrentPiece(prev => prev ? {
        ...prev,
        shape: result.shape,
        position: newPosition,
      } : null);
      setCurrentRotation(result.rotation);
    }
  }, [board, currentPiece, currentRotation, isGameOver, isPaused]);
  
  // 홀드
  const hold = useCallback(() => {
    if (!currentPiece || !canHold || isGameOver || isPaused) return;
    
    const currentType = currentPiece.type;
    
    if (holdPiece) {
      // 홀드된 피스와 교환
      const newPiece = createTetromino(holdPiece);
      setCurrentPiece(newPiece);
      setCurrentRotation(0);
    } else {
      // 다음 피스 스폰
      setCurrentPiece(null);
      spawnNextPiece();
    }
    
    setHoldPiece(currentType);
    setCanHold(false);
  }, [currentPiece, canHold, holdPiece, isGameOver, isPaused, spawnNextPiece]);
  
  // 일시정지 토글
  const togglePause = useCallback(() => {
    if (isGameOver) return;
    setIsPaused(prev => !prev);
  }, [isGameOver]);
  
  // 재시작
  const restart = useCallback(() => {
    bagRef.current = [];
    setBoard(createEmptyBoard());
    setCurrentPiece(null);
    setNextPieces(fillQueue());
    setHoldPiece(null);
    setCanHold(true);
    setScore(0);
    setLevel(1);
    setLines(0);
    setIsGameOver(false);
    setIsPaused(false);
    setCombo(0);
    setCurrentRotation(0);
    setClearingLines([]);
  }, [fillQueue]);
  
  // 고스트 위치 계산
  const ghostPosition = currentPiece && !isGameOver
    ? getGhostPosition(board, currentPiece)
    : null;
  
  // 게임 초기화
  useEffect(() => {
    const queue = fillQueue();
    setNextPieces(queue);
  }, [fillQueue]);
  
  // 첫 피스 스폰
  useEffect(() => {
    if (nextPieces.length > 0 && !currentPiece && !isGameOver) {
      spawnNextPiece();
    }
  }, [nextPieces, currentPiece, isGameOver, spawnNextPiece]);
  
  // 자동 드롭
  useEffect(() => {
    if (isGameOver || isPaused || !currentPiece || clearingLines.length > 0) {
      if (dropIntervalRef.current) {
        clearInterval(dropIntervalRef.current);
        dropIntervalRef.current = null;
      }
      return;
    }
    
    const speed = calculateSpeed(level, INITIAL_SPEED, SPEED_DECREASE_PER_LEVEL, MIN_SPEED);
    
    dropIntervalRef.current = window.setInterval(() => {
      moveDown();
    }, speed);
    
    return () => {
      if (dropIntervalRef.current) {
        clearInterval(dropIntervalRef.current);
      }
    };
  }, [level, isGameOver, isPaused, currentPiece, clearingLines.length, moveDown]);
  
  // 키보드 입력
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameOver) {
        if (e.key === 'Enter' || e.key === ' ') {
          restart();
        }
        return;
      }
      
      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          moveLeft();
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          moveRight();
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          if (moveDown()) {
            setScore(prev => prev + SOFT_DROP_SCORE);
          }
          break;
        case 'ArrowUp':
        case 'w':
        case 'W':
        case 'x':
        case 'X':
          e.preventDefault();
          rotate(true);
          break;
        case 'z':
        case 'Z':
          e.preventDefault();
          rotate(false);
          break;
        case ' ':
          e.preventDefault();
          hardDrop();
          break;
        case 'c':
        case 'C':
        case 'Shift':
          e.preventDefault();
          hold();
          break;
        case 'p':
        case 'P':
        case 'Escape':
          e.preventDefault();
          togglePause();
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          restart();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOver, isPaused, moveLeft, moveRight, moveDown, rotate, hardDrop, hold, togglePause, restart]);
  
  return {
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
    moveLeft,
    moveRight,
    moveDown,
    hardDrop,
    rotate,
    hold,
    togglePause,
    restart,
    ghostPosition,
    currentRotation,
    clearingLines,
  };
};

