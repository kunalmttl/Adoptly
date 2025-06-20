// src/components/layout/Navbar.tsx

import { Link } from "react-router-dom";


const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 z-50 w-full">
            <div className="container mx-auto flex h-24 items-center justify-between px-4">
                
                {/* Logo will go on the left */}
                <Link to="/" className="flex items-center">
                    {/* This path works because your image is in the /public folder */}
                    <img src="/adoptlySVG.svg" alt="Adoptly Logo" className="h-7 w-auto" />
                    <img src="/adoptlytext.svg" alt="Adoptly Text" className="ml-4 mt-3 h-25 w-auto" />
                </Link>


                {/* Menu Button will go on the right */}
                <div>
                    {/* Placeholder for Menu Button */}
                </div>

            </div>
        </header>
  );
};

export default Navbar;