// 게임 보드 크기
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

// 셀 크기 (픽셀)
export const CELL_SIZE = 30;

// 초기 게임 속도 (ms)
export const INITIAL_SPEED = 800;

// 레벨당 속도 감소량 (ms) - 레벨업마다 더 빨라짐
export const SPEED_DECREASE_PER_LEVEL = 70;

// 최소 속도 (ms)
export const MIN_SPEED = 50;

// 레벨업에 필요한 라인 수 - 5줄마다 레벨업
export const LINES_PER_LEVEL = 5;

// 점수 계산 (라인 수에 따른 기본 점수)
export const SCORE_TABLE: Record<number, number> = {
  1: 100,
  2: 300,
  3: 500,
  4: 800, // 테트리스!
};

// 콤보 보너스 배수
export const COMBO_MULTIPLIER = 50;

// 하드 드롭 점수 (한 칸당)
export const HARD_DROP_SCORE = 2;

// 소프트 드롭 점수 (한 칸당)
export const SOFT_DROP_SCORE = 1;

// 키 반복 딜레이 (ms)
export const KEY_REPEAT_DELAY = 170;
export const KEY_REPEAT_INTERVAL = 50;

// 네온 컬러 테마
export const NEON_COLORS = {
  background: "#0a0a0f",
  primary: "#ff00ff", // 핫핑크
  secondary: "#00ffff", // 시안
  accent: "#bf00ff", // 퍼플
  success: "#00ff88", // 네온 그린
  warning: "#ffff00", // 옐로우
  danger: "#ff0044", // 레드
  grid: "rgba(255, 0, 255, 0.1)",
  gridLine: "rgba(0, 255, 255, 0.15)",
};
