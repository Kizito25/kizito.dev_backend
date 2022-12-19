import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import passport from "passport";
import passportConfig from "./middlewares/passport.js";
import userRoute from "./routes/user.js";
import authRoute from "./routes/auth.js";
import projectRoute from "./routes/project.js";
import mailRoute from "./routes/mail.js";
import mongooseConn from "./config/_config.js";
import cors from "cors";

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }))
app.use(passport.initialize());

app.use(cors());
passportConfig(passport);

/** Routes API version 1*/
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users/", userRoute);
app.use("/api/v1/projects/", projectRoute);
app.use("/api/v1/mail/", mailRoute);

/** Homepage Route */

app.get("/", (req, res) => {
  res.json({ message: "welcome to Homepage" });
});

app.listen(port, () => {
  console.log(`listening to port: ${port}`);
});
