const express = require('express');
const pool = require('../db');
const { auth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/orders', auth, async (req, res) => {
  const result = await pool.query('SELECT * FROM orders WHERE user_id = $1 ORDER BY order_date DESC', [req.user.id]);
  res.json(result.rows);
});

router.get('/orders/:id', auth, async (req, res) => {
  const result = await pool.query('SELECT * FROM orders WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
  if (!result.rows[0]) {
    return res.status(404).json({ message: 'Order not found' });
  }
  return res.json(result.rows[0]);
});

router.post('/orders', auth, async (req, res) => {
  const { service_id, requirements, quantity, total_amount, delivery_date } = req.body;
  const result = await pool.query(
    `INSERT INTO orders (user_id, service_id, requirements, quantity, total_amount, status, payment_status, order_date, delivery_date)
     VALUES ($1, $2, $3, $4, $5, 'pending', 'pending', NOW(), $6) RETURNING *`,
    [req.user.id, service_id, requirements, quantity || 1, total_amount, delivery_date]
  );
  res.status(201).json(result.rows[0]);
});

router.put('/orders/:id', auth, async (req, res) => {
  const { status } = req.body;
  const result = await pool.query(
    'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3 RETURNING *',
    [status, req.params.id, req.user.id]
  );
  res.json(result.rows[0]);
});

router.delete('/orders/:id', auth, async (req, res) => {
  await pool.query('UPDATE orders SET status = $1 WHERE id = $2 AND user_id = $3', ['cancelled', req.params.id, req.user.id]);
  res.json({ message: 'Order cancelled' });
});

router.get('/admin/orders', auth, requireAdmin, async (req, res) => {
  const result = await pool.query('SELECT * FROM orders ORDER BY order_date DESC');
  res.json(result.rows);
});

router.put('/admin/orders/:id', auth, requireAdmin, async (req, res) => {
  const { status, payment_status } = req.body;
  const result = await pool.query(
    'UPDATE orders SET status = $1, payment_status = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
    [status, payment_status, req.params.id]
  );
  res.json(result.rows[0]);
});

router.delete('/admin/orders/:id', auth, requireAdmin, async (req, res) => {
  await pool.query('DELETE FROM orders WHERE id = $1', [req.params.id]);
  res.json({ message: 'Order deleted' });
});

module.exports = router;
