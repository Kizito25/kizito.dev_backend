import express from "express";
import serialize from "../functions/serialize.js";
import AuthController from "../controllers/auth.js";
const router = express.Router();

/** Fetch all users */

router.get(
  "/",
  AuthController.userAuthentication,
  AuthController.checkRoles(["admin", "superAdmin"]),
  AuthController.getAllUsers
);

/** Fetch a user */
router.get(
  "/:id",
  AuthController.userAuthentication,
  AuthController.checkRoles(["user, admin", "superAdmin"]),
  AuthController.getUser
);

/** Delete a user */
router.delete(
  "/:id",
  AuthController.userAuthentication,
  AuthController.checkRoles(["admin", "superAdmin"]),
  AuthController.deleteUser
);

/** Login a user */
router.post("/login-user", AuthController.userLogin);

/** Register a user */
router.post("/register-user", AuthController.RegisterUser);

/** Admin Register*/

router.post(
  "/register-admin",
  AuthController.userAuthentication,
  AuthController.checkRoles(["admin", "superAdmin"]),
  AuthController.RegisterAdmin
);

/** Admin Login*/

router.post("/login-admin", AuthController.adminLogin);

/** Super Admin Register*/

router.post(
  "/register-super-admin",
  AuthController.userAuthentication,
  AuthController.checkRoles(["superAdmin"]),
  AuthController.RegisterSuperAdmin
);

/** Super Admin Login*/

router.post("/login-su-admin", AuthController.superAdminLogin);

/** User Protected Route */
router.get(
  "/user-profile",
  AuthController.userAuthentication,
  AuthController.checkRoles(["user", "admin", "superAdmin"]),
  async (req, res) => {
    try {
      return res.status(200).json({ user: serialize.serializeUser(req.user) });
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  }
);

/** Admin Protected Route */
router.get(
  "/admin-profile",
  AuthController.userAuthentication,
  AuthController.checkRoles(["admin", "superAdmin"]),
  async (req, res) => {
    try {
      return res.status(200).json({ user: serialize.serializeUser(req.user) });
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  }
);

/** Super Admin Protected Route */
router.get(
  "/su-admin-profile",
  AuthController.userAuthentication,
  AuthController.checkRoles(["superAdmin"]),
  async (req, res) => {
    try {
      return res.status(200).json({ user: serialize.serializeUser(req.user) });
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  }
);

export default router;
