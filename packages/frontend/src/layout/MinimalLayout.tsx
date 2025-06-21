// src/layout/MinimalLayout.tsx

import Navbar from "@/components/layout/Navbar";
import { Outlet } from "react-router-dom";
import useSmoothScroll from "@/hooks/useSmoothScroll";
import CustomCursor from "@/components/common/CustomCursor";
const MinimalLayout = () => {
    useSmoothScroll();
  return (
    <div>
      <CustomCursor />
      {/* We will add the Navbar here later */}
      <Navbar />
      <main>
        <Outlet /> {/* This will render the page component (e.g., HomePage) */}
      </main>
    </div>
  );
};

export default MinimalLayout;