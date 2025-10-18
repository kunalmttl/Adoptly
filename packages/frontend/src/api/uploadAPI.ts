// # Upload API
import axios from 'axios';
import axiosInstance from './axiosInstance';



export const getCloudinarySignature = async () => {
  const response = await axiosInstance.post('/upload/sign');
  return response.data; // Returns { signature, timestamp }
};


export const uploadToCloudinary = async (
  file: File, 
  signature: string, 
  timestamp: number,
  onUploadProgress: (progressEvent: any) => void // Callback for progress
) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('signature', signature);
  formData.append('timestamp', String(timestamp));
  
  // Get these values from your .env file or Cloudinary dashboard
  const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY;
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  
  formData.append('api_key', apiKey);

  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  // Use a new, clean axios instance for this external request
  const response = await axios.post(cloudinaryUrl, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  });

  // Return the secure URL of the uploaded image
  return response.data.secure_url;
};


/**
 * * Uploads an array of image files to the server.
 * @param files - An array of File objects to be uploaded.
 * @returns A promise that resolves to an object containing an array of public image URLs.
 */
export const uploadImages = async (files: File[]): Promise<{ urls: string[] }> => 
{
  // =-= We must use FormData to send files
  const formData = new FormData();
  files.forEach(file => {
    // ? The field name 'petImages' must match what Multer expects on the backend.
    formData.append('petImages', file);
  });

  const response = await axiosInstance.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};