// src/api/authAPI.ts

import axiosInstance from './axiosInstance';
import type { User } from '@/store/authStore';

// --- Type Definitions for API Payloads and Responses ---

/**
 * Defines the shape of data required for registration and login.
 * All fields are optional to allow for reuse in different forms (e.g., login only needs email/password).
 */
export interface AuthFormData {
  name?: string;
  email: string;
  password: string;
  profile_type?: 'adopter' | 'seller';
}

/**
 * The expected response from the backend after initiating registration.
 * The backend sends back the user's email to be used in the OTP verification step.
 */
interface OtpInitiationResponse {
  message: string;
  email: string;
}

/**
 * The expected response after a successful login or OTP verification.
 * Contains the auth token (though we use cookies) and the user's profile data.
 */
export interface AuthSuccessResponse {
  message: string;
  token: string;
  user: User;
}

// --- API Functions ---

/**
 * Sends user registration data to the backend to initiate the OTP process.
 * @param userData - The user's registration details (name, email, password, profile_type).
 * @returns A promise that resolves with the backend's confirmation message and the user's email.
 */
export const registerUser = async (userData: AuthFormData): Promise<OtpInitiationResponse> => {
  const response = await axiosInstance.post('/auth/register', userData);
  return response.data;
};

/**
 * Sends the user's email and OTP to the backend for verification.
 * If successful, the user is considered authenticated.
 * @param email - The user's email address.
 * @param otp - The 6-digit OTP code entered by the user.
 * @returns A promise that resolves with the full authentication response, including user data.
 */
export const verifyOtp = async (email: string, otp: string): Promise<AuthSuccessResponse> => {
  const response = await axiosInstance.post('/auth/verify-otp', { email, otp });
  return response.data;
};

/**
 * Sends user credentials to the backend for login.
 * @param credentials - The user's login details (email, password).
 * @returns A promise that resolves with the full authentication response.
 */
export const loginUser = async (credentials: AuthFormData): Promise<AuthSuccessResponse> => {
  const response = await axiosInstance.post('/auth/login', credentials);
  return response.data;
};

/**
 * Sends a request to the backend to switch the user's profile type (adopter <-> seller).
 * The backend identifies the user via the authentication cookie.
 * @returns A promise that resolves with the updated user data.
 */
export const switchUserProfile = async (): Promise<{ message: string; user: User }> => {
  const response = await axiosInstance.put('/users/me/switch-profile');
  return response.data;
};