// # Main App Layout (for Browse Page)

import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import useSmoothScroll from "@/hooks/useSmoothScroll";

const AppLayout = () => {
  useSmoothScroll();

  return (
    <div>
      <Navbar layoutType="app" />
      {/* =-= The Outlet will render the full BrowsePetsPage, which now contains its own layout */}
      <Outlet />
    </div>
  );
};

export default AppLayout;