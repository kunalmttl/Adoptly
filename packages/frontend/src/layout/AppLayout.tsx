// src/layout/AppLayout.tsx

import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar"; // Import the Navbar

const AppLayout = () => {
  return (
    <div className="grid h-screen grid-rows-[auto_1fr] grid-cols-[200px_1fr]">
      {/* 
        Tailwind CSS Grid Explanation:
        - h-screen: Make the container take up the full viewport height.
        - grid-rows-[auto_1fr]: Define two rows. The first row ('auto') will take up only as much height as its content (the Navbar) needs. The second row ('1fr') will take up all remaining available space.
        - grid-cols-[300px_1fr]: Define two columns. The first is a fixed 300px wide (for the aside panel). The second ('1fr') takes up the rest of the width.
      */}

      {/* --- Navbar Area --- */}
      {/* This component will span across both columns. */}
      <div className="col-span-2">
        <Navbar layoutType="static"/>
      </div>

      {/* --- Aside Panel Area --- */}
      {/* This component will sit in the second row, first column. */}
      <aside className="row-start-2 bg-neutral-800 p-4 text-white">
        <p>Aside Panel</p>
      </aside>

      {/* --- Main Content Area --- */}
      {/* This component will sit in the second row, second column. */}
      <main className="row-start-2 overflow-y-auto bg-neutral-950 p-4 text-white">
        {/* 'overflow-y-auto' is important to allow scrolling if the content is long */}
        <Outlet />
      </main>

    </div>
  );
};

export default AppLayout;