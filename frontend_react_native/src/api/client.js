import axios from 'axios';
import { getToken, removeToken } from '../auth/storage';

// Change this to your Rails API URL
const API_URL = 'http://localhost:3000'; // For iOS simulator
// const API_URL = 'http://10.0.2.2:3001'; // For Android emulator
// const API_URL = 'http://YOUR_LOCAL_IP:3001'; // For physical device

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await removeToken();
      // You can trigger a logout here if needed
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  signup: async (userData) => {
    const response = await apiClient.post('/signup', {
      user: userData,
    });
    return response.data;
  },

  login: async (credentials) => {
    const response = await apiClient.post('/login', {
      user: credentials,
    });
    // Extract token from headers
    const token = response.headers.authorization;
    return { ...response.data, token };
  },

  logout: async () => {
    const response = await apiClient.delete('/logout');
    return response.data;
  },
};

export default apiClient;