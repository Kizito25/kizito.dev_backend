import axios from "axios";
import main from "../functions/mailer.js";

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
    if (confirmRecaptcha.data.success === true) {
      await main(from, subject, message).catch(() => {
        return res
          .status(400)
          .send({ message: "Message not Sent", status: "Failure" });
      });
      return res.status(200).send({
        message: "Message Sent",
        status: "Ok",
      });
    } else {
      return res.status(400).send({
        message: "Cannot verify you authenticity",
      });
    }
  } catch (e) {
    res.status(400).send({
      message: e,
      status: "Server Failure",
    });
  }
};

export default { SendMail };
