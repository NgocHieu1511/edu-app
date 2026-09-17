import api from "./axios";

export const chatWithAI = (message) => api.post("/ai/chat", { message });