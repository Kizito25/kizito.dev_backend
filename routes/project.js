import express from "express";
import ProjectController from "../controllers/Project.js";
const router = express.Router();
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage });

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
const uploads = upload.fields([
  { name: "photo", maxCount: 1 },
  { name: "images", maxCount: 5 },
  { name: "mobile_photo", maxCount: 1 },
]);
router.patch(
  "/:id",
  ProjectController.userAuthentication,
  uploads,
  ProjectController.updateProject
);

/** Delete a single Project */
router.delete(
  "/:id",
  ProjectController.userAuthentication,
  ProjectController.deleteProject
);

export default router;
