import User from "../model/users.js";
import passport from "passport";
import serialize from "../functions/serialize.js";

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
    let { username, email } = req.body;

    let id = req.params.id;
    const user = await User.find({
      $or: [{ username: id || username }, { email: id || email }],
    });
    if (!user) {
      console.log("No user found");
      res.status(404).send({ message: "No user found" });
    }
    res.status(200).send({ user });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

/** Update A Single User */

const updateUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate({ _id: req.params.id }, req.body)
      .then((user) => {
        res.status(200).send({
          user: serialize.serializeUser(user),
          message: `${user.firstName} ${user.lastName} was updated successfully`,
        });
      })
      .catch((err) => {
        res.status(404).send({ message: err.message });
      });
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
