const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET /api/menus - 메뉴 목록 조회 (옵션 포함)
router.get('/', async (req, res) => {
  try {
    const menusResult = await pool.query(
      'SELECT id, name, description, price, image_url, stock FROM menus ORDER BY id'
    );

    const optionsResult = await pool.query(
      'SELECT id, name, price, menu_id FROM options ORDER BY id'
    );

    const menus = menusResult.rows.map((menu) => ({
      id: menu.id,
      name: menu.name,
      description: menu.description,
      price: menu.price,
      imageUrl: menu.image_url,
      stock: menu.stock,
      options: optionsResult.rows
        .filter((opt) => opt.menu_id === menu.id)
        .map((opt) => ({
          id: opt.id,
          name: opt.name,
          price: opt.price,
        })),
    }));

    res.json(menus);
  } catch (err) {
    console.error('메뉴 조회 오류:', err);
    res.status(500).json({ error: '메뉴를 불러오는 데 실패했습니다.' });
  }
});

// PATCH /api/menus/:id/stock - 재고 수량 변경
router.patch('/:id/stock', async (req, res) => {
  const { id } = req.params;
  const { delta } = req.body;

  try {
    const menuResult = await pool.query('SELECT id, name, stock FROM menus WHERE id = $1', [id]);

    if (menuResult.rows.length === 0) {
      return res.status(404).json({ error: '해당 메뉴를 찾을 수 없습니다.' });
    }

    const currentStock = menuResult.rows[0].stock;
    const newStock = currentStock + delta;

    if (newStock < 0) {
      return res.status(400).json({ error: '재고는 0 미만이 될 수 없습니다.' });
    }

    const updateResult = await pool.query(
      'UPDATE menus SET stock = $1 WHERE id = $2 RETURNING id, name, stock',
      [newStock, id]
    );

    res.json(updateResult.rows[0]);
  } catch (err) {
    console.error('재고 변경 오류:', err);
    res.status(500).json({ error: '재고 변경에 실패했습니다.' });
  }
});

module.exports = router;
