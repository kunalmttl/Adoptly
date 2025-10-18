// src/api/userAPI.ts

import axiosInstance from './axiosInstance';
import type { User } from '@/store/authStore';

// --- Type Definitions ---

/**
 * Defines the shape of the data that can be sent to update a user's profile.
 * All fields are optional, as the user may only update one piece of information at a time.
 */
export interface UpdateProfileData {
  name?: string;
  contact?: string;
  bio?: string;
  address?: {
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
  };
}

// --- API Functions ---

/**
 * Fetches the complete profile of the currently authenticated user.
 * @returns A promise that resolves with the user's data.
 */
export const getMyProfile = async (): Promise<User> => {
  const response = await axiosInstance.get('/users/me');
  return response.data;
};

/**
 * Sends updated profile information to the backend.
 * @param profileData - An object containing the fields to be updated.
 * @returns A promise that resolves with the updated user data.
 */
export const updateMyProfile = async (profileData: UpdateProfileData): Promise<User> => {
  const response = await axiosInstance.put('/users/me', profileData);
  return response.data;
};

/**
 * Sends a new avatar image URL to be saved to the user's profile.
 * @param pictureUrl - The URL of the new avatar image (e.g., from Cloudinary).
 * @returns A promise that resolves with the updated user data.
 */
export const updateMyAvatar = async (pictureUrl: string): Promise<User> => {
  const response = await axiosInstance.put('/users/me/avatar', { picture: pictureUrl });
  return response.data;
};