import express from "express";

import protect from "../middleware/auth.middleware.js";
import {
  addStudiedMinutes,
  createProgress,
  deleteProgress,
  getMyProgress,
} from "../controllers/progress.controller.js";

const router = express.Router();

router.use(protect);
router.get("/my", getMyProgress);
router.post("/", createProgress);
router.patch("/:id/studied", addStudiedMinutes);
router.delete("/:id", deleteProgress);

export default router;