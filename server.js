const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();

// ✅ CORS middleware (with OPTIONS preflight support)
app.use(cors({
  origin: 'http://localhost:3000', // 👈 only allow frontend on port 3000
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(bodyParser.json());

// ✅ Handle preflight OPTIONS request manually (for extra safety)
app.options('/send-email', cors());

// ✅ Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'davidraja410@gmail.com',
    pass: 'fqdj jjce fngp rlba' // Gmail App Password
  }
});

// ✅ Email route
app.post('/send-email', async (req, res) => {
  const { username, status, discrepancies, timestamp } = req.body;

  const subject = `Consumables Replenishment - ${status === 'done' ? 'Completed' : 'With Discrepancies'} by ${username}`;
  const discrepancyList = discrepancies.length
    ? discrepancies.map((d, i) => `${i + 1}. ${d}`).join('\n')
    : 'None';

  const mailOptions = {
    from: 'davidraja410@gmail.com',
    to: 'davidraja777@hotmail.com',
    subject,
    text: `
      Username: ${username}
      Status: ${status}
      Timestamp: ${timestamp}

      Discrepancies:
      ${discrepancyList}
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent from ${username}`);
    res.status(200).send('Email sent');
  } catch (err) {
    console.error('❌ Failed to send email:', err);
    res.status(500).send('Failed to send email');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
