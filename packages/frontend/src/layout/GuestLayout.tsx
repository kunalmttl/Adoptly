// src/layout/GuestLayout.tsx

import { useAuthStore } from '@/store/authStore';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * A layout component that acts as a "route guard" for guest-only pages.
 *
 * It protects routes that should only be accessible to unauthenticated users
 * (e.g., the login and registration pages). If a logged-in user attempts to
 * access a route wrapped by this layout, they will be automatically redirected
 * to the homepage.
 */
export default function GuestLayout() {
  const { user } = useAuthStore();

  // If a user object exists in the global state, the user is authenticated.
  if (user) {
    // Redirect the authenticated user to the homepage.
    // The 'replace' prop is important: it replaces the current entry in the
    // history stack, so the user cannot use the browser's back button
    // to return to the login page they were redirected from.
    return <Navigate to="/" replace />;
  }

  // If there is no user, they are a guest. Render the requested child route
  // (e.g., LoginPage) via the <Outlet>.
  return <Outlet />;
}