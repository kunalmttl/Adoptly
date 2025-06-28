// src/api/petApi.ts

import axiosInstance from './axiosInstance';

export interface Pet {
  _id: string;
  name: string;
  species: "dog" | "cat" | "rabbit" | "bird" | "other";
  breed?: string;
  gender?: "male" | "female";
  description: string;
  adoption_fee: number;
  age?: number;
  status: "available" | "pending" | "adopted";
  health_status?: {
    vaccinated?: boolean;
    special_needs?: boolean;
  };
  images?: string[];
  // …any other fields your API returns
  listed_by: { _id: string; /* maybe name/email too? */ };
}



// This type should match the fields in our form
export interface PetFormData 
{
  _id: string;
  name: string;
  species: 'dog' | 'cat' | 'rabbit' | 'bird' | 'other';
  breed?: string;
  age?: number;
  gender?: 'male' | 'female';
  description: string;
  adoption_fee: number;
  status: "available" | "pending" | "adopted";
  health_status?: {
    vaccinated?: boolean;
    special_needs?: boolean;
  };
  images?: string[];

  // We'll add more fields like images later
}

export interface PetFilters {
  species?: string;
  breed?: string;
  gender?: string;
  vaccinated?: boolean;
  status?: string;
  // ... add other filter types here ...
}

export interface UpdatePetData {
  description?: string;
  age?: number;
  status?: 'available' | 'pending' | 'adopted';
  vaccinated?: boolean;
  special_needs?: boolean;
  health_status?: {
    vaccinated?: boolean;
    special_needs?: boolean;
  };


  images?: string[]; // We will handle this by sending the complete new array of image URLs
  // We can add other editable fields like size, location, etc. here too
}


// Function to create a new pet listing
export const createPetListing = async (petData: PetFormData) => 
{
  // The endpoint is /pets, which maps to /api/v1/pets on the backend
  const response = await axiosInstance.post('/pets', petData);
  return response.data;
};

export const getMyListedPets = async () => {
  // The correct endpoint is `/pets/me/my-listings`
  // This will correctly resolve to: http://localhost:3000/api/v1/pets/me/my-listings
  const response = await axiosInstance.get('/pets/me/my-listings');
  return response.data;
};


export const getPetById = async (petId: string) => {
  const response = await axiosInstance.get(`/pets/${petId}`);
  return response.data;
};


export const getAllPets = async (filters: PetFilters) => {
  const response = await axiosInstance.get('/pets', { 
    // Axios will automatically convert this object into query parameters
    // e.g., /pets?species=dog&breed=Retriever
    params: filters 
  });
  return response.data;

};


export const updatePetListing = async (petId: string, petData: UpdatePetData) => {
  const response = await axiosInstance.put(`/pets/${petId}`, petData);
  return response.data;
};
