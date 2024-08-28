const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

/**
 * Send an email
 * @param {string} to - The recipient's email address
 * @param {string} subject - The subject of the email
 * @param {string} text - The plain text content of the email (optional)
 * @param {string} html - The HTML content of the email (optional)
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text = null, html = null) => {
  const msg = { 
    from: config.email.from, 
    to, 
    subject, 
    text, 
    html,
  };

  await transport.sendMail(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
  const subject = 'Reset password';
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;
  const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

const sendConfirmBirthdayEmail = async (to) => {
  const subject = '[EGG] Xác nhận đăng ký tham gia sinh nhật thành công';

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Xác nhận đăng ký</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          color: #333;
          line-height: 1.6;
          background-color: #f4f4f4;
          padding: 20px;
        }
        .email-container {
          background-color: #ffffff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          max-width: 600px;
          margin: auto;
        }
        h1 {
          color: #4CAF50;
        }
        p {
          margin: 15px 0;
        }
        .footer {
          margin-top: 20px;
          text-align: center;
          font-size: 12px;
          color: #777;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <h1>Xác nhận đăng ký tham gia sinh nhật thành công!</h1>
        <p>Dear Anh/Chị/Bạn/Em,</p>
        <p>Cảm ơn bạn đã đăng ký tham gia sinh nhật của EGG Club!</p>
        <p>Mọi thông tin về bữa tiệc sẽ được cập nhật nhanh nhất tại page của EGG và email đăng ký này. Bạn đừng quên thường xuyên check email nhé!!!</p>
        <p>Chúng tôi rất mong được gặp bạn!</p>
        <div class="footer">
          <p>© 2024 EGG Club. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail(to, subject, null, htmlContent);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (to, token) => {
  const subject = 'Email Verification';
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `http://link-to-app/verify-email?token=${token}`;
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendConfirmBirthdayEmail
};
