// # Axios Instance with Interceptor

import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

// * Create an Axios instance with a predefined base URL
const axiosInstance = axios.create({
  baseURL: 'https://adoptly-tan.vercel.app',                     
  withCredentials: true, 
});

// ! NEW: Add a request interceptor to handle authentication state.
// ? This function will run before every single request is sent by Axios.
axiosInstance.interceptors.request.use(
  (config) => {
    // =-= This is a good place to add logic if you were using header-based tokens.
    // =-= For httpOnly cookies, the main benefit is ensuring a clean state.
    // =-= The browser handles attaching the cookie automatically, but this interceptor
    // =-= helps prevent issues with stale configurations.
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// * NEW: Add a response interceptor to handle global 401 errors.
// ? This function will run whenever we receive a response from the backend.
axiosInstance.interceptors.response.use(
  (response) => {
    // * If the request was successful, just return the response.
    return response;
  },
  (error) => {
    // # Check if the error is a 401 Unauthorized.
    if (error.response && error.response.status === 401) {
      // =-= This means the user's session is invalid (e.g., cookie expired or tampered with).
      // =-= The safest action is to log the user out on the frontend to re-sync the state.
      console.warn("Received 401 Unauthorized. Logging out user.");
      useAuthStore.getState().logout(); // ? Access the logout function directly from the store.
      
      // =-= Optionally, redirect to the login page.
      // window.location.href = '/login';
    }
    // * Return the error so that individual .catch() blocks can still handle it.
    return Promise.reject(error);
  }
);

export default axiosInstance;