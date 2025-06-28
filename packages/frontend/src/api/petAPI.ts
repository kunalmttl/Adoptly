// frontend/src/api/petAPI.ts

import axiosInstance from './axiosInstance';

// --- Core Type Definitions ---

export interface PetOwner {
  _id: string;
  name: string;
  email?: string;
  contact?: string;
  city?: string;
}

export interface PetLocation {
  city: string;
  state?: string;
  country: string;
}

export interface HealthStatus {
  vaccinated: boolean;
  special_needs: boolean;
}

// New: Added PetSize to match the backend model
export interface PetSize {
  height?: number; // in cm or inches
  weight?: number; // in kg or lbs
}

// The single source of truth for a Pet object from the API
export interface Pet {
  _id: string;
  name: string;
  species: "dog" | "cat" | "rabbit" | "bird" | "other";
  breed?: string;
  age?: number;
  gender?: "male" | "female";
  description: string;
  adoption_fee: number;
  status: "available" | "pending" | "adopted";
  images: string[];
  location: PetLocation;
  health_status: HealthStatus;
  size: PetSize; // <-- Added size
  listed_by: PetOwner;
  createdAt: string;
  updatedAt: string;
}

// --- Filter & Payload Type Definitions ---

export interface PetFilters {
  species?: string;
  breed?: string;
  gender?: string;
  vaccinated?: boolean;
  status?: string;
}

export interface CreatePetPayload {
  name: string;
  species: "dog" | "cat" | "rabbit" | "bird" | "other";
  description: string;
  adoption_fee: number;
  location: PetLocation;
  images?: string[];
  breed?: string;
  age?: number;
  gender?: "male" | "female";
  health_status?: HealthStatus;
  size?: PetSize; // <-- Added size
  status: "available" | "pending" | "adopted";
}

export interface UpdatePetPayload {
  description?: string;
  age?: number;
  status?: "available" | "pending" | "adopted";
  health_status?: HealthStatus;
  images?: string[];
  size?: PetSize; // <-- Added size
}


// --- API Functions ---

export const getAllPets = async (filters: PetFilters): Promise<Pet[]> => {
  const response = await axiosInstance.get('/pets', { params: filters });
  return response.data;
};

export const getPetById = async (petId: string): Promise<Pet> => {
  const response = await axiosInstance.get(`/pets/${petId}`);
  return response.data;
};

export const getMyListedPets = async (): Promise<Pet[]> => {
  const response = await axiosInstance.get('/pets/me/my-listings');
  return response.data;
};

export const createPetListing = async (petData: CreatePetPayload): Promise<Pet> => {
  const response = await axiosInstance.post('/pets', petData);
  return response.data;
};

export const updatePetListing = async (petId: string, petData: UpdatePetPayload): Promise<Pet> => {
  const response = await axiosInstance.put(`/pets/${petId}`, petData);
  return response.data;
};

export const deletePet = async (petId: string): Promise<{ message: string }> => {
  const response = await axiosInstance.delete(`/pets/${petId}`);
  return response.data;
};