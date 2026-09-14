import express from "express";

import protect from "../middleware/auth.middleware.js";
import {
  checkIn,
  getAttendanceSummary,
  getMyAttendance,
} from "../controllers/attendance.controller.js";

const router = express.Router();

router.use(protect);

router.get("/my", getMyAttendance);
router.get("/summary", getAttendanceSummary);
router.post("/checkin", checkIn);

export default router;
