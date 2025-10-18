// src/layout/AuthLayout.tsx

import { Outlet } from 'react-router-dom';

/**
 * A simple, centered layout specifically for authentication pages (Login, Register).
 * It provides a neutral background and centers its content both vertically and horizontally,
 * creating a focused view for the authentication forms.
 */
const AuthLayout = () => {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-neutral-100 p-4">
      {/* The <Outlet> will render the specific auth page (e.g., LoginPage). */}
      <Outlet />
    </main>
  );
};

export default AuthLayout;