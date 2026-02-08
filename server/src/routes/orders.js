const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET /api/orders - 주문 목록 조회
router.get('/', async (req, res) => {
  try {
    const ordersResult = await pool.query(
      'SELECT id, order_time, total_price, status FROM orders ORDER BY order_time DESC'
    );

    const itemsResult = await pool.query(
      'SELECT id, order_id, menu_id, menu_name, quantity, options, price FROM order_items ORDER BY id'
    );

    const orders = ordersResult.rows.map((order) => ({
      id: order.id,
      orderTime: order.order_time,
      totalPrice: order.total_price,
      status: order.status,
      items: itemsResult.rows
        .filter((item) => item.order_id === order.id)
        .map((item) => ({
          menuId: item.menu_id,
          menuName: item.menu_name,
          quantity: item.quantity,
          options: JSON.parse(item.options || '[]'),
          price: item.price,
        })),
    }));

    res.json(orders);
  } catch (err) {
    console.error('주문 목록 조회 오류:', err);
    res.status(500).json({ error: '주문 목록을 불러오는 데 실패했습니다.' });
  }
});

// GET /api/orders/:id - 주문 단건 조회
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const orderResult = await pool.query(
      'SELECT id, order_time, total_price, status FROM orders WHERE id = $1',
      [id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: '해당 주문을 찾을 수 없습니다.' });
    }

    const itemsResult = await pool.query(
      'SELECT menu_id, menu_name, quantity, options, price FROM order_items WHERE order_id = $1 ORDER BY id',
      [id]
    );

    const order = orderResult.rows[0];
    res.json({
      id: order.id,
      orderTime: order.order_time,
      totalPrice: order.total_price,
      status: order.status,
      items: itemsResult.rows.map((item) => ({
        menuId: item.menu_id,
        menuName: item.menu_name,
        quantity: item.quantity,
        options: JSON.parse(item.options || '[]'),
        price: item.price,
      })),
    });
  } catch (err) {
    console.error('주문 조회 오류:', err);
    res.status(500).json({ error: '주문을 불러오는 데 실패했습니다.' });
  }
});

// POST /api/orders - 주문 생성 + 재고 차감
router.post('/', async (req, res) => {
  const { items, totalPrice } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: '주문 항목이 비어 있습니다.' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 재고 확인 및 차감
    for (const item of items) {
      const stockResult = await client.query(
        'SELECT stock, name FROM menus WHERE id = $1 FOR UPDATE',
        [item.menuId]
      );

      if (stockResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: `메뉴 ID ${item.menuId}를 찾을 수 없습니다.` });
      }

      const { stock, name } = stockResult.rows[0];
      if (stock < item.quantity) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: `${name}의 재고가 부족합니다. (현재: ${stock}개)` });
      }

      await client.query(
        'UPDATE menus SET stock = stock - $1 WHERE id = $2',
        [item.quantity, item.menuId]
      );
    }

    // 주문 생성
    const orderResult = await client.query(
      "INSERT INTO orders (total_price, status) VALUES ($1, '주문 접수') RETURNING id, order_time, total_price, status",
      [totalPrice]
    );

    const order = orderResult.rows[0];

    // 주문 항목 생성
    for (const item of items) {
      await client.query(
        'INSERT INTO order_items (order_id, menu_id, menu_name, quantity, options, price) VALUES ($1, $2, $3, $4, $5, $6)',
        [order.id, item.menuId, item.menuName, item.quantity, JSON.stringify(item.options || []), item.price]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      id: order.id,
      orderTime: order.order_time,
      totalPrice: order.total_price,
      status: order.status,
      items,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('주문 생성 오류:', err);
    res.status(500).json({ error: '주문 생성에 실패했습니다.' });
  } finally {
    client.release();
  }
});

// PATCH /api/orders/:id/status - 주문 상태 변경
router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validTransitions = {
    '주문 접수': '제조 중',
    '제조 중': '제조 완료',
  };

  try {
    const orderResult = await pool.query(
      'SELECT id, order_time, total_price, status FROM orders WHERE id = $1',
      [id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: '해당 주문을 찾을 수 없습니다.' });
    }

    const currentStatus = orderResult.rows[0].status;
    const allowedNext = validTransitions[currentStatus];

    if (!allowedNext || allowedNext !== status) {
      return res.status(400).json({ error: '잘못된 상태 전환입니다.' });
    }

    const updateResult = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING id, order_time, total_price, status',
      [status, id]
    );

    const updatedOrder = updateResult.rows[0];

    const itemsResult = await pool.query(
      'SELECT menu_id, menu_name, quantity, options, price FROM order_items WHERE order_id = $1 ORDER BY id',
      [id]
    );

    res.json({
      id: updatedOrder.id,
      orderTime: updatedOrder.order_time,
      totalPrice: updatedOrder.total_price,
      status: updatedOrder.status,
      items: itemsResult.rows.map((item) => ({
        menuId: item.menu_id,
        menuName: item.menu_name,
        quantity: item.quantity,
        options: JSON.parse(item.options || '[]'),
        price: item.price,
      })),
    });
  } catch (err) {
    console.error('상태 변경 오류:', err);
    res.status(500).json({ error: '주문 상태 변경에 실패했습니다.' });
  }
});

module.exports = router;
