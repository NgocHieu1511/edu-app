import api from "./axios";

export const getCourses = () => {
  return api.get("/courses");
};
export const getCourseById = (id) => api.get(`/courses/${id}`);
export const deleteCourse = (id) => {
  return api.delete(`/courses/${id}`);
};
export const createCourse = (courseData) => {
  return api.post("/courses", courseData);
};
export const updateCourse = (id, data) => {
  return api.put(`/courses/${id}`, data);
};
