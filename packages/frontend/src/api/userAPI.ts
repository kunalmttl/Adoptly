// src/api/userApi.ts

import axiosInstance from './axiosInstance';

// Define the shape of the data we can update
export interface UpdateProfileData 
{
  name?: string;
  contact?: string;
  bio?: string;
  picture?: string;
  address?: 
  {
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
  };
}

// Function to get the current user's profile
export const getMyProfile = async () => 
{
  const response = await axiosInstance.get('/users/me');
  return response.data;
};

// Function to update the current user's profile
export const updateMyProfile = async (profileData: UpdateProfileData) => 
{
  const response = await axiosInstance.put('/users/me', profileData);
  return response.data;
};

export const updateMyAvatar = async (pictureUrl: string) => {
  const response = await axiosInstance.put('/users/me/avatar', { picture: pictureUrl });
  return response.data;
};
