const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const BIRD_SIZE = 40;
let birdY = canvas.height / 2;
let birdX = 100;
let birdVelocity = 0;
const gravity = 0.09;
const jumpStrength = -4;

const pipeWidth = 60;
const pipeGap = 400;
let pipes = [];
const pipeSpeed = 2;
let frameCount = 0;
let score = 0;

const scoreEl = document.getElementById("score");
const restartBtn = document.getElementById("restartBtn");

// Load bird image
let birdImg = new Image();
birdImg.src = "bird.png"; // <-- swap this image easily

// Controls
document.addEventListener("keydown", () => {
  birdVelocity = jumpStrength;
});
document.addEventListener("click", () => {
  birdVelocity = jumpStrength;
});

// Restart button
restartBtn.addEventListener("click", () => {
  resetGame();
});

// Create pipe
function addPipe() {
  let pipeHeight = Math.random() * (canvas.height - pipeGap - 100) + 50;
  pipes.push({ x: canvas.width, top: pipeHeight, bottom: pipeHeight + pipeGap });
}

// Reset game
function resetGame() {
  birdY = canvas.height / 2;
  birdVelocity = 0;
  pipes = [];
  frameCount = 0;
  score = 0;
  scoreEl.textContent = "Score: 0";
}

// Game loop
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Bird physics
  birdVelocity += gravity;
  birdY += birdVelocity;

  // Draw bird
  ctx.drawImage(birdImg, birdX, birdY, BIRD_SIZE, BIRD_SIZE);

  // Pipes
  if (frameCount % 90 === 0) addPipe();
  pipes.forEach((pipe, index) => {
    pipe.x -= pipeSpeed;

    // Draw pipes
    ctx.fillStyle = "#2E8B57";
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
    ctx.fillRect(pipe.x, pipe.bottom, pipeWidth, canvas.height - pipe.bottom);

    // Collision
    if (
      birdX + BIRD_SIZE > pipe.x &&
      birdX < pipe.x + pipeWidth &&
      (birdY < pipe.top || birdY + BIRD_SIZE > pipe.bottom)
    ) {
      resetGame();
    }

    // Score
    if (pipe.x + pipeWidth === birdX) {
      score++;
      scoreEl.textContent = "Score: " + score;
    }
  });

  // Floor/ceiling collision
  if (birdY + BIRD_SIZE > canvas.height || birdY < 0) resetGame();

  frameCount++;
  requestAnimationFrame(update);
}

// Start game when image loads
birdImg.onload = () => update();

