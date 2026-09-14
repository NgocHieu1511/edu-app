import api from "./axios";

export const getMyAttendance = () => api.get("/attendance/my");
export const getAttendanceSummary = () => api.get("/attendance/summary");
export const checkInAttendance = () => api.post("/attendance/checkin");
