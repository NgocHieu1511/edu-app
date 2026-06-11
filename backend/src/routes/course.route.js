import express from "express";

import protect from "../middleware/auth.middleware.js";
import isAdmin from "../middleware/admin.middleware.js";
import upload from "../middleware/upload.middleware.js";
import {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from "../controllers/course.controller.js";

const router = express.Router();

router.get("/", getCourses);

router.get("/:id", getCourseById);

router.post("/", protect, isAdmin, upload.single("thumbnail"), createCourse);

router.put("/:id", protect, isAdmin, upload.single("thumbnail"), updateCourse);

router.delete("/:id", protect, isAdmin, deleteCourse);

export default router;
