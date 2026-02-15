const express = require('express');
const pool = require('../db');
const { auth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/services', async (req, res) => {
  const result = await pool.query('SELECT * FROM services WHERE is_active = true ORDER BY display_order');
  res.json(result.rows);
});

router.get('/services/:id', async (req, res) => {
  const result = await pool.query('SELECT * FROM services WHERE id = $1', [req.params.id]);
  res.json(result.rows[0]);
});

router.post('/admin/services', auth, requireAdmin, async (req, res) => {
  const { name, slug, short_description, base_price } = req.body;
  const result = await pool.query(
    'INSERT INTO services (name, slug, short_description, base_price, is_active) VALUES ($1, $2, $3, $4, true) RETURNING *',
    [name, slug, short_description, base_price]
  );
  res.status(201).json(result.rows[0]);
});

router.put('/admin/services/:id', auth, requireAdmin, async (req, res) => {
  const { name, short_description, base_price, is_active } = req.body;
  const result = await pool.query(
    'UPDATE services SET name = $1, short_description = $2, base_price = $3, is_active = $4, updated_at = NOW() WHERE id = $5 RETURNING *',
    [name, short_description, base_price, is_active, req.params.id]
  );
  res.json(result.rows[0]);
});

router.delete('/admin/services/:id', auth, requireAdmin, async (req, res) => {
  await pool.query('DELETE FROM services WHERE id = $1', [req.params.id]);
  res.json({ message: 'Service deleted' });
});

module.exports = router;
