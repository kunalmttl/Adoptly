// # Minimal Layout (with Conditional Header)

import { Outlet, useLocation } from "react-router-dom";
import useSmoothScroll from "@/hooks/useSmoothScroll";
import Navbar from "@/components/layout/Navbar";
import { HomeHeader } from "@/components/layout/HomeHeader"; // * Import the new HomeHeader

const MinimalLayout = () => {
  useSmoothScroll();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="bg-orange-50">
      {/* ! FIX: Conditionally render the correct header */}
      {isHomePage ? <HomeHeader /> : <Navbar />}
      
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MinimalLayout;