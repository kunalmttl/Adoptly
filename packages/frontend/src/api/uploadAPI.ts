// # Upload API

import axiosInstance from './axiosInstance';

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