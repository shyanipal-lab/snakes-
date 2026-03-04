import "./styles.css";

const app = document.getElementById("app")!;

app.innerHTML = `
  <div class="glass-container">
    <h1>Modern Snake 🐍</h1>

    <div class="top-bar">
      <div class="levels">
        <button id="easy" class="active">Easy</button>
        <button id="hard">Impossible</button>
      </div>

      <select id="theme">
        <option value="cyber">Cyberpunk</option>
        <option value="minimal">Minimal</option>
        <option value="retro">Retro</option>
      </select>
    </div>

    <div class="game-layout">
      
      <div class="left-panel">
        <button id="restart" class="restart-btn">🔄 Restart</button>
        <p id="score">Score: 0</p>
        <p id="highscore">High Score: 0</p>
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
let speed = 200;
let gameOver = false;
let level = "easy";
let theme = "cyber";

let particles: any[] = [];

const scoreEl = document.getElementById("score")!;
const highScoreEl = document.getElementById("highscore")!;
const restartBtn = document.getElementById("restart")!;
const easyBtn = document.getElementById("easy")!;
const hardBtn = document.getElementById("hard")!;
const themeSelect = document.getElementById("theme") as HTMLSelectElement;

let highScore = Number(localStorage.getItem("snakeHighScore")) || 0;
highScoreEl.innerText = `High Score: ${highScore}`;

function playEatSound() {
  const audio = new Audio(
    "https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.wav"
  );
  audio.volume = 0.3;
  audio.play();
}

function playDeathSound() {
  const audio = new Audio(
    "https://assets.mixkit.co/sfx/preview/mixkit-arcade-retro-game-over-213.wav"
  );
  audio.volume = 0.4;
  audio.play();
}

function randomFood() {
  return {
    x: Math.floor(Math.random() * 20) * 20,
    y: Math.floor(Math.random() * 20) * 20
  };
}

function getThemeColors() {
  if (theme === "minimal") {
    return { snake: "#111", glow: "#999", food: "#444", bg: "#f5f5f5" };
  }
  if (theme === "retro") {
    return { snake: "#39ff14", glow: "#39ff14", food: "#ff073a", bg: "#000" };
  }
  return { snake: "#00e5ff", glow: "#00e5ff", food: "#ff4081", bg: "#000" };
}
themeSelect.onchange = () => {
  theme = themeSelect.value;
  applyTheme(theme);
};

function applyTheme(theme: string) {
  document.body.classList.remove("cyber", "minimal", "retro");
  document.body.classList.add(theme);
}
};

function setLevel(newLevel: string) {
  level = newLevel;
  speed = level === "easy" ? 200 : 70;
  easyBtn.classList.toggle("active", level === "easy");
  hardBtn.classList.toggle("active", level === "hard");
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
    triggerExplosion(head.x, head.y);
    playDeathSound();
    endGame();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreEl.innerText = `Score: ${score}`;
    food = randomFood();
    playEatSound();
  } else {
    snake.pop();
  }
}

function draw() {
  const colors = getThemeColors();

  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, 400, 400);

  snake.forEach((part, index) => {
    ctx.shadowBlur = 15;
    ctx.shadowColor = colors.glow;
    ctx.fillStyle = index === 0 ? "#fff" : colors.snake;
    ctx.fillRect(part.x, part.y, 18, 18);
  });

  ctx.shadowBlur = 0;

  ctx.fillStyle = colors.food;
  ctx.fillRect(food.x, food.y, 18, 18);

  drawParticles();
}

function triggerExplosion(x: number, y: number) {
  for (let i = 0; i < 25; i++) {
    particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 6,
      life: 30
    });
  }
}

function drawParticles() {
  particles.forEach((p, i) => {
    ctx.fillStyle = "#ff4081";
    ctx.fillRect(p.x, p.y, 4, 4);
    p.x += p.vx;
    p.y += p.vy;
    p.life--;
    if (p.life <= 0) particles.splice(i, 1);
  });
}

function gameLoop() {
  moveSnake();
  draw();
  if (!gameOver) setTimeout(gameLoop, speed);
}

function endGame() {
  gameOver = true;

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("snakeHighScore", String(highScore));
    highScoreEl.innerText = `High Score: ${highScore}`;
  }

  setTimeout(() => {
    alert(`Game Over! Score: ${score}`);
  }, 300);
}

function restartGame() {
  snake = [{ x: 200, y: 200 }];
  direction = "RIGHT";
  food = randomFood();
  score = 0;
  scoreEl.innerText = "Score: 0";
  gameOver = false;
  particles = [];
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
    btn.classList.add("pressed");
    setTimeout(() => btn.classList.remove("pressed"), 150);
    direction = btn.getAttribute("data-dir")!;
  });
});

gameLoop();
