import api from '../authApi';

export const managementFinancialApi = {
    // Financial Categories (existing)
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
    },

    // Financial Summaries (FIXED)
    summaries: {
        getAll: (params) => {
            console.log('API Call: Getting all summaries with params:', params);
            return api.get("/management-financial/summaries", { params });
        },
        getById: (id) => api.get(`/management-financial/summaries/${id}`),
        create: (summaryData) => {
            console.log('API Call: Creating summary with data:', summaryData);
            return api.post("/management-financial/summaries", summaryData);
        },
        update: (id, summaryData) => {
            console.log('API Call: Updating summary:', id, summaryData);
            return api.put(`/management-financial/summaries/${id}`, summaryData);
        },
        delete: (id, userId) => {
            console.log('API Call: Deleting summary:', id, userId);
            return api.delete(`/management-financial/summaries/${id}`, {
                data: { user_id: userId }
            });
        },
        getStatistics: (params) => {
            console.log('API Call: Getting statistics with params:', params);
            return api.get("/management-financial/summaries/statistics", { params });
        },
        getMonthlyComparison: (params) => {
            console.log('API Call: Getting monthly comparison with params:', params);
            return api.get("/management-financial/summaries/monthly-comparison", { params });
        }
    }
};

export default managementFinancialApi;