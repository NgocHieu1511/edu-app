import express from "express";

import {
  createLesson,
  getLessonsByCourse,
  deleteLesson,
  getLessonById,
} from "../controllers/lesson.controller.js";

import protect from "../middleware/auth.middleware.js";
import isAdmin from "../middleware/admin.middleware.js";

const router = express.Router();

router.post("/", protect, isAdmin, createLesson);

router.get("/course/:courseId", getLessonsByCourse);

router.delete("/:id", protect, isAdmin, deleteLesson);
router.get("/:id", getLessonById);

export default router;
