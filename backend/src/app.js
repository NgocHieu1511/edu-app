import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import courseRoutes from "./routes/course.route.js";
import lessonRoutes from "./routes/lesson.route.js";
import enrollmentRoutes from "./routes/enrollment.route.js";
import heroRoutes from "./routes/hero.route.js";
import errorHandler from "./middleware/error.middleware.js";
import adminRoutes from "./routes/admin.route.js";
import blogRoutes from "./routes/blog.route.js";
import attendanceRoutes from "./routes/attendance.route.js";
import aiRoutes from "./routes/ai.route.js";
import path from "path";
import { fileURLToPath } from "url";
const app = express();
const uploadsPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "uploads",
);

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/hero", heroRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/ai", aiRoutes);
app.use(errorHandler);
app.use("/uploads", express.static(uploadsPath));

export default app;
