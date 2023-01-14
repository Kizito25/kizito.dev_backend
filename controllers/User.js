import User from "../model/users.js";
import passport from "passport";
import AWS from 'aws-sdk'
import { serialize } from '../functions/serialize.js';
let accessKeyId = process.env.S3ACCESSKEYID
let secretAccessKey = process.env.S3SECRETACCESSKEY
let s3Bucket = process.env.S3BUCKET

/** Get All Users */

const getAllUsers = async (req, res) => {
  /** check if user exists */
  const users = await User.find({});
  if (!users) {
    console.log("No users found");
    res.status(404).send({ message: "No users found" });
  }
  res.status(200).send({ users });
};
/** Get A Single User */

const getUser = async (req, res) => {
  try {
    const user = await User.find({ _id: req.params.id });
    if (!user) {
      res.status(404).send({ message: "No user found" });
    }
    let serializedUser = serialize.serializeUser(user[0])
    // console.log(serializedUser)
    // console.log(user)
    res.status(200).send({ serializedUser });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

/** Update A Single User */

const updateUser = async (req, res) => {
  try {
    if (req.file) {
      // console.log(req.file)
      AWS.config.update({
        region: 'us-east-2'
      })

      let s3 = new AWS.S3({
        credentials: {
          accessKeyId: accessKeyId,
          secretAccessKey: secretAccessKey
        }
      })
      let { originalname, mimetype, buffer } = req.file

      let uploadParams = {
        Bucket: s3Bucket,
        Key: Date.now() + "-" + originalname,
        Body: Buffer.from(buffer),
        ContentType: mimetype,
        ACL: 'public-read'
      }
      await s3.upload(uploadParams, async function (err, data) {
        if (err) {
          throw new Error(err)
        }
        if (data) {
          let { username, firstName, lastName, email } = req.body
          let updated = { username, firstName, lastName, email, profile_image: data.Location }
          let updatedUser = await User.findByIdAndUpdate({ _id: req.params.id }, updated)
          if (!updatedUser) {
            throw new Error("Could not update user details")
          }
         return res.status(200).send({ message: "Updated was updated successfully" });
        }
      })
    } else {
      let updatedUser = await User.findByIdAndUpdate({ _id: req.params.id }, req.body)
      if (!updatedUser) {
        throw new Error("Could not update user details")
      }
      res.status(200).send({ message: "Updated was updated successfully" });
    }

  } catch (e) {
    res.status(500).send({ message: e.message });

  }
};

/** Delete A User */

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.id });
    /** check if user exists */
    if (!user) {
      return res.status(404).send({ message: "No user found" });
    } else {
      await User.findByIdAndDelete({ _id: req.params.id }).then((user) => {
        res.status(200).send({
          message: `${user.firstName} ${user.lastName} was deleted successfully`,
        });
      });
    }
  } catch (e) {
    res.status(401).send({ message: e.message });
  }
};

/** User Authenticated Profile*/
const userAuthentication = passport.authenticate("jwt", { session: false });

export default {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  userAuthentication,
};
