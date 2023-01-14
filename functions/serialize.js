import hash from "crypto";

/**
 * @DESC Filter the user object to only include the fields we want to send to frontend.
 * */

const hashText = (text) => {
  return hash.randomBytes(64).toString(text);
};
// hashText("hex");

const serializeUser = (user) => {
  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    avatar: user.profile_image
  };
};

export const  serialize = {
  serializeUser,
};
