import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const businessPlanAPI = {
  // Business Background CRUD
  business: {
    // Get all business backgrounds
    getAll: () => api.get("/business-background"),

    // Get single business background
    getById: (id) => api.get(`/business-background/${id}`),

    // Create new business background
    create: (businessData) => {
      // If there's a file, use FormData
      if (businessData.logo instanceof File) {
        const formData = new FormData();
        Object.keys(businessData).forEach((key) => {
          if (businessData[key] !== null && businessData[key] !== undefined) {
            formData.append(key, businessData[key]);
          }
        });
        return api.post("/business-background", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
      return api.post("/business-background", businessData);
    },

    // Update business background
    update: (id, businessData) => {
      // If there's a file, use FormData with PUT method
      if (businessData.logo instanceof File) {
        const formData = new FormData();
        Object.keys(businessData).forEach((key) => {
          if (businessData[key] !== null && businessData[key] !== undefined) {
            formData.append(key, businessData[key]);
          }
        });
        formData.append("_method", "PUT"); // For Laravel to recognize as PUT
        return api.post(`/business-background/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
      return api.put(`/business-background/${id}`, businessData);
    },

    // Delete business background
    delete: (id) => api.delete(`/business-background/${id}`),
  },

  // Operational Plans CRUD
  operational: {
    // Get all operational plans
    getAll: () => api.get("/operational-plans"),

    // Get single operational plan
    getById: (id) => api.get(`/operational-plans/${id}`),

    // Create new operational plan
    create: (operationalData) =>
      api.post("/operational-plans", operationalData),

    // Update operational plan
    update: (id, operationalData) =>
      api.put(`/operational-plans/${id}`, operationalData),

    // Delete operational plan
    delete: (id) => api.delete(`/operational-plans/${id}`),
  },

  // Market Analysis CRUD
  marketAnalysis: {
    // Get all market analyses (optional: with user_id or business_background_id)
    getAll: (params = {}) => api.get("/market-analysis", { params }),

    // Get single market analysis
    getById: (id) => api.get(`/market-analysis/${id}`),

    // Create new market analysis
    create: (marketData) => api.post("/market-analysis", marketData),

    // Update market analysis
    update: (id, marketData) => api.put(`/market-analysis/${id}`, marketData),

    // Delete market analysis
    delete: (id) => api.delete(`/market-analysis/${id}`),
  },

  // Additional endpoints from your routes
  businessBackgrounds: {
    // Get business backgrounds for dropdowns (from operational plans route)
    getForDropdown: () => api.get("/business-backgrounds"),
  },
};

export default api;
