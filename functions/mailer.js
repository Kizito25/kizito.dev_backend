import nodemailer from "nodemailer";

const main = async (from, subject, html) => {
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    // secure: true,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      ciphers: "SSLv3",
    },
  });

  const sendMail = await transporter.sendMail({
    from,
    to: process.env.RECIPIENT_EMAIL,
    subject,
    html,
  });

  sendMail.then((info) => {
    console.log(info);
  });
  sendMail.catch((err) => {
    console.log(err);
    throw new Error(err);
  });
};

export default main;
