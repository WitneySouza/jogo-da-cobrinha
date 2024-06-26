document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const scoreElement = document.getElementById("score");
    const startGameButton = document.getElementById("startGame");
    const controlButtons = {
        left: document.getElementById("left"),
        up: document.getElementById("up"),
        right: document.getElementById("right"),
        down: document.getElementById("down")
    };
    const eatSound = document.getElementById("eatSound");
    const gameOverSound = document.getElementById("gameOverSound");
    const backgroundMusic = document.getElementById("backgroundMusic");

    const gridSize = 20;
    const canvasSize = 300;
    const rows = canvasSize / gridSize;
    const cols = canvasSize / gridSize;

    let snake;
    let apple;
    let score;
    let direction;
    let gameInterval;

    function initGame() {
        snake = [{ x: 10, y: 10 }];
        placeApple();
        score = 0;
        direction = { x: 1, y: 0 };
        scoreElement.textContent = "Pontuação: " + score;
        clearInterval(gameInterval);
        backgroundMusic.play();  // Inicia a trilha sonora
        gameInterval = setInterval(gameLoop, 200);
    }

    function gameLoop() {
        update();
        draw();
    }

    function update() {
        const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

        if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
            gameOver();
            return;
        }

        for (let i = 0; i < snake.length; i++) {
            if (snake[i].x === head.x && snake[i].y === head.y) {
                gameOver();
                return;
            }
        }

        if (head.x === apple.x && head.y === apple.y) {
            score++;
            scoreElement.textContent = "Pontuação: " + score;
            snake.push({});
            eatSound.play(); // Tocar som ao comer a maçã
            placeApple();
        }

        for (let i = snake.length - 1; i > 0; i--) {
            snake[i] = { ...snake[i - 1] };
        }
        snake[0] = head;
    }

    function draw() {
        ctx.clearRect(0, 0, canvasSize, canvasSize);

        ctx.fillStyle = "green";
        snake.forEach(part => {
            ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
        });

        ctx.fillStyle = "red";
        ctx.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize, gridSize);
    }

    function placeApple() {
        apple = {
            x: Math.floor(Math.random() * cols),
            y: Math.floor(Math.random() * rows)
        };

        // Verificar se a maçã não aparece em cima da cobra
        for (let i = 0; i < snake.length; i++) {
            if (snake[i].x === apple.x && snake[i].y === apple.y) {
                placeApple();
                return;
            }
        }
    }

    function gameOver() {
        clearInterval(gameInterval);
        backgroundMusic.pause();  // Pausa a trilha sonora
        backgroundMusic.currentTime = 0;  // Reinicia a trilha sonora
        gameOverSound.play(); // Tocar som de game over

        gameOverSound.onended = function() {
            alert("Game Over! Sua pontuação foi: " + score);
        };
    }

    function changeDirection(event) {
        const keyPressed = event.keyCode;

        switch(keyPressed) {
            case 37:
                if (direction.x === 0) {
                    direction = { x: -1, y: 0 };
                }
                break;
            case 38:
                if (direction.y === 0) {
                    direction = { x: 0, y: -1 };
                }
                break;
            case 39:
                if (direction.x === 0) {
                    direction = { x: 1, y: 0 };
                }
                break;
            case 40:
                if (direction.y === 0) {
                    direction = { x: 0, y: 1 };
                }
                break;
        }
    }

    function handleControlClick(newDirection) {
        switch(newDirection) {
            case "left":
                if (direction.x === 0) {
                    direction = { x: -1, y: 0 };
                }
                break;
            case "up":
                if (direction.y === 0) {
                    direction = { x: 0, y: -1 };
                }
                break;
            case "right":
                if (direction.x === 0) {
                    direction = { x: 1, y: 0 };
                }
                break;
            case "down":
                if (direction.y === 0) {
                    direction = { x: 0, y: 1 };
                }
                break;
        }
    }

    document.addEventListener("keydown", changeDirection);
    startGameButton.addEventListener("click", initGame);

    controlButtons.left.addEventListener("click", () => handleControlClick("left"));
    controlButtons.up.addEventListener("click", () => handleControlClick("up"));
    controlButtons.right.addEventListener("click", () => handleControlClick("right"));
    controlButtons.down.addEventListener("click", () => handleControlClick("down"));

    initGame();
});
