// # Minimal Layout (for Homepage, etc.)

import Navbar from "@/components/layout/Navbar";
import { Outlet } from "react-router-dom";
import useSmoothScroll from "@/hooks/useSmoothScroll";

const MinimalLayout = () => {
    useSmoothScroll();
  return (
    <div>
      {/* * Pass the 'minimal' layoutType to ensure the navbar is fixed and transparent on home */}
      <Navbar layoutType="minimal" />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MinimalLayout;