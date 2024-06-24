document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const scoreElement = document.getElementById("score");
    const startGameButton = document.getElementById("startGame");

    const gridSize = 20;
    const canvasSize = 400;
    const rows = canvasSize / gridSize;
    const cols = canvasSize / gridSize;

    let snake;
    let apple;
    let score;
    let direction;
    let gameInterval;

    function initGame() {
        snake = [{ x: 10, y: 10 }];
        apple = { x: 15, y: 15 };
        score = 0;
        direction = { x: 1, y: 0 }; // Define uma direção inicial
        scoreElement.textContent = "Pontuação: " + score;
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, 200); // Ajuste a velocidade do jogo
    }

    function gameLoop() {
        update();
        draw();
    }

    function update() {
        const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

        // Verificar colisões com as paredes
        if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
            gameOver();
            return;
        }

        // Verificar colisões com o próprio corpo
        for (let i = 0; i < snake.length; i++) {
            if (snake[i].x === head.x && snake[i].y === head.y) {
                gameOver();
                return;
            }
        }

        // Verificar se a cobra comeu a maçã
        if (head.x === apple.x && head.y === apple.y) {
            score++;
            scoreElement.textContent = "Pontuação: " + score;
            snake.push({});
            placeApple();
        }

        // Mover a cobra
        for (let i = snake.length - 1; i > 0; i--) {
            snake[i] = { ...snake[i - 1] };
        }
        snake[0] = head;
    }

    function draw() {
        ctx.clearRect(0, 0, canvasSize, canvasSize);

        // Desenhar a cobra
        ctx.fillStyle = "green";
        snake.forEach(part => {
            ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
        });

        // Desenhar a maçã
        ctx.fillStyle = "red";
        ctx.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize, gridSize);
    }

    function placeApple() {
        apple.x = Math.floor(Math.random() * cols);
        apple.y = Math.floor(Math.random() * rows);

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
        alert("Game Over! Sua pontuação foi: " + score);
    }

    function changeDirection(event) {
        const keyPressed = event.keyCode;

        switch(keyPressed) {
            case 37: // Esquerda
                if (direction.x === 0) {
                    direction = { x: -1, y: 0 };
                }
                break;
            case 38: // Cima
                if (direction.y === 0) {
                    direction = { x: 0, y: -1 };
                }
                break;
            case 39: // Direita
                if (direction.x === 0) {
                    direction = { x: 1, y: 0 };
                }
                break;
            case 40: // Baixo
                if (direction.y === 0) {
                    direction = { x: 0, y: 1 };
                }
                break;
        }
    }

    document.addEventListener("keydown", changeDirection);
    startGameButton.addEventListener("click", initGame);

    // Iniciar o jogo ao carregar a página
    initGame();
});
