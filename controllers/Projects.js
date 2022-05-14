import User from "../model/users.js";
import passport from "passport";
import Projects from "../model/projects.js";

/** Creat Admin Project Controller */

const CreateAdminProjects = async (req, res) => {
  try {
    let role = ["user", "admin", "superAdmin"];
    new Projects({
      ...req.body,
      role: role[1],
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
/** Get Admin Projects Controllers */

const adminProjects = async (req, res) => {
  try {
    // let role = ["user", "admin", "superAdmin"];
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

/** Get a Single Admin Project Controllers */

const adminProject = async (req, res) => {
  try {
    await Projects.findById({ _id: req.params.id }).then((proj) => {
      console.log(proj);
      if (proj === null) {
        return res.status(404).send({ message: "Project not found" });
      }
      Projects.find({ _id: req.params.id })
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

/** Update Admin Project Controllers */

const updateAdminProjects = async (req, res) => {
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

/** Delete Admin Projects Controller */

const deleteAdminProjects = async (req, res) => {
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

/** Check Roles */
const checkRoles = (roles) => (req, res, next) => {
  roles.includes(req.user.role)
    ? next()
    : res.status(401).json({ message: "Access to this resource is forbidden" });
};

export default {
  userAuthentication,
  checkRoles,
  CreateAdminProjects,
  adminProjects,
  adminProject,
  updateAdminProjects,
  deleteAdminProjects,
};
