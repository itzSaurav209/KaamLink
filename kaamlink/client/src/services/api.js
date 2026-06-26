// File: client/src/services/api.js
// Purpose: Axios instance and typed API helpers for KaamLink frontend

import axios from 'axios';
import toast from 'react-hot-toast';

const baseURL =
    import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

const api = axios.create({
    baseURL,
    withCredentials: false,
});

// Attach Authorization header from localStorage token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('kaamlink_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Global error handler: toast on 4xx/5xx and auto-logout on 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            (error.response && error.response.data && error.response.data.error) ||
            error.message ||
            'Something went wrong';

        if (!error.response) {
            toast.error('Unable to reach the server. Please make sure the backend is running.');
        } else if (error.response.status === 401) {
            localStorage.removeItem('kaamlink_token');
            toast.error('Session expired, please login again');
            window.location.href = '/login';
        } else {
            toast.error(message);
        }

        return Promise.reject(error);
    }
);

export default api;