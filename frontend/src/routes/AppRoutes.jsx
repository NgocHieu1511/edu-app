import { Routes, Route } from "react-router-dom";

import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import CourseDetailPage from "../pages/CourseDetailPage";
import MyCoursesPage from "../pages/MyCoursesPage";
import AdminDashboard from "../pages/AdminDashboard";
import AdminCoursesPage from "../pages/AdminCoursesPage";
import AddCoursePage from "../pages/AddCoursePage";
import EditCoursePage from "../pages/EditCoursePage";
import AdminLessonsPage from "../pages/AdminLessonsPage";
import AddLessonPage from "../pages/AddLessonPage";
import LessonLearningPage from "../pages/LessonLearningPage";
import BlogPage from "../pages/BlogPage";
import BlogDetailPage from "../pages/BlogDetailPage";
import AdminBlogsPage from "../pages/AdminBlogsPage";
import BlogEditorPage from "../pages/BlogEditorPage";
import PrizePage from "../pages/PrizePage";
import ShortsPage from "../pages/ShortsPage";
import AttendancePage from "../pages/AttendancePage";
import RoadmapPage from "../pages/RoadmapPage";
import ProgressPage from "../pages/ProgressPage";
import AdminRoute from "../components/AdminRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/courses/:id" element={<CourseDetailPage />} />
      <Route path="/roadmap" element={<RoadmapPage />} />
      <Route path="/progress" element={<ProgressPage />} />
      <Route path="/my-courses" element={<MyCoursesPage />} />
      <Route path="/rewards" element={<PrizePage />} />
      <Route path="/shorts" element={<ShortsPage />} />
      <Route path="/attendance" element={<AttendancePage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:id" element={<BlogDetailPage />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/courses" element={<AdminCoursesPage />} />
      <Route path="/admin/courses/add" element={<AddCoursePage />} />
      <Route path="/admin/courses/edit/:id" element={<EditCoursePage />} />
      <Route
        path="/admin/blogs"
        element={
          <AdminRoute>
            <AdminBlogsPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/blogs/add"
        element={
          <AdminRoute>
            <BlogEditorPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/blogs/edit/:id"
        element={
          <AdminRoute>
            <BlogEditorPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/courses/:courseId/lessons"
        element={<AdminLessonsPage />}
      />

      <Route
        path="/admin/courses/:courseId/lessons/add"
        element={<AddLessonPage />}
      />
      <Route
        path="/learn/:courseId/:lessonId"
        element={<LessonLearningPage />}
      />
    </Routes>
  );
}

export default AppRoutes;
