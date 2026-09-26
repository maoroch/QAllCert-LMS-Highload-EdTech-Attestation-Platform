import axios from 'axios';
import { API_BASE_URL } from '../constants';

const apiClient = axios.create({
 baseURL: API_BASE_URL,
 headers: {
 'Content-Type': 'application/json',
 },
});

// Request interceptor to add access token
apiClient.interceptors.request.use(
 (config) => {
 // We will get token from localStorage or Redux store later
 const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
 if (token && config.headers) {
 config.headers.Authorization = `Bearer ${token}`;
 }
 return config;
 },
 (error) => {
 return Promise.reject(error);
 }
);

// Response interceptor to handle errors and refresh tokens
apiClient.interceptors.response.use(
 (response) => {
 return response;
 },
 async (error) => {
 const originalRequest = error.config;
 
 // Check if the error is 401 and we haven't already tried to refresh the token
 if (error.response?.status === 401 && !originalRequest._retry) {
 originalRequest._retry = true;
 
 try {
 const refreshToken = localStorage.getItem('refreshToken');
 if (!refreshToken) {
 throw new Error('No refresh token available');
 }

 const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
 refreshToken
 });

 localStorage.setItem('accessToken', data.accessToken);
 localStorage.setItem('refreshToken', data.refreshToken);

 // Retry original request with new token
 originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
 return axios(originalRequest);
 } catch (refreshError) {
 // Handle failed refresh (e.g. logout user)
 localStorage.removeItem('accessToken');
 localStorage.removeItem('refreshToken');
 // Optionally redirect to login
 if (typeof window !== 'undefined') {
 window.location.href = '/login';
 }
 return Promise.reject(refreshError);
 }
 }
 
 return Promise.reject(error);
 }
);

export default apiClient;
