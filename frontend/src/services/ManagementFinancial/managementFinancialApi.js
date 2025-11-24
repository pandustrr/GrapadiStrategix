import api from '../authApi';

export const managementFinancialApi = {
    // Financial Categories
    categories: {
        getAll: () => api.get("/management-financial/categories"),
        
        getById: (id) => api.get(`/management-financial/categories/${id}`),
        
        create: (categoryData) => api.post("/management-financial/categories", categoryData),
        
        update: (id, categoryData) => api.put(`/management-financial/categories/${id}`, categoryData),
        
        delete: (id, userId) => api.delete(`/management-financial/categories/${id}`, { 
            data: { user_id: userId } 
        }),
        
        getSummary: (userId) => api.get("/management-financial/categories/summary", {
            params: { user_id: userId }
        })
    }
};

export default managementFinancialApi;