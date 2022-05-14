import Users from "../model/users.js";
const SECRET_KEY = process.env.SECRET_KEY;
import { Strategy, ExtractJwt } from "passport-jwt";

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET_KEY,
};

const passport = (passport) => {
  passport.use(
    new Strategy(options, async (jwt_payload, done) => {
      await Users.findById(jwt_payload.userID)
        .then((user) => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch((err) => console.log(err));
    })
  );
};
export default passport;
