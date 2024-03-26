type EmailOptions = {
  to: string;
  subject: string;
  html: string;
};

const nodemailer = require("nodemailer");

async function sentPasswordResetEmail({ to, subject, html }: EmailOptions) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
      api_key: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  let info = await transporter.sendMail({
    from: "noreply@pinyastudio.com",
    to: to,
    subject: subject,
    html: html,
  });

  //console.log("Message sent: %s", info.messageId);
}

export { sentPasswordResetEmail };
