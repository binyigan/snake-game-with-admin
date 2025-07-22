// 获取游戏元素
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// 游戏变量
let snake = [];
let food = {};
let direction = 'right';
let score = 0;
let gameTime = 0;
let gameLoop;
let timeInterval;
let gameStarted = false;
let gameSpeed;
let gridSize = 20;
let canvasSize = 450;
let gridCount = canvasSize / gridSize;

// 从本地存储获取难度设置
const difficulty = localStorage.getItem('snakeGameDifficulty') || 'medium';

// 根据难度设置游戏速度
switch(difficulty) {
    case 'easy':
        gameSpeed = 150;
        break;
    case 'hard':
        gameSpeed = 80;
        break;
    case 'medium':
    default:
        gameSpeed = 110;
        break;
}

// 初始化游戏
function initGame() {
    // 初始化蛇
    snake = [
        {x: 6 * gridSize, y: 10 * gridSize},
        {x: 5 * gridSize, y: 10 * gridSize},
        {x: 4 * gridSize, y: 10 * gridSize}
    ];
    
    // 生成食物
    generateFood();
    
    // 重置分数和时间
    score = 0;
    gameTime = 0;
    document.getElementById('score').textContent = score;
    document.getElementById('time').textContent = gameTime;
    
    // 显示倒计时
    showCountdown();
}

// 生成食物
function generateFood() {
    // 随机生成食物位置
    let foodX = Math.floor(Math.random() * gridCount) * gridSize;
    let foodY = Math.floor(Math.random() * gridCount) * gridSize;
    
    // 确保食物不会生成在蛇身上
    let foodOnSnake = true;
    while (foodOnSnake) {
        foodOnSnake = false;
        for (let i = 0; i < snake.length; i++) {
            if (snake[i].x === foodX && snake[i].y === foodY) {
                foodOnSnake = true;
                foodX = Math.floor(Math.random() * gridCount) * gridSize;
                foodY = Math.floor(Math.random() * gridCount) * gridSize;
                break;
            }
        }
    }
    
    food = {
        x: foodX,
        y: foodY
    };
}

// 游戏主循环
function gameLoop() {
    // 移动蛇
    moveSnake();
    
    // 检查碰撞
    if (checkCollision()) {
        gameOver();
        return;
    }
    
    // 检查是否吃到食物
    if (snake[0].x === food.x && snake[0].y === food.y) {
        // 增加分数
        score += 10;
        document.getElementById('score').textContent = score;
        
        // 不移除蛇尾，让蛇变长
        generateFood();
    } else {
        // 移除蛇尾
        snake.pop();
    }
    
    // 绘制游戏
    draw();
}

// 移动蛇
function moveSnake() {
    // 获取蛇头
    const head = {x: snake[0].x, y: snake[0].y};
    
    // 根据方向移动蛇头
    switch(direction) {
        case 'up':
            head.y -= gridSize;
            break;
        case 'down':
            head.y += gridSize;
            break;
        case 'left':
            head.x -= gridSize;
            break;
        case 'right':
            head.x += gridSize;
            break;
    }
    
    // 将新蛇头添加到蛇身前面
    snake.unshift(head);
}

// 检查碰撞
function checkCollision() {
    // 获取蛇头
    const head = snake[0];
    
    // 检查是否撞墙
    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
        return true;
    }
    
    // 检查是否撞到自己
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    
    return false;
}

// 游戏结束
function gameOver() {
    // 清除游戏循环和时间计时器
    clearInterval(gameLoop);
    clearInterval(timeInterval);
    
    // 显示玩家名称输入
    showPlayerNameInput();
}

// 显示玩家名称输入
function showPlayerNameInput() {
    // 创建输入表单
    const inputForm = document.createElement('div');
    inputForm.style.position = 'absolute';
    inputForm.style.top = '50%';
    inputForm.style.left = '50%';
    inputForm.style.transform = 'translate(-50%, -50%)';
    inputForm.style.backgroundColor = 'white';
    inputForm.style.padding = '20px';
    inputForm.style.borderRadius = '10px';
    inputForm.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.2)';
    inputForm.style.textAlign = 'center';
    inputForm.style.zIndex = '1000';
    inputForm.style.width = '300px';
    
    // 创建游戏结束标题
    const gameOverTitle = document.createElement('h2');
    gameOverTitle.textContent = '游戏结束';
    gameOverTitle.style.color = '#ff3333';
    gameOverTitle.style.marginBottom = '15px';
    inputForm.appendChild(gameOverTitle);
    
    // 创建分数显示
    const scoreDisplay = document.createElement('p');
    scoreDisplay.textContent = `你的分数: ${score}`;
    scoreDisplay.style.fontSize = '18px';
    scoreDisplay.style.marginBottom = '10px';
    inputForm.appendChild(scoreDisplay);
    
    // 创建时间显示
    const timeDisplay = document.createElement('p');
    timeDisplay.textContent = `游戏时间: ${gameTime} 秒`;
    timeDisplay.style.fontSize = '18px';
    timeDisplay.style.marginBottom = '20px';
    inputForm.appendChild(timeDisplay);
    
    // 创建玩家名称输入框
    const nameLabel = document.createElement('label');
    nameLabel.textContent = '你的名字: ';
    nameLabel.style.display = 'block';
    nameLabel.style.marginBottom = '5px';
    nameLabel.style.textAlign = 'left';
    inputForm.appendChild(nameLabel);
    
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = '输入你的名字';
    nameInput.style.width = '100%';
    nameInput.style.padding = '8px';
    nameInput.style.marginBottom = '20px';
    nameInput.style.borderRadius = '4px';
    nameInput.style.border = '1px solid #ddd';
    inputForm.appendChild(nameInput);
    
    // 创建按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'space-between';
    inputForm.appendChild(buttonContainer);
    
    // 创建保存按钮
    const saveButton = document.createElement('button');
    saveButton.textContent = '保存成绩';
    saveButton.style.backgroundColor = '#4CAF50';
    saveButton.style.color = 'white';
    saveButton.style.border = 'none';
    saveButton.style.padding = '10px 20px';
    saveButton.style.borderRadius = '4px';
    saveButton.style.cursor = 'pointer';
    buttonContainer.appendChild(saveButton);
    
    // 创建不保存按钮
    const cancelButton = document.createElement('button');
    cancelButton.textContent = '不保存';
    cancelButton.style.backgroundColor = '#f44336';
    cancelButton.style.color = 'white';
    cancelButton.style.border = 'none';
    cancelButton.style.padding = '10px 20px';
    cancelButton.style.borderRadius = '4px';
    cancelButton.style.cursor = 'pointer';
    buttonContainer.appendChild(cancelButton);
    
    // 添加保存按钮事件
    saveButton.addEventListener('click', () => {
        const playerName = nameInput.value.trim() || '匿名玩家';
        savePlayerScore(playerName);
        document.body.removeChild(inputForm);
        returnToSelectPage();
    });
    
    // 添加不保存按钮事件
    cancelButton.addEventListener('click', () => {
        document.body.removeChild(inputForm);
        returnToSelectPage();
    });
    
    // 将表单添加到页面
    document.body.appendChild(inputForm);
    
    // 自动聚焦到输入框
    nameInput.focus();
}

// 保存玩家分数
function savePlayerScore(playerName) {
    // 获取难度设置
    const difficulty = localStorage.getItem('snakeGameDifficulty') || 'medium';
    
    // 构建玩家数据
    const playerData = {
        playerName: playerName,
        score: score,
        gameTime: gameTime,
        difficulty: difficulty,
        date: new Date().toISOString()
    };
    
    // 发送数据到服务器
    fetch('/api/players', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(playerData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('保存成功:', data);
    })
    .catch(error => {
        console.error('保存失败:', error);
    });
}

// 返回选择页面
function returnToSelectPage() {
    window.location.href = 'select.html';
}

// 绘制游戏
function draw() {
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制蛇
    ctx.fillStyle = '#4CAF50';
    for (let i = 0; i < snake.length; i++) {
        ctx.fillRect(snake[i].x, snake[i].y, gridSize, gridSize);
        
        // 绘制蛇身边框
        ctx.strokeStyle = '#45a049';
        ctx.strokeRect(snake[i].x, snake[i].y, gridSize, gridSize);
    }
    
    // 绘制蛇头
    ctx.fillStyle = '#388E3C';
    ctx.fillRect(snake[0].x, snake[0].y, gridSize, gridSize);
    
    // 绘制食物
    ctx.fillStyle = '#FF5722';
    ctx.beginPath();
    ctx.arc(food.x + gridSize/2, food.y + gridSize/2, gridSize/2, 0, Math.PI * 2);
    ctx.fill();
}

// 键盘控制
document.addEventListener('keydown', (event) => {
    if (!gameStarted) return;
    
    switch(event.key) {
        case 'ArrowUp':
            if (direction !== 'down') direction = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') direction = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') direction = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') direction = 'right';
            break;
    }
});

// 触摸控制
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (event) => {
    if (!gameStarted) return;
    
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
});

document.addEventListener('touchmove', (event) => {
    if (!gameStarted) return;
    
    // 防止页面滚动
    event.preventDefault();
    
    const touchEndX = event.touches[0].clientX;
    const touchEndY = event.touches[0].clientY;
    
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;
    
    // 判断滑动方向
    if (Math.abs(dx) > Math.abs(dy)) {
        // 水平滑动
        if (dx > 0 && direction !== 'left') {
            direction = 'right';
        } else if (dx < 0 && direction !== 'right') {
            direction = 'left';
        }
    } else {
        // 垂直滑动
        if (dy > 0 && direction !== 'up') {
            direction = 'down';
        } else if (dy < 0 && direction !== 'down') {
            direction = 'up';
        }
    }
    
    // 更新起始位置
    touchStartX = touchEndX;
    touchStartY = touchEndY;
}, { passive: false });

// 从本地存储加载主题
const savedTheme = localStorage.getItem('snakeGameTheme');
if (savedTheme) {
    document.getElementById('theme-style').href = savedTheme;
}

// 显示倒计时
function showCountdown() {
    // 创建倒计时容器
    const countdownContainer = document.createElement('div');
    countdownContainer.style.position = 'absolute';
    countdownContainer.style.top = '50%';
    countdownContainer.style.left = '50%';
    countdownContainer.style.transform = 'translate(-50%, -50%)';
    countdownContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    countdownContainer.style.color = 'white';
    countdownContainer.style.padding = '20px';
    countdownContainer.style.borderRadius = '10px';
    countdownContainer.style.fontSize = '48px';
    countdownContainer.style.fontWeight = 'bold';
    countdownContainer.style.zIndex = '1000';
    countdownContainer.style.textAlign = 'center';
    countdownContainer.style.width = '300px';
    
    // 添加提示文本
    const tipText = document.createElement('p');
    tipText.textContent = '使用方向键或滑动控制蛇的移动';
    tipText.style.fontSize = '16px';
    tipText.style.marginTop = '20px';
    tipText.style.fontWeight = 'normal';
    
    countdownContainer.appendChild(tipText);
    document.body.appendChild(countdownContainer);
    
    // 倒计时逻辑
    let count = 3;
    countdownContainer.textContent = count;
    countdownContainer.appendChild(tipText);
    
    const countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
            countdownContainer.textContent = count;
            countdownContainer.appendChild(tipText);
        } else if (count === 0) {
            countdownContainer.textContent = '开始!';
            countdownContainer.appendChild(tipText);
        } else {
            clearInterval(countdownInterval);
            document.body.removeChild(countdownContainer);
            
            // 开始游戏
            gameStarted = true;
            gameLoop = setInterval(gameLoop, gameSpeed);
            timeInterval = setInterval(() => {
                gameTime++;
                document.getElementById('time').textContent = gameTime;
            }, 1000);
        }
    }, 1000);
}

// 初始化游戏
initGame();