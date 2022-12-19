import express from "express";
import AuthController from "../controllers/Auth.js";

const router = express.Router();

/** Login a user */
router.post("/login", AuthController.userLogin);

/** Register a user */
router.post("/register", AuthController.registerUser);

export default router;
