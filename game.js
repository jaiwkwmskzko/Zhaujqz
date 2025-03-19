const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
const birdWidth = 20;
const birdHeight = 20;
let birdX = 50;
let birdY = canvas.height / 2;
let birdVelocity = 0;
let gravity = 0.6;
let lift = -15;
let isFlapping = false;

const pipeWidth = 50;
let pipeGap = 100;
let pipes = [];
let pipeSpeed = 2;
let score = 0;
let gameOver = false;

// Event listener for bird flap
document.addEventListener('keydown', () => {
    if (gameOver) return;
    isFlapping = true;
});

// Bird object
function Bird() {
    birdVelocity += gravity;
    birdY += birdVelocity;

    if (birdY > canvas.height - birdHeight) {
        birdY = canvas.height - birdHeight;
        birdVelocity = 0;
    }

    if (birdY < 0) {
        birdY = 0;
        birdVelocity = 0;
    }

    if (isFlapping) {
        birdVelocity = lift;
        isFlapping = false;
    }
}

// Pipe object
function Pipe() {
    const pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap));
    pipes.push({ x: canvas.width, height: pipeHeight });
}

function drawPipes() {
    pipes.forEach((pipe, index) => {
        ctx.fillStyle = 'green';
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.height); // Top pipe
        ctx.fillRect(pipe.x, pipe.height + pipeGap, pipeWidth, canvas.height); // Bottom pipe

        pipe.x -= pipeSpeed;

        if (pipe.x + pipeWidth <= 0) {
            pipes.splice(index, 1);
            score++;
        }

        // Collision detection with pipes
        if (
            birdX + birdWidth > pipe.x &&
            birdX < pipe.x + pipeWidth &&
            (birdY < pipe.height || birdY + birdHeight > pipe.height + pipeGap)
        ) {
            gameOver = true;
        }
    });
}

// Draw the bird
function drawBird() {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(birdX, birdY, birdWidth, birdHeight);
}

// Draw score
function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
    ctx.fillText('Score: ' + score, 10, 20);
}

// Game over screen
function drawGameOver() {
    ctx.fillStyle = 'black';
    ctx.font = '30px Arial';
    ctx.fillText('Game Over', 90, canvas.height / 2);
    ctx.font = '20px Arial';
    ctx.fillText('Press F5 to Restart', 90, canvas.height / 2 + 30);
}

// Main game loop
function gameLoop() {
    if (gameOver) {
        drawGameOver();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    Bird();
    drawBird();
    drawPipes();
    drawScore();

    if (Math.random() < 0.02) {
        Pipe();
    }

    requestAnimationFrame(gameLoop); // Repeat the game loop
}

// Start the game loop
gameLoop();
