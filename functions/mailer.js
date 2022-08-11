import nodemailer from "nodemailer";

const main = async (from, subject, html) => {
  let testAccount = await nodemailer.createTestAccount();
  console.log(testAccount);
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      ciphers: "SSLv3",
    },
  });

  await transporter.sendMail({
    from,
    to: process.env.RECIPIENT_EMAIL,
    subject,
    html,
  });
};

export default main;
