import User from "../model/users.js";
import passport from "passport";
import Projects from "../model/projects.js";
import AWS from "aws-sdk";
import { Error } from "mongoose";

let accessKeyId = process.env.S3ACCESSKEYID;
let secretAccessKey = process.env.S3SECRETACCESSKEY;
let s3Bucket = process.env.S3BUCKET;

AWS.config.update({
  region: "us-east-2",
});

let s3 = new AWS.S3({
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});

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
    await Projects.findById({ _id: req.params.id })
      .populate("user_id")
      .then((project) => {
        if (!project) {
          return res.send({
            message: "Project not found",
          });
        }
        res.send({
          project,
          message: "Projects fetched successfully",
        });
      })
      .catch((error) => {
        return res.status(401).send({ message: "Invalid Request ID" });
      });
  } catch (e) {
    res.status(401).send({ message: "Cannot fetch projects" });
  }
};

/** Update A Single Project Controllers */

const updateProject = async (req, res) => {
  try {
    if (Object.entries(req.files).length === 0) {
      let project = await Projects.findByIdAndUpdate(
        { _id: req.params.id },
        req.body
      );
      if (project) {
        console.log(project);
        return res.send({
          message: "Project updated successfully",
        });
      }
    } else {
      let { mobile_photo, photo, images } = req.files;
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

      if (!mobile_photo && !photo && !images) {
        throw new Error("No Images Selected");
      } else {
        /** 
       * 
       * 
       * 
      Acccept Mobiles Photo Upload


       * */

        if (mobile_photo) {
          mobile_photo = mobile_photo[0];
          const mobile_photo_params = {
            Bucket: s3Bucket,
            Key: uniqueSuffix + mobile_photo.originalname,
            Body: mobile_photo.buffer,
            ACL: "public-read",
          };
          await s3.upload(mobile_photo_params, async (err, data) => {
            if (err) {
              throw new Error("Error: ", err);
            } else {
              const mobilePhoto = data.Location;
              await Projects.findByIdAndUpdate(
                { _id: req.params.id },
                { mobile_photo: mobilePhoto }
              );
            }
          });
        }
        /** 
       * 
       * 
       * 
      Acccept Desktop Photo Upload


       * */
        if (photo) {
          photo = photo[0];
          const photo_params = {
            Bucket: s3Bucket,
            Key: uniqueSuffix + photo.originalname,
            Body: photo.buffer,
            ACL: "public-read",
          };
          await s3.upload(photo_params, async (err, data) => {
            if (err) {
              throw new Error("Error: ", err);
            } else {
              const desktopPhoto = data.Location;
              await Projects.findByIdAndUpdate(
                { _id: req.params.id },
                { photo: desktopPhoto }
              );
            }
          });
        }
        // upload multiple images in image2 field to S3 and get their S3 links
        if (images) {
          await images.forEach((image) => {
            let imageParams = {
              Bucket: s3Bucket,
              Key: uniqueSuffix + image.originalname,
              Body: image.buffer,
              ContentType: image.mimetype,
              ACL: "public-read",
            };
            s3.upload(imageParams, async (err, data) => {
              if (err) {
                throw new Error("Error: ", err);
              } else {
                const imageLinks = data.Location;
                await Projects.findByIdAndUpdate(
                  { _id: req.params.id },
                  { images: imageLinks }
                );
              }
            });
          });
        }
        return res.send({ message: "Images uploaded successfully!" });
      }
    }
  } catch (error) {
    return res.status(401).send({ message: error.message });
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
