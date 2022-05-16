import express from "express";
import UserController from "../controllers/User.js";
const router = express.Router();

/** Fetch all users */

router.get("/", UserController.userAuthentication, UserController.getAllUsers);

/** Fetch a user */
router.get("/:id", UserController.userAuthentication, UserController.getUser);

/** Fetch a user and update */
router.patch(
  "/:id",
  UserController.userAuthentication,
  UserController.updateUser
);

/** Delete a user */
router.delete(
  "/:id",
  UserController.userAuthentication,
  UserController.deleteUser
);

/** User Protected Route */
router.get("/profile", UserController.userAuthentication, async (req, res) => {
  try {
    return res.status(200).json({ user: serialize.serializeUser(req.user) });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

export default router;
