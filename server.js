const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(bodyParser.json());
app.use(express.static('.'));

// 数据文件路径
const dataDir = path.join(__dirname, 'data');
const playersFile = path.join(dataDir, 'players.json');

// 确保数据目录存在
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// 确保玩家数据文件存在
if (!fs.existsSync(playersFile)) {
    fs.writeFileSync(playersFile, JSON.stringify([]), 'utf8');
}

// API路由

// 获取所有玩家数据
app.get('/api/players', (req, res) => {
    try {
        const data = fs.readFileSync(playersFile, 'utf8');
        const players = JSON.parse(data);
        res.json(players);
    } catch (error) {
        console.error('读取玩家数据失败:', error);
        res.status(500).json({ error: '读取玩家数据失败' });
    }
});

// 添加新玩家记录
app.post('/api/players', (req, res) => {
    try {
        const playerData = req.body;
        
        // 验证数据
        if (!playerData.playerName || typeof playerData.score !== 'number') {
            return res.status(400).json({ error: '无效的玩家数据' });
        }
        
        // 读取现有数据
        const data = fs.readFileSync(playersFile, 'utf8');
        const players = JSON.parse(data);
        
        // 添加ID和日期
        playerData.id = Date.now().toString();
        if (!playerData.date) {
            playerData.date = new Date().toISOString();
        }
        
        // 添加新记录
        players.push(playerData);
        
        // 保存数据
        fs.writeFileSync(playersFile, JSON.stringify(players, null, 2), 'utf8');
        
        res.status(201).json(playerData);
    } catch (error) {
        console.error('保存玩家数据失败:', error);
        res.status(500).json({ error: '保存玩家数据失败' });
    }
});

// 获取排行榜
app.get('/api/leaderboard', (req, res) => {
    try {
        const data = fs.readFileSync(playersFile, 'utf8');
        const players = JSON.parse(data);
        
        // 按分数排序
        const leaderboard = [...players].sort((a, b) => b.score - a.score).slice(0, 10);
        
        res.json(leaderboard);
    } catch (error) {
        console.error('获取排行榜失败:', error);
        res.status(500).json({ error: '获取排行榜失败' });
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});