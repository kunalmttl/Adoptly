// # Main Navigation Bar (for non-homepage routes)

import { Link } from "react-router-dom";
import { useCursor } from "@/context/CursorContext"; 
import { useAuthStore } from "@/store/authStore"; 
import Magnetic from "@/components/common/Magnetic";
import Header from "@/components/Header"; 
import { UserNav } from "./UserNav";
import { ProfileSwitcher } from "./ProfileSwitcher"; 

// ? This prop is now more descriptive of its purpose.
interface NavbarProps {
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

    // ! FIX: Simplified logic. No longer needs to check for homepage.
    const headerClasses = layoutType === 'app'
        ? 'relative w-full border-b bg-neutral-900 text-neutral-200' // For AppLayout
        : 'fixed top-0 left-0 w-full bg-white shadow-sm text-neutral-800'; // For other MinimalLayout pages

    const handleLogoEnter = () => {
        setVariant('hover');
        setZIndex(1); 
    };

    const handleLogoLeave = () => {
        setVariant('default');
        setZIndex(9900);
    };

    return (
        <header className={`${headerClasses} z-50 relative isolation-isolate bg-transparent`}>
            <div className="container mx-auto flex h-24 items-center justify-between px-4">
                
                <Magnetic>
                    <div 
                        onMouseEnter={handleLogoEnter}
                        onMouseLeave={handleLogoLeave}
                        className="relative z-10"
                    >
                        <Link to="/" className="flex items-center">
                            <img src="/adoptlySVG.svg" alt="Adoptly Logo" className="h-10 w-auto" />
                        </Link>
                    </div>
                </Magnetic>

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