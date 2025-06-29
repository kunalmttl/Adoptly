// # Main Navigation Bar

import { Link, useLocation } from "react-router-dom";
import PetSearch from "./PetSearch";
import { useCursor } from "@/context/CursorContext"; 
import Header from "@/components/Header"; 
import { UserNav } from "./UserNav";
import { useAuthStore } from "@/store/authStore"; 
import { ProfileSwitcher } from "./ProfileSwitcher"; 
import Magnetic from "@/components/common/Magnetic";

interface NavbarProps {
    // =-= This prop helps distinguish between the main app layout (dark, static) and the minimal layout (transparent/white, fixed)
    layoutType?: 'app' | 'minimal';
}

const GuestMenu = () => {
    const { setVariant } = useCursor();
    return (
        <div onMouseEnter={() => setVariant('hover')} onMouseLeave={() => setVariant('default')}>
            <Header />
        </div>
    );
}

const Navbar = ({ layoutType = 'minimal' }: NavbarProps) => {
    const { user } = useAuthStore();
    const { setVariant, setZIndex } = useCursor();
    const location = useLocation();

    const isHomePage = location.pathname === '/';

    // # Simplified Logic for Styling
    // ! FIX: The position is now directly tied to the layoutType. 'minimal' is always fixed.
    const headerClasses = layoutType === 'app'
        ? 'relative z-50 w-full' // For AppLayout (Browse Page)
        : 'fixed top-0 left-0 z-50 w-full'; // For MinimalLayout (Homepage, etc.)

    // =-= Background is transparent on homepage, otherwise depends on the layout type.
    const navBackgroundClass = isHomePage
        ? 'bg-transparent'
        : layoutType === 'app' ? 'bg-neutral-900 border-b' : 'bg-white shadow-sm';

    // =-= Text color is light for transparent/dark backgrounds, dark for light backgrounds.
    const textColor = isHomePage || layoutType === 'app' ? 'text-white' : 'text-neutral-800';
    
    const handleLogoEnter = () => {
        setVariant('hover');
        setZIndex(1); 
    };

    const handleLogoLeave = () => {
        setVariant('default');
        setZIndex(9900);
    };

    return (
        <header className={`${headerClasses} ${navBackgroundClass} relative isolation-isolate transition-colors duration-300`}>
            <div className="container mx-auto flex h-24 items-center justify-between px-1">
                <Magnetic>
                    <div 
                        onMouseEnter={handleLogoEnter}
                        onMouseLeave={handleLogoLeave}
                        className="relative z-10"
                    >
                        <Link to="/" className={`flex items-center ${textColor}`}>
                            <img src="/adoptlySVG.svg" alt="Adoptly Logo" className="h-10 w-auto" />
                        </Link>
                    </div>
                </Magnetic>

                {layoutType === 'app' && (
                    <div className="hidden lg:flex flex-1 justify-center">
                        <PetSearch />
                    </div>
                )}

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