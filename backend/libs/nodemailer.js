const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  secure:true,
  secureConnection: false,
  tls: {
   ciphers: "SSLv3",
  },
  requireTLS: true,
  port: parseInt(process.env.MAIL_PORT),
  secure: process.env.MAIL_PORT == 465, 
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error('SMTP connection failed:', error.message);
  } else {
    console.log(`SMTP ready: ${process.env.MAIL_USER} via ${process.env.MAIL_HOST}:${process.env.MAIL_PORT}`);
  }
});

module.exports = transporter;

module.exports = transporter;