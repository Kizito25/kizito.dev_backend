import express from "express";
import UserController from "../controllers/User.js";
import multer from  'multer'
import {serialize } from '../functions/serialize.js'

const router = express.Router();
const upload = multer()

/** Fetch all users */

router.get("/", UserController.userAuthentication, UserController.getAllUsers);

/** Fetch a user */
router.get("/:id", UserController.userAuthentication, UserController.getUser);

/** Fetch a user and update */
router.patch(
  "/:id",
  UserController.userAuthentication, upload.single('image'),
  UserController.updateUser
);

/** Delete a user */
router.delete(
  "/:id",
  UserController.userAuthentication,
  UserController.deleteUser
);

// /** User Protected Route */
// router.get("/profile", UserController.userAuthentication, async (req, res) => {
//   try {

//     console.log(req)
//      return res.status(200).json({ user: serialize.serializeUser() });
//   } catch (e) {
//     return res.status(500).json({ message: e.message });
//   }
// });

export default router;
