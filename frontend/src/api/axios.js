import axios from "axios";

const api = axios.create({
  // Sử dụng biến môi trường, nếu không có (khi chạy local) thì tự động dùng localhost:5000
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
