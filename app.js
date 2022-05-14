import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import passport from "passport";
import passportConfig from "./middlewares/passport.js";
import userRoute from "./routes/users.js";
import projectRoute from "./routes/projects.js";
import mongooseConn from "./config/_config.js";
import cors from "cors";

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(passport.initialize());
app.use(cors());
passportConfig(passport);

/** Routes API version 1*/
app.use("/api/v1/users/", userRoute);
app.use("/api/v1/projects/", projectRoute);

/** Homepage Route */

app.get("/", (req, res) => {
  res.json({ message: "welcome to Homepage" });
});

app.listen(port, () => {
  console.log(`listening to port: ${port}`);
});
