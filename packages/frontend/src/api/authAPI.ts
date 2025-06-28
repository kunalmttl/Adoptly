// src/api/authAPI.ts

import axiosInstance from './axiosInstance';

// Define the shape of the data for our requests
// We can import this type from AuthForm.tsx later for consistency
interface AuthValues 
{
    name?: string;
    email: string;
    password: string;
}

interface LoginResponse {
  message: string;
  token: string;
  user: { id: string; name: string; email: string; profile_type: string; };
}



// Register function
export const registerUser = async (userData: AuthValues) => 
{
    // The endpoint here will be appended to our baseURL from the axiosInstance
    // Full URL: http://localhost:3000/api/v1/auth/register
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data; // Returns the data from the backend (e.g., user object)
};

// Login function
export const loginUser = async (credentials: AuthValues): Promise<LoginResponse> => 
{
    // Full URL: http://localhost:3000/api/v1/auth/login
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
};


// Switch Profile Function
export const switchUserProfile = async () => {
    // We don't need to send any data in the body, as the backend
    // identifies the user via their auth token (in the cookie).
    const response = await axiosInstance.put('/users/me/switch-profile');
    return response.data;
};
