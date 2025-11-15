// src/service/userApi.js
import api from "../services/authApi"; // sesuai strukturmu

const userApi = {
  getById: (id) => api.get(`/user/${id}`),
  update: (id, formData) =>
    api.put(`/user/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updatePassword: (id, payload) => api.put(`/user/${id}/password`, payload),
  updateStatus: (id, payload) => api.put(`/user/${id}/status`, payload),
};

export default userApi;
