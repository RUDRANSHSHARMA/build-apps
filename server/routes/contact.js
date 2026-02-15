const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();

router.post('/contact', async (req, res) => {
  const { name, email, phone, service, message } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  if (process.env.MAIL_HOST) {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT || 587),
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: process.env.MAIL_USER,
      subject: `New inquiry from ${name}`,
      text: `Service: ${service}\nPhone: ${phone}\nMessage: ${message}`
    });
  }

  return res.json({ message: 'Message received' });
});

module.exports = router;
