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

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/courses/:id" element={<CourseDetailPage />} />
      <Route path="/my-courses" element={<MyCoursesPage />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/courses" element={<AdminCoursesPage />} />
      <Route path="/admin/courses/add" element={<AddCoursePage />} />
      <Route path="/admin/courses/edit/:id" element={<EditCoursePage />} />
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
