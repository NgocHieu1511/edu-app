import api from "./axios";

export const getMyVideoSchedule = () => api.get("/video-schedule/my");
export const createVideoSchedule = (data) => api.post("/video-schedule", data);
export const updateVideoSchedule = (id, data) => api.patch(`/video-schedule/${id}`, data);
export const deleteVideoSchedule = (id) => api.delete(`/video-schedule/${id}`);
