const express = require('express');
const pool = require('../db');
const { auth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/portfolio', async (req, res) => {
  const result = await pool.query('SELECT * FROM portfolio ORDER BY created_at DESC');
  res.json(result.rows);
});

router.post('/admin/portfolio', auth, requireAdmin, async (req, res) => {
  const { title, description, category, image } = req.body;
  const result = await pool.query(
    'INSERT INTO portfolio (title, description, category, image, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
    [title, description, category, image]
  );
  res.status(201).json(result.rows[0]);
});

router.put('/admin/portfolio/:id', auth, requireAdmin, async (req, res) => {
  const { title, description, category, image } = req.body;
  const result = await pool.query(
    'UPDATE portfolio SET title = $1, description = $2, category = $3, image = $4, updated_at = NOW() WHERE id = $5 RETURNING *',
    [title, description, category, image, req.params.id]
  );
  res.json(result.rows[0]);
});

router.delete('/admin/portfolio/:id', auth, requireAdmin, async (req, res) => {
  await pool.query('DELETE FROM portfolio WHERE id = $1', [req.params.id]);
  res.json({ message: 'Portfolio item deleted' });
});

module.exports = router;
