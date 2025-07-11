// src/components/layout/Navbar.tsx

import { Link } from "react-router-dom";
import PetSearch from "./PetSearch";
import { useCursor } from "@/context/CursorContext"; 
import Header from "@/components/Header"; 
import { UserNav } from "./UserNav"; // <-- Import the new UserNav
import { useAuthStore } from "@/store/authStore"; 
import { ProfileSwitcher } from "./ProfileSwitcher"; 

interface NavbarProps {
    layoutType?: 'fixed' | 'static'; // The '?' makes it optional
}

const GuestMenu = () => {
    // Call the hook only inside the component that needs it.
    const { setVariant } = useCursor();
    return (
        <div onMouseEnter={() => setVariant('hover')} onMouseLeave={() => setVariant('default')}>
            <Header />
        </div>
    );
}


const Navbar = ({ layoutType = 'fixed' }: NavbarProps) => {

    const { user } = useAuthStore();


    const headerClasses = layoutType === 'fixed'
        ? 'fixed top-0 left-0 z-50 w-full' // For MinimalLayout
        : 'relative z-50 w-full border-b bg-neutral-900'; // For AppLayout

        const textColor = layoutType === 'fixed' ? 'text-white' : 'text-neutral-200';


    // Dynamically set text color
    

    const { setVariant } = useCursor();


    return (
        <header className={headerClasses}>
            <div className="container mx-auto flex h-24 items-center justify-between px-1">
                
                <Link onMouseEnter={() => setVariant('text')}
            onMouseLeave={() => setVariant('default')}

                    to="/" 
                    className={`flex items-center ${textColor} `}>
                    <img src="/adoptlySVG.svg" alt="Adoptly Logo" className="h-10 w-auto z-[9999]" />
                    {/* <img src="/adoptlytext.svg" alt="Adoptly Text" className="ml-2 mt-3 h-25 w-auto" /> */}
                </Link>

                {layoutType === 'static' && (
                <div className="hidden lg:flex flex-1 justify-center">
                    <PetSearch />
                </div>)}

                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <ProfileSwitcher /> 
                            <UserNav />
                        </>
                    ) : (
                        <GuestMenu />
                    )}
                </div>
                
            </div>
        </header>
    );
};

export default Navbar;