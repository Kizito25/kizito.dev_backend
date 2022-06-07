import User from "../model/users.js";
import passport from "passport";
import Projects from "../model/projects.js";

/** Create Project Controller */

const createProject = async (req, res) => {
  try {
    new Projects({
      ...req.body,
    })
      .save()
      .then((project) => {
        res.send({
          project,
          message: "Project created successfully",
        });
      })
      .catch((error) => {
        res.status(401).send({ message: error.message });
      });
  } catch (e) {
    res.status(401).send({ message: "Cannot Create Project" });
  }
};
/** Get All Projects Controllers */

const allProjects = async (req, res) => {
  try {
    Projects.find({})
      .then((projects) => {
        res.send({
          projects,
          message: "Projects fetched successfully",
        });
      })
      .catch((error) => {
        res.status(401).send({ message: error.message });
      });
  } catch (e) {
    res.status(401).send({ message: "Cannot fetch projects" });
  }
};

/** Get A Single Project Controllers */

const singleProject = async (req, res) => {
  try {
    await Projects.findById({ _id: req.params.id }).then((proj) => {
      console.log(proj);
      if (proj === null) {
        return res.status(404).send({ message: "Project not found" });
      }
      Projects.find({ _id: req.params.id })
        .populate("user_id")

        .then((project) => {
          res.send({
            project,
            message: "Projects fetched successfully",
          });
        })
        .catch((error) => {
          res.status(401).send({ message: error.message });
        });
    });
  } catch (e) {
    res.status(401).send({ message: "Cannot fetch projects" });
  }
};

/** Update A Single Project Controllers */

const updateProject = async (req, res) => {
  try {
    Projects.findByIdAndUpdate({ _id: req.params.id }, req.body)
      .then((updatedProject) => {
        res.send({
          updatedProject,
          message: "Project updated successfully",
        });
      })
      .catch((error) => {
        console.log(req.body);
        res.status(401).send({ message: error.message });
      });
  } catch (e) {
    console.log(req.body);
    res.status(401).send({ message: "Cannot update project" });
  }
};

/** Delete A Single Project Controller */

const deleteProject = async (req, res) => {
  try {
    await Projects.findById({ _id: req.params.id })
      .then((proj) => {
        if (proj === null) {
          return res.status(404).send({ message: "Project not found" });
        }
        Projects.findByIdAndDelete({ _id: req.params.id })
          .then((deletedProject) => {
            res.send({
              deletedProject,
              message: "Project deleted successfully",
            });
          })
          .catch((error) => {
            res.status(401).send({ message: error.message });
          });
      })
      .catch(() => {
        res.status(401).send({ message: "Project does not exist" });
      });
  } catch (e) {
    res.status(401).send({ message: "Cannot delete project" });
  }
};

/** User Authenticated Profile*/
const userAuthentication = passport.authenticate("jwt", { session: false });

export default {
  userAuthentication,
  createProject,
  allProjects,
  singleProject,
  updateProject,
  deleteProject,
};
