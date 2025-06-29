// # Application API for Adoption Applications

import axiosInstance from './axiosInstance';
import type { Pet } from './petAPI';


export interface Applicant {
  _id: string;
  name: string;
  email: string;
  contact?: string;
  picture?: string;
}

export interface ApplicationFormData {
  petId: string;
  adoption_intent: string;
  pet_location_plan: string;
}


export interface ApplicationWithDetails {
    _id: string;
    status: 'pending' | 'approved' | 'rejected';
    adoption_intent: string;
    pet_location_plan: string;
    pet: Pet; // =-= Used for the "My Applications" page (adopter's view)
    applicant: Applicant; // =-= Used for the "View Applications" page (seller's view)
    createdAt: string;
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

export const getApplicationsForPet = async (petId: string): Promise<ApplicationWithDetails[]> => {
  // =-= This endpoint now matches our new backend route
  const response = await axiosInstance.get(`/pets/${petId}/applications`);
  return response.data;
};
