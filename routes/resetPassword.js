import express from "express";
import PasswordController from "../controllers/Password.js";
import { validatePassword } from "../middlewares/validatePasswordMiddleware.js";

const router = express.Router();
/** Fetch user and update password */

router.patch(
  "/:id",
  PasswordController.userAuthentication,
  validatePassword,
  PasswordController.resetPassword
);

export default router;
