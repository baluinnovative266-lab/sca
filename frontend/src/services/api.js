import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const checkHealth = async () => {
    const response = await api.get('/health');
    return response.data;
};

export const predictCareer = async (data) => {
    const response = await api.post('/predict-career', data);
    return response.data;
};

export const analyzeResume = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/analyze-resume', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const getAvatarRecommendations = async () => {
    const response = await api.get('/auth/avatar-recommendations');
    return response.data;
};

export const updateProfile = async (data) => {
    const response = await api.post('/auth/update-profile', data);
    return response.data;
};

export default api;
