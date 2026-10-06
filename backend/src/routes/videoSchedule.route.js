import express from "express";
import protect from "../middleware/auth.middleware.js";
import {
  createVideoSchedule,
  deleteVideoSchedule,
  getMyVideoSchedule,
  updateVideoSchedule,
} from "../controllers/videoSchedule.controller.js";

const router = express.Router();

router.use(protect);
router.get("/my", getMyVideoSchedule);
router.post("/", createVideoSchedule);
router.patch("/:id", updateVideoSchedule);
router.delete("/:id", deleteVideoSchedule);

export default router;
