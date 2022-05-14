import express from "express";
// import User from "../model/users.js";
// import Project from "../model/projects";
// import serialize from "../functions/serialize.js";
import ProjectController from "../controllers/Projects.js";
const router = express.Router();

/** Create Admin Projects */

router.post(
  "/admin-create",
  ProjectController.userAuthentication,
  ProjectController.checkRoles(["admin", "superAdmin"]),
  ProjectController.CreateAdminProjects
);

/** Get all Admin Projects */

router.get(
  "/admin",
  ProjectController.userAuthentication,
  ProjectController.checkRoles(["admin", "superAdmin"]),
  ProjectController.adminProjects
);

/** Get a single Admin Project */

router.get(
  "/admin/:id",
  ProjectController.userAuthentication,
  ProjectController.checkRoles(["admin", "superAdmin"]),
  ProjectController.adminProject
);

/** Update Admin Project */
router.put(
  "/admin/:id",
  ProjectController.userAuthentication,
  ProjectController.checkRoles(["admin", "superAdmin"]),
  ProjectController.updateAdminProjects
);

/** Delete Admin Project */
router.delete(
  "/admin/:id",
  ProjectController.userAuthentication,
  ProjectController.checkRoles(["admin", "superAdmin"]),
  ProjectController.deleteAdminProjects
);

/*

/** Update Admin Project */

/** Super Admin Register*/

// router.post("/register-super-admin", AuthController.RegisterSuperAdmin);

// /** User Login*/

// router.post("/login-user", AuthController.userLogin);

// /** Admin Login*/

// router.post("/login-admin", AuthController.adminLogin);

// /** Super Admin Login*/

// router.post("/login-su-admin", AuthController.superAdminLogin);

export default router;
