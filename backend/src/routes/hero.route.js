import express from "express";
import { getSlides, getStats } from "../controllers/hero.controller.js";

const router = express.Router();

router.get("/slides", getSlides);
router.get("/stats", getStats);

export default router;
