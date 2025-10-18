// src/api/uploadAPI.ts

import axios from 'axios';
// FIXED: Import the specific type for progress events from axios to avoid using 'any'.
import type { AxiosProgressEvent } from 'axios';
import axiosInstance from './axiosInstance';

// --- Direct-to-Cloudinary Upload Strategy ---

/**
 * Fetches a temporary signature from our backend.
 * This signature is required to authorize a direct upload from the client to Cloudinary.
 * @returns A promise that resolves with the signature and timestamp.
 */
export const getCloudinarySignature = async (): Promise<{ signature: string; timestamp: number }> => {
  const response = await axiosInstance.post('/upload/sign');
  return response.data;
};

/**
 * Uploads a file directly to your Cloudinary account using the fetched signature.
 * @param file - The file to upload.
 * @param signature - The signature obtained from our backend.
 * @param timestamp - The timestamp obtained from our backend.
 * @param onUploadProgress - A callback function to track upload progress.
 * @returns A promise that resolves with the secure URL of the uploaded image.
 */
export const uploadToCloudinary = async (
  file: File,
  signature: string,
  timestamp: number,
  // FIXED: Replaced 'any' with the specific 'AxiosProgressEvent' type for type safety.
  onUploadProgress: (progressEvent: AxiosProgressEvent) => void
): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('signature', signature);
  formData.append('timestamp', String(timestamp));
  formData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  // Note: This request goes directly to Cloudinary, not our backend.
  const response = await axios.post(cloudinaryUrl, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  });

  return response.data.secure_url;
};

// --- Direct-to-Server Upload Strategy (for local dev or simple cases) ---

/**
 * Uploads an array of image files to our own backend server.
 * @param files - An array of File objects to upload.
 * @returns A promise that resolves with an array of URLs pointing to the uploaded files on our server.
 */
export const uploadImagesToServer = async (files: File[]): Promise<{ urls: string[] }> => {
  const formData = new FormData();
  files.forEach((file) => {
    // The field name 'petImages' MUST match the name expected by Multer on the backend.
    formData.append('petImages', file);
  });

  const response = await axiosInstance.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};