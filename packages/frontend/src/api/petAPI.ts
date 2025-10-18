// src/api/petAPI.ts

import axiosInstance from './axiosInstance';

// --- Type Definitions ---

/**
 * Represents the user who listed a pet.
 */
export interface PetOwner {
  _id: string;
  name: string;
  email?: string;
  contact?: string;
  city?: string;
}

/**
 * Defines the structure for a pet's location.
 */
export interface PetLocation {
  city: string;
  state?: string;
  country: string;
}

/**
 * Defines the structure for a pet's health status.
 */
export interface HealthStatus {
  vaccinated: boolean;
  special_needs: boolean;
}

/**
 * Defines the structure for a pet's size.
 */
export interface PetSize {
  height?: number;
  weight?: number;
}

/**
 * The definitive TypeScript interface for a Pet object, matching the backend model.
 */
export interface Pet {
  _id: string;
  name: string;
  species: 'dog' | 'cat' | 'rabbit' | 'bird' | 'other';
  breed?: string;
  age?: number;
  gender?: 'male' | 'female';
  description: string;
  adoption_fee: number;
  status: 'available' | 'pending' | 'adopted';
  images: string[];
  location: PetLocation;
  health_status: HealthStatus;
  size: PetSize;
  listed_by: PetOwner;
  createdAt: string;
  updatedAt: string;
}

/**
 * Defines the available filters that can be sent to the backend when fetching pets.
 */
export interface PetFilters {
  species?: string;
  breed?: string;
  gender?: string;
  status?: string;
  search_query?: string;
  search_by?: 'name' | 'breed';
  vaccinated?: boolean;
}

/**
 * The expected shape of the response for a paginated list of pets.
 */
export interface PagedPetsResponse {
  data: Pet[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPets: number;
  };
}

/**
 * The payload required to create a new pet listing.
 */
export type CreatePetPayload = Omit<Pet, '_id' | 'listed_by' | 'createdAt' | 'updatedAt'>;

/**
 * The payload for updating an existing pet listing. All fields are optional.
 */
export type UpdatePetPayload = Partial<CreatePetPayload>;

// --- API Functions ---

/**
 * Fetches a paginated and filtered list of all pets.
 * @param filters - An object containing the filter criteria.
 * @param page - The page number to fetch.
 * @returns A promise that resolves with the paginated pet data.
 */
export const getAllPets = async (filters: PetFilters, page: number): Promise<PagedPetsResponse> => {
  const response = await axiosInstance.get('/pets', { params: { ...filters, page } });
  return response.data;
};

/**
 * Fetches the details of a single pet by its ID.
 * @param petId - The unique identifier of the pet.
 * @returns A promise that resolves with the pet's data.
 */
export const getPetById = async (petId: string): Promise<Pet> => {
  const response = await axiosInstance.get(`/pets/${petId}`);
  return response.data;
};

/**
 * Fetches all pets listed by the currently authenticated user.
 * @returns A promise that resolves with an array of pets.
 */
export const getMyListedPets = async (): Promise<Pet[]> => {
  const response = await axiosInstance.get('/pets/me/my-listings');
  return response.data;
};

/**
 * Creates a new pet listing.
 * @param petData - The data for the new pet.
 * @returns A promise that resolves with the newly created pet's data.
 */
export const createPetListing = async (petData: CreatePetPayload): Promise<Pet> => {
  const response = await axiosInstance.post('/pets', petData);
  return response.data;
};

/**
 * Updates an existing pet listing.
 * @param petId - The ID of the pet to update.
 * @param petData - An object containing the fields to update.
 * @returns A promise that resolves with the updated pet's data.
 */
export const updatePetListing = async (petId: string, petData: UpdatePetPayload): Promise<Pet> => {
  const response = await axiosInstance.put(`/pets/${petId}`, petData);
  return response.data;
};

/**
 * Deletes a pet listing.
 * @param petId - The ID of the pet to delete.
 * @returns A promise that resolves with a confirmation message.
 */
export const deletePet = async (petId: string): Promise<{ message: string }> => {
  const response = await axiosInstance.delete(`/pets/${petId}`);
  return response.data;
};