// src/store/authStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';


// Define the shape of our user and the store's state
export interface User 
{
  id: string;
  name: string;
  email: string;
  profile_type: 'adopter' | 'seller';
  picture?: string; 
}

interface AuthState 
{
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

// Create the store with persist middleware to save state in localStorage
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'auth-storage', // The key to use in localStorage
    }
  )
);