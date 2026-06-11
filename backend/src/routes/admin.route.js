import express from "express";

import protect from "../middleware/auth.middleware.js";
import isAdmin from "../middleware/admin.middleware.js";

import { getDashboard } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/dashboard", protect, isAdmin, getDashboard);

export default router;
