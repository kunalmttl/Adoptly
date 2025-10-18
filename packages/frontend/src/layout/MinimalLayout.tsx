// src/layout/MinimalLayout.tsx

import { Outlet, useLocation } from 'react-router-dom';
import useSmoothScroll from '@/hooks/useSmoothScroll';
import Navbar from '@/components/layout/Navbar';
import { HomeHeader } from '@/components/layout/HomeHeader';

/**
 * The main layout for the public-facing pages of the application.
 *
 * It dynamically renders a different header based on the current route:
 * - On the homepage ('/'), it uses the special `HomeHeader` which is initially transparent.
 * - On all other pages, it uses the standard `Navbar`.
 */
const MinimalLayout = () => {
  // Initialize the smooth scrolling effect.
  useSmoothScroll();
  const location = useLocation();

  // Check if the current path is the homepage.
  const isHomePage = location.pathname === '/';

  return (
    <div className="bg-orange-50">
      {/* Conditionally render the appropriate header component. */}
      {isHomePage ? <HomeHeader /> : <Navbar />}

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MinimalLayout;