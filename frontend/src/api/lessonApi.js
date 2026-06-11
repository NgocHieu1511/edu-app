import api from "./axios";

export const createLesson = (data) => {
  return api.post("/lessons", data);
};

export const getLessonsByCourse = (courseId) => {
  return api.get(`/lessons/course/${courseId}`);
};

export const deleteLesson = (id) => {
  return api.delete(`/lessons/${id}`);
};
export const getLessonById = (id) => {
  return api.get(`/lessons/${id}`);
};
