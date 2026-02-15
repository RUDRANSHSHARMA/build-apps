const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use(limiter);

app.use('/assets', express.static(path.join(__dirname, '../public/assets')));
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api', require('./routes/auth'));
app.use('/api', require('./routes/services'));
app.use('/api', require('./routes/blog'));
app.use('/api', require('./routes/portfolio'));
app.use('/api', require('./routes/orders'));
app.use('/api', require('./routes/messages'));
app.use('/api', require('./routes/payments'));
app.use('/api', require('./routes/contact'));
app.use('/api', require('./routes/upload'));
app.use('/api/admin', require('./routes/admin'));

app.get('*', (req, res) => {
  res.status(404).sendFile(path.join(__dirname, '../public/404.html'));
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
