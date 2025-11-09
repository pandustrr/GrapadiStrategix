import api from '../authApi';

export const productServiceApi = {
    getAll: (params = {}) => api.get("/product-service", { params }),
    
    getById: (id) => api.get(`/product-service/${id}`),
    
    create: (productData) => {
        // Untuk create, langsung gunakan POST
        return api.post("/product-service", productData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
    
    update: (id, productData) => {
        // Untuk update dengan FormData, gunakan POST dengan _method=PUT
        // Pastikan productData adalah FormData object
        const formData = productData instanceof FormData ? productData : new FormData();
        
        // Jika productData bukan FormData, convert ke FormData
        if (!(productData instanceof FormData)) {
            for (const key in productData) {
                if (productData.hasOwnProperty(key)) {
                    // Handle berbagai tipe data
                    if (productData[key] !== null && productData[key] !== undefined) {
                        if (productData[key] instanceof File) {
                            formData.append(key, productData[key]);
                        } else if (typeof productData[key] === 'object') {
                            formData.append(key, JSON.stringify(productData[key]));
                        } else {
                            formData.append(key, productData[key]);
                        }
                    }
                }
            }
        }
        
        // Tambahkan _method untuk Laravel (hanya jika belum ada)
        if (!formData.has('_method')) {
            formData.append('_method', 'PUT');
        }
        
        return api.post(`/product-service/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
    
    delete: (id, userId) => {
        // Untuk delete, kirim user_id dalam body
        return api.delete(`/product-service/${id}`, { 
            data: { user_id: userId } 
        });
    },
};

export default productServiceApi;