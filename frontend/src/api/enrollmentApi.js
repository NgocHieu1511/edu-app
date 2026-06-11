import api from "./axios";

export const enrollCourse = (courseId) => {
  return api.post("/enrollments", {
    courseId,
  });
};

export const getMyCourses = () => {
  return api.get("/enrollments/my-courses");
};
