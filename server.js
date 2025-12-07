const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// 中间件
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // 将HTML文件放在public目录下

// API端点：处理查询请求
app.post('/api/search', (req, res) => {
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: '请输入人名' });
  }
  
  // 读取name.txt文件
  const filePath = path.join(__dirname, 'name.txt');
  
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('读取文件错误:', err);
      return res.status(500).json({ error: '无法读取数据文件' });
    }
    
    // 解析文件内容
    const lines = data.split('\n').filter(line => line.trim() !== '');
    const results = [];
    
    lines.forEach(line => {
      // 分割名字和地址（支持地址中包含空格）
      const parts = line.split(' ');
      const personName = parts[0];
      const address = parts.slice(1).join(' ').trim();
      
      // 模糊匹配（不区分大小写）
      if (personName.toLowerCase().includes(name.toLowerCase())) {
        results.push({
          name: personName,
          address: address || '暂无地址信息'
        });
      }
    });
    
    res.json({
      results: results,
      count: results.length
    });
  });
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});
