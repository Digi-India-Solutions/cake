const nodemailer = require("nodemailer")
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use TLS
    auth: {
      user: process.env.MAIL_SENDER, // Sender's email address from .env
      pass: process.env.MAIL_PASSWORD // Sender's email password from .env
    },
  });
module.exports = transporter