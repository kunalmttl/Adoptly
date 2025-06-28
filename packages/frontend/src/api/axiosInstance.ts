// src/api/axiosInstance.ts

import axios from 'axios';

// Create an Axios instance with a predefined base URL
const axiosInstance = axios.create({
  // This should point to your backend server's URL from your .env file
  baseURL: 'http://localhost:3000/api/v1',
  // This ensures cookies (like our auth token) are sent with every request
  withCredentials: true, 
});

export default axiosInstance;