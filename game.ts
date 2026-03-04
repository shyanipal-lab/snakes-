const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
const canvasSize = 400;

let snake = [];
let direction = "RIGHT";
let food = randomFood();
let score = 0;
let level = "easy";
let gameInterval;

function init() {
  snake = [{ x: 9 * box, y: 9 * box }];
  direction = "RIGHT";
  food = randomFood();
  score = 0;
  updateScore();
  clearInterval(gameInterval);
  startGame();
}

function startGame() {
  const speed = level === "easy" ? 150 : 70;
  gameInterval = setInterval(draw, speed);
}

function randomFood() {
  return {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box,
  };
}

function draw() {
  ctx.fillStyle = "#0f0f1a";
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "#00e5ff" : "#8be9fd";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // Draw food
  ctx.fillStyle = "#ff006e";
  ctx.fillRect(food.x, food.y, box, box);

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction === "LEFT") snakeX -= box;
  if (direction === "UP") snakeY -= box;
  if (direction === "RIGHT") snakeX += box;
  if (direction === "DOWN") snakeY += box;

  // Impossible mode randomness
  if (level === "impossible") {
    if (Math.random() < 0.1) {
      const dirs = ["LEFT", "RIGHT", "UP", "DOWN"];
      direction = dirs[Math.floor(Math.random() * 4)];
    }
  }

  // Game Over conditions
  if (
    snakeX < 0 ||
    snakeY < 0 ||
    snakeX >= canvasSize ||
    snakeY >= canvasSize ||
    collision(snakeX, snakeY, snake)
  ) {
    clearInterval(gameInterval);
    alert("Game Over 😈 Score: " + score);
    return;
  }

  const newHead = { x: snakeX, y: snakeY };

  if (snakeX === food.x && snakeY === food.y) {
    score++;
    updateScore();
    food = randomFood();
  } else {
    snake.pop();
  }

  snake.unshift(newHead);
}

function collision(x, y, array) {
  return array.some(segment => segment.x === x && segment.y === y);
}

function updateScore() {
  const scoreEl = document.getElementById("score");
  if (scoreEl) scoreEl.innerText = "Score: " + score;
}

// Keyboard Controls
document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowLeft" && direction !== "RIGHT")
    direction = "LEFT";
  else if (event.key === "ArrowUp" && direction !== "DOWN")
    direction = "UP";
  else if (event.key === "ArrowRight" && direction !== "LEFT")
    direction = "RIGHT";
  else if (event.key === "ArrowDown" && direction !== "UP")
    direction = "DOWN";
});

// On-screen controls
function move(dir) {
  if (dir === "LEFT" && direction !== "RIGHT") direction = "LEFT";
  if (dir === "UP" && direction !== "DOWN") direction = "UP";
  if (dir === "RIGHT" && direction !== "LEFT") direction = "RIGHT";
  if (dir === "DOWN" && direction !== "UP") direction = "DOWN";
}

function setLevel(newLevel) {
  level = newLevel;
  init();
}

function restartGame() {
  init();
}

window.move = move;
window.setLevel = setLevel;
window.restartGame = restartGame;

init();
