import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
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

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// -----------------------------------------
// 🧠 Gemini API Helper Functions
// -----------------------------------------

export const sendGeminiQuery = async (message, model = 'gemini-2.5-flash') => {
  try {
    const res = await api.post('/gemini-chat', { message, model });
    return res.data;
  } catch (error) {
    console.error('Error sending Gemini query:', error);
    throw error;
  }
};

export const fetchChatHistory = async (userId) => {
  try {
    const res = await api.get(`/chat-history?user_id=${encodeURIComponent(userId)}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching chat history:', error);
    throw error;
  }
};

export default api;
