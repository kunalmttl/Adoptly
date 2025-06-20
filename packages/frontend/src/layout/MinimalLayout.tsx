// src/layout/MinimalLayout.tsx

import Navbar from "@/components/layout/NavBar";
import { Outlet } from "react-router-dom";

const MinimalLayout = () => {
  return (
    <div>
      {/* We will add the Navbar here later */}
      <Navbar />
      <main>
        <Outlet /> {/* This will render the page component (e.g., HomePage) */}
      </main>
    </div>
  );
};

export default MinimalLayout;