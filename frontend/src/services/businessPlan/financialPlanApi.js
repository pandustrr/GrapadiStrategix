import api from "../authApi";

export const financialPlanApi = {
  // Get all financial plans
    getAll: async (params = {}) => {
        try {
        const response = await api.get("/financial-plans", { params });
        return response.data;
        } catch (error) {
        throw error.response?.data || error;
        }
    },

  // Get financial summary
    getSummary: async (params = {}) => {
        try {
        const response = await api.get("/financial-plans/summary", { params });
        return response.data;
        } catch (error) {
        throw error.response?.data || error;
        }
    },

  // Get single financial plan
    getById: async (id) => {
        try {
        const response = await api.get(`/financial-plans/${id}`);
        return response.data;
        } catch (error) {
        throw error.response?.data || error;
        }
    },

  // Create new financial plan
    create: async (data) => {
        try {
        const response = await api.post("/financial-plans", data);
        return response.data;
        } catch (error) {
        throw error.response?.data || error;
        }
    },

  // Update financial plan
    update: async (id, data) => {
        try {
        const response = await api.put(`/financial-plans/${id}`, data);
        return response.data;
        } catch (error) {
        throw error.response?.data || error;
        }
    },

  // Delete financial plan
    delete: async (id) => {
        try {
        const response = await api.delete(`/financial-plans/${id}`);
        return response.data;
        } catch (error) {
        throw error.response?.data || error;
        }
    },
    };

export default financialPlanApi;
