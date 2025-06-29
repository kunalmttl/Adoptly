// # Main App Layout (for Browse Page)

import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import useSmoothScroll from "@/hooks/useSmoothScroll";

const AppLayout = () => {
  useSmoothScroll();

  return (
    <div>
      {/* * Pass the 'app' layoutType to ensure the navbar is static and dark */}
      <Navbar layoutType="app" />
      <div className="container mx-auto px-4">
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;