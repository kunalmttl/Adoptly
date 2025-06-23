// src/layout/AppLayout.tsx

import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import PetFilters from "@/components/browse/PetFilters";
import useSmoothScroll from "@/hooks/useSmoothScroll";

const AppLayout = () => {
  useSmoothScroll();

  return (
    // The main container no longer has a fixed height.
    // It will grow with the content.
    <div>
      {/* 
        The Navbar now needs its own styling to be 'sticky' 
        so it stays at the top when the page scrolls.
      */}
      <div className="sticky top-0 z-40">
        <Navbar layoutType="static" />
      </div>

      {/* 
        We use a flexbox or grid for the main content area below the navbar.
      */}
      <div className="container grid grid-cols-1 gap-8  lg:grid-cols-[250px_1fr]">
        
        {/* --- Aside Panel Area --- */}
        <aside className="lg:sticky lg:top-24 h-fit">
          {/*
            - lg:sticky: On large screens, this panel will stick to the viewport.
            - lg:top-24: When it sticks, it will have a 24-unit (6rem) space from the top,
              leaving room for our sticky navbar (which is h-24).
            - h-fit: Ensures the aside column only takes up the height of its own content.
          */}
          <PetFilters />
        </aside>

        {/* --- Main Content Area --- */}
        {/* This no longer needs its own overflow or scrollbar. */}
        <main className="py-6 ">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default AppLayout;