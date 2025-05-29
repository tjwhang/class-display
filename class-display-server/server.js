const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// vite build
app.use(express.static(path.join(__dirname, 'dist')));

// SPA 라우팅을 위한 fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});