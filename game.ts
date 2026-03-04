* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Inter, sans-serif;
}

body {
  background: radial-gradient(circle at top, #0f0f1a, #000);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.glass-container {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  padding: 30px;
  border-radius: 24px;
  box-shadow: 0 0 60px rgba(0, 229, 255, 0.2);
  max-width: 900px;
  width: 95%;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  font-weight: 600;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
}

.levels button,
select {
  padding: 8px 14px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 600;
}

.levels button {
  margin-right: 10px;
  background: #1f1f2e;
  color: white;
}

.levels button.active {
  background: #00e5ff;
  color: black;
}

.game-layout {
  display: grid;
  grid-template-columns: 150px 400px 150px;
  align-items: center;
  gap: 20px;
}

.left-panel {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.restart-btn {
  background: #ff4081;
  color: white;
  padding: 10px;
  border-radius: 10px;
  border: none;
  font-weight: bold;
  cursor: pointer;
}

canvas {
  background: rgba(0, 0, 0, 0.7);
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.1);
}

/* PROPER D-PAD LAYOUT */
.right-panel {
  display: grid;
  grid-template-areas:
    ". up ."
    "left . right"
    ". down .";
  gap: 10px;
  justify-content: center;
}

.right-panel button {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  border: none;
  font-size: 22px;
  font-weight: bold;
  cursor: pointer;
  background: #00e5ff;
  color: black;
  transition: all 0.15s ease;
}

.right-panel button[data-dir="UP"] {
  grid-area: up;
}

.right-panel button[data-dir="DOWN"] {
  grid-area: down;
}

.right-panel button[data-dir="LEFT"] {
  grid-area: left;
}

.right-panel button[data-dir="RIGHT"] {
  grid-area: right;
}

.right-panel button:active {
  transform: scale(0.9);
  opacity: 0.7;
}

/* 📱 RESPONSIVE */
@media (max-width: 900px) {
  .game-layout {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .left-panel {
    align-items: center;
  }

  .right-panel {
    margin-top: 20px;
  }

  canvas {
    width: 90vw;
    height: 90vw;
    max-width: 400px;
  }
}
