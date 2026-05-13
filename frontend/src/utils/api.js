import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('🔗 API configured:', API_URL);

const API = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add JWT token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('echoToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`, token ? '(authenticated)' : '(public)');
  return config;
});

// Handle responses and errors
API.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - Success`);
    return response;
  },
  (error) => {
    console.error(`❌ API Error:`, {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });

    // If backend is not running
    if (error.code === 'ERR_NETWORK' || !error.response) {
      console.error('🔴 Backend not reachable. Is it running on http://localhost:5000?');
    }

    // Unauthorized - clear token and redirect to home
    if (error.response?.status === 401) {
      localStorage.removeItem('echoToken');
      localStorage.removeItem('echoUser');
      window.location.href = '/';
    }

    return Promise.reject(error);
  }
);

export default API;
