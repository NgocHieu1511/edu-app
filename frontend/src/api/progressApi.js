import api from "./axios";

export const getMyProgress = () => api.get("/progress/my");
export const createProgress = (data) => api.post("/progress", data);
export const addStudiedMinutes = (id, minutes) =>
  api.patch(`/progress/${id}/studied`, { minutes });
export const deleteProgress = (id) => api.delete(`/progress/${id}`);