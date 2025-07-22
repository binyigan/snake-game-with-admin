# 贪吃蛇游戏（带后端管理系统）

这是一个带有后端管理系统的贪吃蛇游戏，可以记录玩家的游戏数据，并提供排行榜功能。

## 功能特点

- 经典贪吃蛇游戏玩法
- 多种难度级别选择
- 多种主题风格
- 游戏数据记录和统计
- 玩家排行榜
- 管理后台查看所有游戏记录

## 技术栈

- 前端：HTML, CSS, JavaScript
- 后端：Node.js, Express
- 数据存储：JSON文件

## 安装和运行

### 前提条件

- 安装 [Node.js](https://nodejs.org/) (v14.0.0 或更高版本)

### 安装步骤

1. 克隆或下载项目到本地
2. 进入项目目录
3. 安装依赖

```bash
npm install
```

4. 启动服务器

```bash
npm start
```

5. 在浏览器中访问 `http://localhost:3000`

## 游戏说明

1. 在选择页面选择难度和主题
2. 点击"开始游戏"按钮进入游戏
3. 使用方向键或WASD控制蛇的移动
4. 游戏结束后可以输入名字保存成绩
5. 通过选择页面的"管理系统"链接可以查看所有玩家的成绩和排行榜

## 项目结构

```
├── index.html          # 游戏主页面
├── select.html         # 游戏选择页面
├── admin.html          # 管理系统页面
├── script.js           # 游戏逻辑脚本
├── style.css           # 默认样式
├── style-modern.css    # 现代简约风格
├── style-retro.css     # 复古像素风格
├── style-cartoon.css   # 卡通可爱风格
├── server.js           # 后端服务器
├── package.json        # 项目依赖
└── data/               # 数据存储目录
    └── players.json    # 玩家数据
```

## 后端API

- `GET /api/players` - 获取所有玩家数据
- `POST /api/players` - 添加新玩家记录
- `GET /api/leaderboard` - 获取排行榜（按分数排序）

## 许可证

MIT