// Import dependencies 导入工作包
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');  

// Load environment variables from .env file 从.env文件加载环境变量
dotenv.config();

// Create an Express app 创建Express应用
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware 中间件
app.use(cors());

app.use(express.json());
app.use(express.static('frontend'));

// Test route 测试路由
app.get('/api/test', (req, res) => {
    res.json({
        message: 'Backend is working!',
        timestamp: new Date()
    });
});

// Start the server 启动服务器
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});