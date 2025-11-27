// 게임 상태
let gameState = {
  grid: [],
  score: 0,
  highScore: localStorage.getItem("fruitBoxHighScore") || 0,
  timeRemaining: 120,
  gameRunning: false,
  timerInterval: null,
  startTime: null,
};

// 드래그 상태
let dragState = {
  isDragging: false,
  startX: 0,
  startY: 0,
  currentX: 0,
  currentY: 0,
  selectedApples: [],
};

// DOM 요소
const gameBoard = document.getElementById("gameBoard");
const selectionBox = document.getElementById("selectionBox");
const scoreElement = document.getElementById("score");
const timerElement = document.getElementById("timer");
const timerBar = document.getElementById("timerBar");
const highScoreElement = document.getElementById("highScore");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const gameOverModal = document.getElementById("gameOverModal");
const finalScoreElement = document.getElementById("finalScore");
const timeInfoElement = document.getElementById("timeInfo");
const playAgainBtn = document.getElementById("playAgainBtn");

// 초기화
function init() {
  highScoreElement.textContent = gameState.highScore;
  createGrid();

  // 이벤트 리스너
  startBtn.addEventListener("click", startGame);
  resetBtn.addEventListener("click", resetGame);
  playAgainBtn.addEventListener("click", () => {
    gameOverModal.classList.add("hidden");
    resetGame();
  });

  // 드래그 이벤트
  gameBoard.addEventListener("mousedown", handleMouseDown);
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
}

// 13x13 그리드 생성 (169개 사과)
function createGrid() {
  gameBoard.innerHTML = "";
  gameState.grid = [];

  for (let row = 0; row < 13; row++) {
    for (let col = 0; col < 13; col++) {
      const value = Math.floor(Math.random() * 9) + 1; // 1~9
      const apple = document.createElement("div");
      apple.className = "apple";

      // 숫자를 담을 span 요소 생성 (z-index를 위해)
      const numberSpan = document.createElement("span");
      numberSpan.textContent = value;
      numberSpan.style.position = "relative";
      numberSpan.style.zIndex = "1";
      apple.appendChild(numberSpan);

      apple.dataset.row = row;
      apple.dataset.col = col;
      apple.dataset.value = value;
      gameBoard.appendChild(apple);

      gameState.grid.push({
        element: apple,
        value: value,
        row: row,
        col: col,
        removed: false,
      });
    }
  }
}

// 게임 시작
function startGame() {
  gameState.gameRunning = true;
  gameState.timeRemaining = 120;
  gameState.score = 0;
  gameState.startTime = Date.now();

  startBtn.style.display = "none";
  resetBtn.style.display = "inline-block";

  updateScore();
  startTimer();
}

// 타이머 시작
function startTimer() {
  gameState.timerInterval = setInterval(() => {
    gameState.timeRemaining -= 0.1;

    if (gameState.timeRemaining <= 0) {
      gameState.timeRemaining = 0;
      endGame();
    }

    updateTimer();
  }, 100);
}

// 타이머 업데이트
function updateTimer() {
  const time = Math.max(0, gameState.timeRemaining).toFixed(1);
  timerElement.textContent = time;

  const percentage = (gameState.timeRemaining / 120) * 100;
  timerBar.style.width = percentage + "%";

  // 색상 변경
  timerBar.className = "timer-bar";
  if (percentage < 20) {
    timerBar.classList.add("danger");
  } else if (percentage < 50) {
    timerBar.classList.add("warning");
  }
}

// 점수 업데이트
function updateScore() {
  scoreElement.textContent = gameState.score;

  if (gameState.score > gameState.highScore) {
    gameState.highScore = gameState.score;
    localStorage.setItem("fruitBoxHighScore", gameState.highScore);
    highScoreElement.textContent = gameState.highScore;
  }
}

// 마우스 다운
function handleMouseDown(e) {
  if (!gameState.gameRunning) return;

  // 사과 또는 사과의 자식 요소(span)를 클릭했는지 확인
  let target = e.target;
  if (target.tagName === "SPAN") {
    target = target.parentElement;
  }

  if (target.classList.contains("apple") && !target.dataset.removed) {
    dragState.isDragging = true;
    const rect = gameBoard.getBoundingClientRect();
    dragState.startX = e.clientX - rect.left;
    dragState.startY = e.clientY - rect.top;
    dragState.currentX = dragState.startX;
    dragState.currentY = dragState.startY;

    updateSelectionBox();
    updateSelectedApples(); // 드래그 시작 시 바로 선택 업데이트
  }
}

// 마우스 이동
function handleMouseMove(e) {
  if (!dragState.isDragging || !gameState.gameRunning) return;

  const rect = gameBoard.getBoundingClientRect();
  dragState.currentX = e.clientX - rect.left;
  dragState.currentY = e.clientY - rect.top;

  updateSelectionBox();
  updateSelectedApples();
}

// 마우스 업
function handleMouseUp(e) {
  if (!dragState.isDragging || !gameState.gameRunning) return;

  // 합이 10이면 사과 제거
  const sum = dragState.selectedApples.reduce(
    (acc, apple) => acc + apple.value,
    0
  );
  if (sum === 10) {
    removeSelectedApples();
  }

  // 선택 초기화
  dragState.selectedApples.forEach((apple) => {
    if (!apple.removed) {
      apple.element.classList.remove("selected");
    }
  });

  dragState.isDragging = false;
  dragState.selectedApples = [];
  selectionBox.style.display = "none";
}

// 선택 박스 업데이트
function updateSelectionBox() {
  const x = Math.min(dragState.startX, dragState.currentX);
  const y = Math.min(dragState.startY, dragState.currentY);
  const width = Math.abs(dragState.currentX - dragState.startX);
  const height = Math.abs(dragState.currentY - dragState.startY);

  // game-board의 padding (15px)을 더해줍니다
  selectionBox.style.left = x + 15 + "px";
  selectionBox.style.top = y + 15 + "px";
  selectionBox.style.width = width + "px";
  selectionBox.style.height = height + "px";
  selectionBox.style.display = "block";
}

// 선택된 사과 업데이트
function updateSelectedApples() {
  const x1 = Math.min(dragState.startX, dragState.currentX);
  const y1 = Math.min(dragState.startY, dragState.currentY);
  const x2 = Math.max(dragState.startX, dragState.currentX);
  const y2 = Math.max(dragState.startY, dragState.currentY);

  // 이전 선택 해제
  dragState.selectedApples.forEach((apple) => {
    if (!apple.removed) {
      apple.element.classList.remove("selected");
    }
  });
  dragState.selectedApples = [];

  // 새로운 선택
  gameState.grid.forEach((apple) => {
    if (apple.removed) return;

    const rect = apple.element.getBoundingClientRect();
    const boardRect = gameBoard.getBoundingClientRect();
    const appleX1 = rect.left - boardRect.left;
    const appleY1 = rect.top - boardRect.top;
    const appleX2 = appleX1 + rect.width;
    const appleY2 = appleY1 + rect.height;

    // 겹치는지 확인
    if (!(x2 < appleX1 || x1 > appleX2 || y2 < appleY1 || y1 > appleY2)) {
      dragState.selectedApples.push(apple);
      apple.element.classList.add("selected");
    }
  });

  // 합이 10인지 확인
  const sum = dragState.selectedApples.reduce(
    (acc, apple) => acc + apple.value,
    0
  );
  if (sum === 10) {
    selectionBox.classList.add("valid");
  } else {
    selectionBox.classList.remove("valid");
  }
}

// 선택된 사과 제거
function removeSelectedApples() {
  dragState.selectedApples.forEach((apple) => {
    apple.removed = true;
    apple.element.classList.add("removing");

    setTimeout(() => {
      apple.element.style.visibility = "hidden";
    }, 300);
  });

  gameState.score += dragState.selectedApples.length;
  updateScore();

  // 모든 사과를 제거했는지 확인
  const remainingApples = gameState.grid.filter(
    (apple) => !apple.removed
  ).length;
  if (remainingApples === 0) {
    endGame(true);
  }

  // 169개 만점 체크
  if (gameState.score === 169) {
    endGame(true);
  }
}

// 게임 종료
function endGame(allCleared = false) {
  gameState.gameRunning = false;
  clearInterval(gameState.timerInterval);

  finalScoreElement.textContent = gameState.score;

  if (allCleared) {
    const timeTaken = (120 - gameState.timeRemaining).toFixed(1);
    timeInfoElement.textContent = `🏆 완벽! 모든 사과를 제거했습니다! (${timeTaken}초 소요)`;
    timeInfoElement.style.color = "#4CAF50";
  } else if (gameState.score === 169) {
    timeInfoElement.textContent = "🎉 축하합니다! 만점 달성!";
    timeInfoElement.style.color = "#4CAF50";
  } else {
    timeInfoElement.textContent = "시간 종료!";
    timeInfoElement.style.color = "#666";
  }

  gameOverModal.classList.remove("hidden");
}

// 게임 리셋
function resetGame() {
  if (gameState.timerInterval) {
    clearInterval(gameState.timerInterval);
  }

  gameState.gameRunning = false;
  gameState.score = 0;
  gameState.timeRemaining = 120;

  startBtn.style.display = "inline-block";
  resetBtn.style.display = "none";

  createGrid();
  updateScore();
  updateTimer();

  dragState.isDragging = false;
  dragState.selectedApples = [];
  selectionBox.style.display = "none";
}

// 초기화 실행
init();
