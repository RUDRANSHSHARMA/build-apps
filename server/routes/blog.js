const express = require('express');
const pool = require('../db');
const { auth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/blog', async (req, res) => {
  const result = await pool.query('SELECT * FROM blog_posts WHERE status = $1 ORDER BY published_at DESC', ['published']);
  res.json(result.rows);
});

router.get('/blog/:id', async (req, res) => {
  const result = await pool.query('SELECT * FROM blog_posts WHERE id = $1', [req.params.id]);
  res.json(result.rows[0]);
});

router.post('/admin/blog', auth, requireAdmin, async (req, res) => {
  const { title, content, category, status } = req.body;
  const result = await pool.query(
    'INSERT INTO blog_posts (title, content, category, status, published_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
    [title, content, category, status]
  );
  res.status(201).json(result.rows[0]);
});

router.put('/admin/blog/:id', auth, requireAdmin, async (req, res) => {
  const { title, content, category, status } = req.body;
  const result = await pool.query(
    'UPDATE blog_posts SET title = $1, content = $2, category = $3, status = $4, updated_at = NOW() WHERE id = $5 RETURNING *',
    [title, content, category, status, req.params.id]
  );
  res.json(result.rows[0]);
});

router.delete('/admin/blog/:id', auth, requireAdmin, async (req, res) => {
  await pool.query('DELETE FROM blog_posts WHERE id = $1', [req.params.id]);
  res.json({ message: 'Post deleted' });
});

router.post('/blog/:id/comments', async (req, res) => {
  const { guest_name, guest_email, comment } = req.body;
  const result = await pool.query(
    'INSERT INTO comments (post_id, guest_name, guest_email, comment, status, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *',
    [req.params.id, guest_name, guest_email, comment, 'pending']
  );
  res.status(201).json(result.rows[0]);
});

module.exports = router;
