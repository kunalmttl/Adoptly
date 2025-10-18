// src/api/applicationAPI.ts

import axiosInstance from './axiosInstance';
import type { Pet } from './petAPI';
// We no longer need the User type directly for Applicant
// import type { User } from '@/store/authStore';

// --- Type Definitions ---

/**
 * Represents the user who has applied for a pet.
 *
 * FIXED: Defined this type explicitly to ensure 'contact' is 'string | undefined',
 * resolving downstream 'ReactNode' errors.
 */
export interface Applicant {
  id: string;
  name: string;
  email: string;
  contact?: string;
  picture?: string;
}

/**
 * The data required to submit a new adoption application.
 */
export interface ApplicationFormData {
  petId: string;
  adoption_intent: string;
  pet_location_plan: string;
}

/**
 * The comprehensive structure of an application object returned from the API.
 * It includes populated details about the pet and the applicant.
 */
export interface Application {
  _id: string;
  status: 'pending' | 'approved' | 'rejected';
  adoption_intent: string;
  pet_location_plan: string;
  pet: Pet;
  applicant: Applicant;
  createdAt: string;
}

// --- API Functions (No changes needed below) ---

export const applyForAdoption = async (data: ApplicationFormData): Promise<Application> => {
  const response = await axiosInstance.post('/applications', data);
  return response.data;
};

export const getMyApplications = async (): Promise<Application[]> => {
  const response = await axiosInstance.get('/applications/mine');
  return response.data;
};

export const getApplicationsForPet = async (petId: string): Promise<Application[]> => {
  const response = await axiosInstance.get(`/pets/${petId}/applications`);
  return response.data;
};

export const updateApplicationStatus = async (
  applicationId: string,
  status: 'approved' | 'rejected'
): Promise<Application> => {
  const response = await axiosInstance.patch(`/applications/${applicationId}`, { status });
  return response.data;
};