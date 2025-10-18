// src/layout/AppLayout.tsx

import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import useSmoothScroll from '@/hooks/useSmoothScroll';

/**
 * A primary layout for the main application pages (e.g., the pet browsing experience).
 * It features the standard application navbar with a solid background and enables
 * the global smooth scrolling effect.
 */
const AppLayout = () => {
  // Initialize the smooth scrolling effect for all child routes.
  useSmoothScroll();

  return (
    <div>
      <Navbar layoutType="app" />
      {/* The <Outlet> component renders the specific page component
          that matches the current route (e.g., BrowsePetsPage). */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;