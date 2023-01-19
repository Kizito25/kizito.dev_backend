export const validatePassword = (req, res, next) => {
  let { password } = req.body;
  let hasLowercase = /[a-z]/.test(password);
  let hasUppercase = /[A-Z]/.test(password);
  let hasNonText = /[^a-zA-Z0-9]/.test(password);
  let hasDigit = /\d/.test(password);
  let isLongEnough = password.length >= 8;

  if (hasLowercase && hasUppercase && hasNonText && hasDigit && isLongEnough) {
    console.log("Valid Password");
    next();
  } else {
    console.log("InvalidPassword");
    throw new Error("Password is not valid");
  }
};
