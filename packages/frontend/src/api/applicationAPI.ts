// # Application API for Adoption Applications

import axiosInstance from './axiosInstance';

export interface ApplicationFormData {
  petId: string;
  adoption_intent: string;
  pet_location_plan: string;
}

// * Send adoption application
export const applyForAdoption = async (data: ApplicationFormData) => {
  const response = await axiosInstance.post('/applications', data);
  return response.data;
};

// * Get current user's adoption applications
export const getMyApplications = async () => {
  const response = await axiosInstance.get('/applications/mine');
  return response.data;
};