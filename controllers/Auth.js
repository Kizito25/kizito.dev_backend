import User from "../model/users.js";
import bcrypt from "bcrypt";
import passport from "passport";
import jwt from "jsonwebtoken";

let SECRET_KEY = process.env.SECRET_KEY;

/**  Register User Controller */

const RegisterUser = async (req, res) => {
  let role = ["user", "admin", "superAdmin"];
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
          role: role[0],
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
};

/** Register Admin Controller */

const RegisterAdmin = async (req, res) => {
  try {
    let role = ["user", "admin", "superAdmin"];
    const { firstName, username, email, password } = req.body;
    if (
      username === undefined ||
      email === undefined ||
      password === undefined ||
      firstName === undefined
    ) {
      return res.status(401).send({ message: "Please enter user data" });
    }
    if (username.length <= 3) {
      return res.status(401).send({
        massage: "Username must not be less than or equals to 3 characters",
      });
    }
    if (password.length < 8) {
      return res.status(401).send({
        message: "Password must not be less than 8 characters",
      });
    }
    if (password.length > 20) {
      return res.status(401).send({
        message: "Password must not be more than 20 characters",
      });
    }
    User.find({ $or: [{ email }, { username }] }).then((user) => {
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
            role: role[1],
          })
            .save()
            .then((user) => {
              res.json({
                message: "Registered successfully, Please Login!",
              });
            })
            .catch((error) => {
              res.status(404).send({ message: error.message });
            });
        })
        .catch((error) => {
          res.send({ message: error.message });
        });
    });
  } catch (e) {
    res.send({ message: e.message });
  }
};

/** Register Super Admin Controller */

const RegisterSuperAdmin = async (req, res) => {
  let role = ["user", "admin", "superAdmin"];
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
  User.findOne({ username, email }).then((user) => {
    if (user) {
      return res.status(404).send({ message: "Oops! User already exists" });
    }
    bcrypt
      .hash(password, 12)
      .then((hash) => {
        new User({
          ...req.body,
          password: hash,
          role: role[2],
        })
          .save()
          .then((user) => {
            res.status(200).send({
              message: `${user.firstName} ${user.lastName} has been registered successfully!`,
            });
          })
          .catch((error) => {
            res.send({ message: error.message });
          });
      })
      .catch((error) => {
        res.send({ message: error.message });
      });
  });
};

/** Login User */

const userLogin = async (req, res) => {
  let role = ["user", "admin", "superAdmin"];
  const { username, email, password } = req.body;

  /** check if user exists */
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  /** check if roles match */
  if (user.role !== role[0]) {
    return res
      .status(404)
      .json({ message: "Access to this resource is forbidden" });
  }

  /** If you got here, that means the user does exist */
  /** Check if password is correct */

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Password is incorrect" });
  } else {
    const token = jwt.sign(
      {
        userID: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      SECRET_KEY,
      { expiresIn: "7 days" }
    );
    const result = {
      token: `Bearer ${token}`,
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
        expiresIn: "7 days",
      },
    };
    return res.status(200).json({
      ...result,
      message: "Login Successful",
    });
  }
};

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
  /** check if user exists */
  const user = await User.findById({ _id: req.params.id });
  if (!user) {
    console.log("No user found");
    res.status(404).send({ message: "No user found" });
  }
  res.status(200).send({ user });
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

/** Login Admin */

const adminLogin = async (req, res) => {
  let role = ["user", "admin", "superAdmin"];
  const { username, email, password } = req.body;

  /** check if user exists */
  try {
    const user =
      (await User.findOne({ username })) || (await User.findOne({ email }));
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    /** check if roles match */

    if (user.role !== role[1]) {
      return res
        .status(404)
        .json({ message: "Access to this resource is forbidden" });
    }

    /** If you got here, that means the user does exist */
    /** Check if password is correct */

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password is incorrect" });
    } else {
      const token = jwt.sign(
        {
          userID: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        SECRET_KEY,
        { expiresIn: "7 days" }
      );
      const result = {
        token: `Bearer ${token}`,
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
          role: user.role,
          expiresIn: "7 days",
        },
      };
      console.log(result);
      return res.status(200).json({
        ...result,
        message: "Login Successful",
      });
    }
  } catch (e) {
    res.status(401).json({ message: e.message });
  }
};

/** Login Super Admin */

const superAdminLogin = async (req, res) => {
  let role = ["user", "admin", "superAdmin"];
  const { username, email, password } = req.body;

  /**  check if user exists */

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  /** check if roles match */

  if (user.role !== role[2]) {
    return res
      .status(404)
      .json({ message: "Access to this resource is forbidden" });
  }

  /** If you got here, that means the user does exist */
  /** Check if password is correct */

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Password is incorrect" });
  } else {
    const token = jwt.sign(
      {
        userID: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      SECRET_KEY,
      { expiresIn: "7 days" }
    );
    const result = {
      token: `Bearer ${token}`,
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
        expiresIn: "7 days",
      },
    };
    return res.status(200).json({
      ...result,
      message: "Login Successful",
    });
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
  getAllUsers,
  getUser,
  deleteUser,
  RegisterUser,
  RegisterAdmin,
  RegisterSuperAdmin,
  userLogin,
  adminLogin,
  superAdminLogin,
  userAuthentication,
  checkRoles,
};
