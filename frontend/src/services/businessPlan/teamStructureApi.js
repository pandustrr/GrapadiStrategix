import api from '../authApi';

export const teamStructureApi = {
    getAll: (params = {}) => {
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach(key => {
            if (params[key]) {
                queryParams.append(key, params[key]);
            }
        });
        const queryString = queryParams.toString();
        return api.get(`/team-structure${queryString ? `?${queryString}` : ''}`);
    },

    getById: (id) => api.get(`/team-structure/${id}`),

    create: (teamData) => {
        // Handle FormData for file upload
        if (teamData.photo instanceof File) {
            const formData = new FormData();
            Object.keys(teamData).forEach(key => {
                if (teamData[key] !== null && teamData[key] !== undefined) {
                    formData.append(key, teamData[key]);
                }
            });
            return api.post("/team-structure", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        }
        return api.post("/team-structure", teamData);
    },

    update: (id, teamData) => {
        // Handle FormData for file upload
        if (teamData.photo instanceof File) {
            const formData = new FormData();
            Object.keys(teamData).forEach(key => {
                if (teamData[key] !== null && teamData[key] !== undefined) {
                    formData.append(key, teamData[key]);
                }
            });
            return api.put(`/team-structure/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        }
        return api.put(`/team-structure/${id}`, teamData);
    },

    delete: (id, userId) => api.delete(`/team-structure/${id}`, { 
        data: { user_id: userId } 
    }),

    uploadPhoto: (id, photoFile) => {
        const formData = new FormData();
        formData.append('photo', photoFile);
        return api.post(`/team-structure/${id}/upload-photo`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }
};

export default teamStructureApi;