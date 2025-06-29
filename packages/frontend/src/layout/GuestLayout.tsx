// # Guest-Only Layout (Route Guard)

import { useAuthStore } from "@/store/authStore";
import { Navigate, Outlet } from "react-router-dom";

/**
 * * This layout component protects routes that should only be accessible to guests (e.g., login, register).
 * ? If a logged-in user tries to access these routes, they are redirected to the homepage.
 */
export default function GuestLayout() {
  const { user } = useAuthStore();

  if (user) {
    // =-= User is logged in, redirect them away from the guest page.
    // =-= 'replace' prevents the user from using the browser's back button to return to the login page.
    return <Navigate to="/" replace />;
  }

  // * User is not logged in, so render the requested child route (e.g., LoginPage).
  return <Outlet />;
}