// src/api/authAPI.ts

import axiosInstance from './axiosInstance';
import type { User } from '@/store/authStore';


// Define the shape of the data for our requests
// We can import this type from AuthForm.tsx later for consistency
interface AuthValues 
{
    name?: string;
    email: string;
    password: string;
    profile_type?: 'adopter' | 'seller';

}


interface OtpInitiationResponse {
  message: string;
  email: string;
}


interface LoginResponse {
  message: string;
  token: string;
  user: User;
}


/**
 * * Initiates the registration process by sending user details to the backend.
 * ? On success, the backend sends an OTP to the user's email.
 * @param userData - The user's registration details.
 * @returns A promise that resolves with a message and the user's email.
 */
export const registerUser = async (userData: AuthValues): Promise<OtpInitiationResponse> => {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
};



/**
 * * Logs in a user by sending credentials to the backend.
 * ? On success, the backend returns a JWT and the full user object.
 * @param credentials - The user's login credentials.
 * @returns A promise that resolves with the final login data.
 */
export const loginUser = async (credentials: AuthValues): Promise<LoginResponse> => {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
};



/**
 * * NEW: Sends the user's email and OTP to the backend for verification.
 * ? On success, the backend returns a JWT and the full user object.
 * @param email - The user's email.
 * @param otp - The 6-digit OTP code.
 * @returns A promise that resolves with the final login data.
 */
export const verifyOtp = async (email: string, otp: string): Promise<LoginResponse> => {
    const response = await axiosInstance.post('/auth/verify-otp', { email, otp });
    return response.data;
};


// Switch Profile Function
export const switchUserProfile = async () => {
    // We don't need to send any data in the body, as the backend
    // identifies the user via their auth token (in the cookie).
    const response = await axiosInstance.put('/users/me/switch-profile');
    return response.data;
};
