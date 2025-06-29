// src/layout/AppLayout.tsx

import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import useSmoothScroll from "@/hooks/useSmoothScroll";

const AppLayout = () => {
  useSmoothScroll();

  return (
    <div>
      {/* Sticky Navbar */}
      <div className="sticky top-0 z-40">
        <Navbar layoutType="static" />
      </div>

      {/* Main content area */}
      <div className="container mx-auto px-4">
        {/* The Outlet will now render our entire BrowsePetsPage,
            which contains its own grid layout. */}
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;