const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const menusRouter = require('./routes/menus');
const ordersRouter = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 4000;

// 미들웨어
app.use(cors());
app.use(express.json());

// 라우트
app.use('/api/menus', menusRouter);
app.use('/api/orders', ordersRouter);

// 헬스 체크
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'COZY 커피 주문 앱 서버가 실행 중입니다.' });
});

// 프런트엔드 정적 파일 제공 (프로덕션 배포용)
const distPath = path.join(__dirname, '../../ui/dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
