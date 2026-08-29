import express from "express";
import protect from "../middleware/auth.middleware.js";
import isAdmin from "../middleware/admin.middleware.js";
import uploadBlogImage from "../middleware/blog-upload.middleware.js";
import {
  getBlogs,
  searchBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blog.controller.js";

const router = express.Router();

router.get("/", getBlogs);
router.get("/search", searchBlogs);
router.get("/:id", getBlogById);
router.post(
  "/",
  protect,
  isAdmin,
  uploadBlogImage.single("thumbnail"),
  createBlog,
);
router.put(
  "/:id",
  protect,
  isAdmin,
  uploadBlogImage.single("thumbnail"),
  updateBlog,
);
router.delete("/:id", protect, isAdmin, deleteBlog);

export default router;
