const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const { auth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const result = await pool.query('SELECT * FROM users WHERE email = $1 AND role = $2', [email, 'admin']);
  const user = result.rows[0];
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
  return res.json({ token });
});

router.get('/analytics/revenue', auth, requireAdmin, async (req, res) => {
  const result = await pool.query('SELECT SUM(amount) as total FROM payments WHERE status = $1', ['success']);
  res.json(result.rows[0]);
});

module.exports = router;
