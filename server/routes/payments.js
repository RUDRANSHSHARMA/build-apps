const express = require('express');
const pool = require('../db');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/payments/upi', auth, async (req, res) => {
  const { order_id, amount, transaction_id } = req.body;
  const result = await pool.query(
    'INSERT INTO payments (order_id, amount, payment_method, transaction_id, status, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *',
    [order_id, amount, 'upi', transaction_id, 'pending']
  );
  res.status(201).json(result.rows[0]);
});

router.get('/payments/:order_id', auth, async (req, res) => {
  const result = await pool.query('SELECT * FROM payments WHERE order_id = $1 ORDER BY created_at DESC', [req.params.order_id]);
  res.json(result.rows);
});

module.exports = router;
