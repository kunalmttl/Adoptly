// src/components/layout/Navbar.tsx

import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import PetSearch from "./PetSearch";

interface NavbarProps {
    layoutType?: 'fixed' | 'static'; // The '?' makes it optional
}


const Navbar = ({ layoutType = 'fixed' }: NavbarProps) => {

    const headerClasses = layoutType === 'fixed'
        ? 'fixed top-0 left-0 z-50 w-full' // For MinimalLayout
        : 'relative z-50 w-full border-b bg-neutral-900'; // For AppLayout


    // Dynamically set text color
    const textColor = layoutType === 'fixed' ? 'text-white' : 'text-neutral-200';


    const navLinks = [
      { href: "/browse", label: "Browse Pets" },
      { href: "/sell", label: "List a Pet" },
      { href: "/contact", label: "Contact Us" },
      { href: "/login", label: "Login / Register" },
    ];

    return (
        <header className={headerClasses}>
            <div className="container mx-auto flex h-24 items-center justify-between px-4">
                
                <Link 
                    to="/" 
                    className={`flex items-center ${textColor}`}>
                    <img src="/adoptlySVG.svg" alt="Adoptly Logo" className="h-10 w-auto" />
                    {/* <img src="/adoptlytext.svg" alt="Adoptly Text" className="ml-2 mt-3 h-25 w-auto" /> */}
                </Link>

                {layoutType === 'static' && (
                <div className="hidden lg:flex flex-1 justify-center">
                    <PetSearch />
                </div>)}

                <Sheet>
                    <SheetTrigger asChild>
                        <Button 
                            variant="outline" 
                            className="h-12 w-12 rounded-full border-neutral-700 bg-black text-white hover:bg-neutral-800 hover:text-white">
                            ☰
                        </Button>
                    </SheetTrigger>
                    
                    {/* --- We are now using SheetContent --- */}
                    <SheetContent className="border-l border-neutral-800 bg-black text-white sm:w-[400px]">
                        <nav className="flex h-full flex-col justify-center text-3xl font-bold space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    to={link.href}
                                    className="block p-4 rounded-lg hover:bg-neutral-900"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </SheetContent>
                    {/* ------------------------------------ */}

                </Sheet>
                
            </div>
        </header>
    );
};

export default Navbar;