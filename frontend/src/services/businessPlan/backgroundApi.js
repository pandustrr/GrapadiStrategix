import api from '../authApi';

export const backgroundApi = {
    getAll: () => api.get("/business-background"),

    getById: (id) => api.get(`/business-background/${id}`),

    create: (businessData) => {
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

    update: (id, businessData) => {
        // Jika ada file baru atau logo dihapus (null), gunakan FormData
        if (businessData.logo instanceof File || businessData.logo === null) {
            const formData = new FormData();
            
            Object.keys(businessData).forEach((key) => {
                // Jangan append field yang undefined
                if (businessData[key] !== undefined) {
                    if (key === 'logo' && businessData[key] === null) {
                        // Kirim string kosong untuk hapus logo
                        formData.append(key, '');
                    } else {
                        formData.append(key, businessData[key]);
                    }
                }
            });
            
            formData.append("_method", "PUT");
            return api.post(`/business-background/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        }
        
        // Jika tidak ada perubahan logo, gunakan PUT biasa
        return api.put(`/business-background/${id}`, businessData);
    },

    delete: (id) => api.delete(`/business-background/${id}`),

    getForDropdown: () => api.get("/business-backgrounds"),
};

export default backgroundApi;