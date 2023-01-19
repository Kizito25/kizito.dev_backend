import express from "express";
import BlogController from "../controllers/Blogs.js";

const router = express.Router();

/** Fetch Blog Posts */
router.get("/", BlogController.fetchBlogs);

export default router;
