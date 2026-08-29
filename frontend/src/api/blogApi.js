import api from "./axios";

export const getBlogs = () => api.get("/blogs");
export const searchBlogs = (query) =>
  api.get("/blogs/search", { params: { q: query } });
export const getBlogById = (id) => api.get(`/blogs/${id}`);
export const createBlog = (data) => api.post("/blogs", data);
export const updateBlog = (id, data) => api.put(`/blogs/${id}`, data);
export const deleteBlog = (id) => api.delete(`/blogs/${id}`);
