import express from "express";

import protect from "../middleware/auth.middleware.js";
import isAdmin from "../middleware/admin.middleware.js";

import {
  getDashboard,
  getDashboardStats,
  getDashboardActivities,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/dashboard", protect, isAdmin, getDashboard);
router.get("/dashboard/stats", protect, isAdmin, getDashboardStats);
router.get("/dashboard/activities", protect, isAdmin, getDashboardActivities);

export default router;
