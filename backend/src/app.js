import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import courseRoutes from "./routes/course.route.js";
import lessonRoutes from "./routes/lesson.route.js";
import enrollmentRoutes from "./routes/enrollment.route.js";
import errorHandler from "./middleware/error.middleware.js";
import adminRoutes from "./routes/admin.route.js";
import path from "path";
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/admin", adminRoutes);
app.use(errorHandler);
app.use("/uploads", express.static("uploads"));

export default app;
