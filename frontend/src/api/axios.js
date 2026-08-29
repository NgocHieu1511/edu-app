import axios from "axios";

export const API_ORIGIN =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  // Sử dụng biến môi trường, nếu không có (khi chạy local) thì tự động dùng localhost:5000
  baseURL: `${API_ORIGIN}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
