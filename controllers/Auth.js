import User from "../model/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

let SECRET_KEY = process.env.SECRET_KEY;

/**  Register User Controller */

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (username.length <= 3) {
      return res.status(400).send({
        message: "Username must not be less than or equals to 3 characters",
      });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .send({ message: "Password must not be less than 8 characters" });
    }
    if (password.length > 20) {
      return res.status(400).send({
        message: "Password must not be more than 20 characters",
      });
    }
    User.find({ $or: [{ username }, { email }] }).then((user) => {
      if (user) {
        let userEmail = user.map((usr) => usr.email)[0];
        let userUsername = user.map((usr) => usr.username)[0];
        if (userEmail === email)
          return res
            .status(400)
            .send({ message: `Oops! User with ${email} already exists` });
        if (userUsername === username)
          return res
            .status(400)
            .send({ message: `Oops! User with ${username} already exists` });
      }
      bcrypt
        .hash(password, 12)
        .then((hash) => {
          new User({
            ...req.body,
            password: hash,
          })
            .save()
            .then((user) => {
              res.json({
                message: `${user.firstName} ${user.lastName} has been registered successfully!`,
              });
            })
            .catch((error) => {
              res.json({ message: error.message });
            });
        })
        .catch((error) => {
          res.json({ message: error.message });
        });
    });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

/** Login User */

const userLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    /** check if user exists */
    // $or: [{ username: username }, { email: email || username }],

    let user = await User.find({ username });

    if (user.length === 0) {
      throw new Error("Username is incorrect");
    }
    /** Check if password is correct */
    user = user[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password is incorrect" });
    } else {
      const token = jwt.sign(
        {
          userID: user._id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          image: user.profile_image,
        },
        SECRET_KEY
      );
      const result = {
        token: `Bearer ${token}`,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
          display_picture: user.profile_image,
        },
      };
      return res.status(200).send({
        authData: result,
        message: "Login Successful",
      });
    }
  } catch (e) {
    return res.status(500).send({ message: e.message });
  }
};

export default {
  registerUser,
  userLogin,
};
