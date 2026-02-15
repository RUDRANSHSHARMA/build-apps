const express = require('express');
const pool = require('../db');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/messages', auth, async (req, res) => {
  const result = await pool.query('SELECT * FROM messages WHERE receiver_id = $1 ORDER BY created_at DESC', [req.user.id]);
  res.json(result.rows);
});

router.post('/messages', auth, async (req, res) => {
  const { receiver_id, order_id, message } = req.body;
  const result = await pool.query(
    'INSERT INTO messages (sender_id, receiver_id, order_id, message, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
    [req.user.id, receiver_id, order_id, message]
  );
  res.status(201).json(result.rows[0]);
});

router.put('/messages/:id/read', auth, async (req, res) => {
  const result = await pool.query(
    'UPDATE messages SET is_read = true, read_at = NOW() WHERE id = $1 AND receiver_id = $2 RETURNING *',
    [req.params.id, req.user.id]
  );
  res.json(result.rows[0]);
});

module.exports = router;
