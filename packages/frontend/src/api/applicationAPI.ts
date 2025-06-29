// # Application API for Adoption Applications

import axiosInstance from './axiosInstance';
import type { Pet } from './petAPI';


export interface ApplicationFormData {
  petId: string;
  adoption_intent: string;
  pet_location_plan: string;
}

// * Interface for the data returned by the 'getMyApplications' endpoint
export interface ApplicationWithPet 
{
    _id: string;
    status: 'pending' | 'approved' | 'rejected';
    adoption_intent: string;
    pet_location_plan: string;
    pet: Pet; // =-= The populated pet object
    createdAt: string;
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