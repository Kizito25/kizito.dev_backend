import express from "express";
import ProjectController from "../controllers/Project.js";
const router = express.Router();

/** Create Project */

router.post(
  "/",
  ProjectController.userAuthentication,
  ProjectController.createProject
);

/** Get all Projects */

router.get("/", ProjectController.allProjects);

/** Get a single Project */
router.get("/:id", ProjectController.singleProject);

/** Update a single Project */
router.patch(
  "/:id",
  ProjectController.userAuthentication,
  ProjectController.updateProject
);
// /** Update a single Project */
// router.put(
//   "/:id",
//   ProjectController.userAuthentication,
//   ProjectController.updateProject
// );

/** Delete a single Project */
router.delete(
  "/:id",
  ProjectController.userAuthentication,
  ProjectController.deleteProject
);

export default router;
