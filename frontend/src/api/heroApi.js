import api from "./axios";

// Lấy dữ liệu hero (slides + stats)
export const getHeroData = async () => {
  try {
    const [slidesRes, statsRes] = await Promise.all([
      api.get("/hero/slides"),
      api.get("/hero/stats"),
    ]);

    return {
      slides: slidesRes.data,
      stats: statsRes.data,
    };
  } catch (error) {
    console.error("Error fetching hero data:", error);
    throw error;
  }
};

// Lấy slides
export const getSlides = async () => {
  const response = await api.get("/hero/slides");
  return response.data;
};

// Lấy stats
export const getStats = async () => {
  const response = await api.get("/hero/stats");
  return response.data;
};

// Admin: Tạo slide mới
export const createSlide = async (slideData) => {
  const response = await api.post("/hero/slides", slideData);
  return response.data;
};

// Admin: Cập nhật slide
export const updateSlide = async (id, slideData) => {
  const response = await api.put(`/hero/slides/${id}`, slideData);
  return response.data;
};

// Admin: Xóa slide
export const deleteSlide = async (id) => {
  const response = await api.delete(`/hero/slides/${id}`);
  return response.data;
};
