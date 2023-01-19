import User from "../model/users.js";
import bcrypt from "bcrypt";
import passport from "passport";
import { validate } from "uuid";

const resetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    let user = await User.find({ _id: id });

    user = user[0];

    let hash = await bcrypt.hash(password, 12);
    if (!hash) throw new Error("Failed to update password");

    user.password = hash;
    user
      .save()
      .then(() => {
        res.status(200).send({
          status: "ok",
          message: "successfull",
        });
      })
      .catch((error) => {
        throw new Error(error);
      });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
};

/** User Authenticated Profile*/
const userAuthentication = passport.authenticate("jwt", { session: false });

export default {
  resetPassword,
  userAuthentication,
};

// .then((user) => {
//   if (user) {
//     console.log(user);

//   bcrypt.hash(password, 12).then((hash) => {
//     new User({
//       ...req.body,
//       password: hash,
//     })
//       .save()
//       .then((user) => {
//         res.json({
//           message: `${user.firstName} ${user.lastName} has been registered successfully!`,
//         });
//       })
//       .catch((error) => {
//         res.json({ message: error.message });
//       });
//   });
// });
//   }
