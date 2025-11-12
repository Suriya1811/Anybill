// frontend/src/module-2/services/api.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/mobile';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
const authApi = {
  sendOTP: async (mobile: string) => {
    const response = await api.post('/auth/send-otp', { mobile });
    return response.data;
  },
  verifyOTP: async (mobile: string, otp: string) => {
    const response = await api.post('/auth/verify-otp', { mobile, otp });
    return response.data;
  },
  register: async (
    mobile: string,
    name: string,
    businessName: string,
    location: string,
    businessType: string
  ) => {
    const response = await api.post('/auth/register', {
      mobile,
      name,
      businessName,
      location,
      businessType,
    });
    return response.data;
  },
  login: async (mobile: string) => {
    const response = await api.post('/auth/login', { mobile });
    return response.data;
  },
  resendOTP: async (mobile: string) => {
    const response = await api.post('/auth/resend-otp', { mobile });
    return response.data;
  },
};

// Export both named and default
export { authApi };
export default api;