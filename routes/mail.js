import express from "express";
const router = express.Router();
import mailController from "../controllers/mail.js";

/** Fetch all users */

router.post("/", mailController.SendMail);

export default router;
