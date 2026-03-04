import "./styles.css";

const app = document.getElementById("app")!;

app.innerHTML = `
  <div class="glass-container">
    <h1>Modern Snake 🐍</h1>

    <div class="levels">
      <button id="easy" class="active">Easy</button>
      <button id="hard">Impossible</button>
    </div>

    <div class="game-layout">
      
      <div class="left-panel">
        <button id="restart" class="restart-btn">🔄 Restart</button>
        <p id="score">Score: 0</p>
      </div>

      <canvas id="game" width="400" height="400"></canvas>

      <div class="right-panel">
        <button data-dir="UP">↑</button>
        <button data-dir="DOWN">↓</button>
        <button data-dir="LEFT">←</button>
        <button data-dir="RIGHT">→</button>
      </div>

    </div>
  </div>
`;

const canvas = document.getElementById("game") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

let snake = [{ x: 200, y: 200 }];
let direction = "RIGHT";
let food = randomFood();
let score = 0;
let speed = 200; // slower easy
let gameOver = false;
let level = "easy";

const scoreEl = document.getElementById("score")!;
const restartBtn = document.getElementById("restart")!;
const easyBtn = document.getElementById("easy")!;
const hardBtn = document.getElementById("hard")!;

function randomFood() {
  return {
    x: Math.floor(Math.random() * 20) * 20,
    y: Math.floor(Math.random() * 20) * 20
  };
}

function setLevel(newLevel: string) {
  level = newLevel;
  speed = level === "easy" ? 200 : 70;

  easyBtn.classList.remove("active");
  hardBtn.classList.remove("active");

  if (level === "easy") easyBtn.classList.add("active");
  if (level === "hard") hardBtn.classList.add("active");

  restartGame();
}

easyBtn.onclick = () => setLevel("easy");
hardBtn.onclick = () => setLevel("hard");

function moveSnake() {
  if (gameOver) return;

  const head = { ...snake[0] };

  if (direction === "UP") head.y -= 20;
  if (direction === "DOWN") head.y += 20;
  if (direction === "LEFT") head.x -= 20;
  if (direction === "RIGHT") head.x += 20;

  if (
    head.x < 0 ||
    head.y < 0 ||
    head.x >= 400 ||
    head.y >= 400 ||
    snake.some(s => s.x === head.x && s.y === head.y)
  ) {
    gameOver = true;
    alert(`Game Over! Score: ${score}`);
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreEl.innerText = `Score: ${score}`;
    food = randomFood();

    if (level === "easy") {
      speed = Math.max(150, speed - 5); // still slower overall
    }
  } else {
    snake.pop();
  }
}

function draw() {
  ctx.clearRect(0, 0, 400, 400);

  ctx.fillStyle = "#00e5ff";
  snake.forEach(part => {
    ctx.fillRect(part.x, part.y, 18, 18);
  });

  ctx.fillStyle = "#ff4081";
  ctx.fillRect(food.x, food.y, 18, 18);
}

function gameLoop() {
  moveSnake();
  draw();
  if (!gameOver) {
    setTimeout(gameLoop, speed);
  }
}

function restartGame() {
  snake = [{ x: 200, y: 200 }];
  direction = "RIGHT";
  food = randomFood();
  score = 0;
  scoreEl.innerText = "Score: 0";
  gameOver = false;
  gameLoop();
}

restartBtn.onclick = restartGame;

document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

document.querySelectorAll(".right-panel button").forEach(btn => {
  btn.addEventListener("click", () => {
    const dir = btn.getAttribute("data-dir")!;
    if (dir === "UP" && direction !== "DOWN") direction = "UP";
    if (dir === "DOWN" && direction !== "UP") direction = "DOWN";
    if (dir === "LEFT" && direction !== "RIGHT") direction = "LEFT";
    if (dir === "RIGHT" && direction !== "LEFT") direction = "RIGHT";
  });
});

gameLoop();
