import "./styles.css";

const app = document.getElementById("app")!;

app.innerHTML = `
  <div class="glass-container">
    <h1>Modern Snake 🐍</h1>
    <canvas id="game" width="400" height="400"></canvas>
    <p id="score">Score: 0</p>
    <button id="restart">Restart</button>
  </div>
`;

const canvas = document.getElementById("game") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

let snake = [{ x: 200, y: 200 }];
let direction = "RIGHT";
let food = randomFood();
let score = 0;
let speed = 120;
let gameOver = false;

const scoreEl = document.getElementById("score")!;
const restartBtn = document.getElementById("restart")!;

function randomFood() {
  return {
    x: Math.floor(Math.random() * 20) * 20,
    y: Math.floor(Math.random() * 20) * 20
  };
}

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
    alert(`Game Over! Final Score: ${score}`);
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreEl.innerText = `Score: ${score}`;
    food = randomFood();
    speed = Math.max(60, speed - 3);
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

document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

restartBtn.onclick = () => {
  snake = [{ x: 200, y: 200 }];
  direction = "RIGHT";
  food = randomFood();
  score = 0;
  speed = 120;
  gameOver = false;
  scoreEl.innerText = "Score: 0";
  gameLoop();
};

gameLoop();
