// src/api/axiosInstance.ts

import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

// Determine the API base URL based on the environment (development vs. production).
// In development, it points to the local backend server.
// In production, it uses the URL defined in your hosting environment variables.
const baseURL = import.meta.env.DEV
  ? 'http://localhost:3000/api/v1'
  : import.meta.env.VITE_API_URL;     

/**
 * A pre-configured Axios instance.
 * This instance includes the base URL for all API requests and is set up
 * to automatically send cookies (like the JWT auth token) with each request.
 */
const axiosInstance = axios.create({
  baseURL,
  withCredentials: true, // Crucial for sending httpOnly cookies with requests.
});

/**
 * Axios Response Interceptor.
 * This function runs globally after every API response is received.
 * Its primary purpose here is to handle authentication errors gracefully.
 */
axiosInstance.interceptors.response.use(
  // If the response is successful (status 2xx), simply pass it through.
  (response) => response,

  // If the response has an error, inspect it.
  (error) => {
    // Check if the error is a 401 Unauthorized response.
    // This indicates an invalid or expired session (e.g., JWT cookie is missing or invalid).
    if (error.response && error.response.status === 401) {
      console.warn('Received 401 Unauthorized response. Logging out user to sync state.');

      // Access the auth store and trigger the logout action.
      // This will clear the user state on the frontend, ensuring UI consistency.
      useAuthStore.getState().logout();

      // Optionally, you could force a redirect to the login page here:
      // window.location.href = '/login';
    }

    // IMPORTANT: Reject the promise to ensure that the error can still be
    // caught and handled by the specific component or hook that made the API call.
    return Promise.reject(error);
  }
);

export default axiosInstance;