import express from "express";
import passport from "passport";
// import { googleAnalytics } from "../controllers/Analytics.js";

/** User Authenticated Profile*/
const userAuthentication = passport.authenticate("jwt", { session: false });

const router = express.Router();

router.get("/", userAuthentication);
// router.get("/", userAuthentication, googleAnalytics.runReport);

export default router;
