import axios from "axios";
import main from "../functions/mailer.js";
import nodemailer from "nodemailer";
import nodemailerSendgrid from "nodemailer-sendgrid";

const SendMail = async (req, res, next) => {
  try {
    let name = req.body.name;
    let email = req.body.email;
    let subject = req.body.subject;
    let message = req.body.message;
    let recaptcha = req.body.recaptcha;
    let from = name + " " + email;
    let confirmRecaptcha = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${recaptcha}`
    );
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

    const sendMail = await transporter.sendMail({
      from,
      to: process.env.RECIPIENT_EMAIL,
      subject,
      html: message,
    });
    if (confirmRecaptcha.data.success !== true) {
      sendMail.catch(() => {
        throw new Error({ message: "Message not Sent", status: "Failure" });
      });
    }
    if (confirmRecaptcha.data.success === true) {
      sendMail.then((info) => {
        return res.status(200).send({
          message: "Message Sent",
          status: "Ok",
        });
      });
    }
  } catch (error) {
    res.status(400).send({
      message: error.message,
      status: error.status,
    });
  }
};

export default { SendMail };
