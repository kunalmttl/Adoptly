// src/store/authStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Defines the shape of the User object that will be stored globally.
 * This represents the currently authenticated user.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  profile_type: 'adopter' | 'seller';
  picture?: string;
  // Add other user properties here as needed, e.g., contact, bio
  contact?: string;
  bio?: string;
}

/**
 * Defines the complete state and actions for the authentication store.
 */
interface AuthState {
  /** The current user object, or null if no user is authenticated. */
  user: User | null;
  /** A function to set or update the authenticated user. */
  setUser: (user: User | null) => void;
  /** A function to clear the authenticated user, effectively logging them out. */
  logout: () => void;
}

/**
 * The global Zustand store for managing authentication state.
 *
 * It uses the `persist` middleware to automatically save the user's session
 * to the browser's localStorage. This allows the user to stay logged in
 * even after refreshing the page or closing the browser tab.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    // The `set` function is provided by Zustand and is used to update the state.
    (set) => ({
      // Initial state: no user is logged in.
      user: null,

      // Action to set or update the user.
      setUser: (user) => set({ user }),

      // Action to log the user out by clearing the user object.
      logout: () => set({ user: null }),
    }),
    {
      // Configuration for the persist middleware.
      name: 'auth-storage', // The key that will be used in localStorage.
      // By default, it uses localStorage. You can configure other storage options here.
    }
  )
);