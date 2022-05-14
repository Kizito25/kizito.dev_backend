import hash from 'crypto';

/**
 * @DESC Filter the user object to only include the fields we want to send to frontend.
 * */

let serialize = {};
const serializeUser = (user) => {
  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

const hashText = (text) => {
  console.log(hash.randomBytes(64).toString(text))
  return hash.randomBytes(64).toString(text);
}
hashText("hex");


export default serialize = {
  serializeUser,
};
