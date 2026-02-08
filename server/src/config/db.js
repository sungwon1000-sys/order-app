const { Pool } = require('pg');
require('dotenv').config();

// Render.com은 DATABASE_URL 환경변수를 제공하므로 우선 사용
// 로컬 개발 시에는 개별 DB 환경변수 사용
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    })
  : new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

pool.on('error', (err) => {
  console.error('데이터베이스 연결 오류:', err);
  process.exit(-1);
});

module.exports = pool;
