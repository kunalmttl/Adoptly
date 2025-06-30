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

import { cn } from "@/lib/utils";

// ? This prop is now more descriptive of its purpose.
interface NavbarProps {
    layoutType?: 'app' | 'minimal'; 
}

const GuestMenu = ({ textColorClass }: { textColorClass: string }) => {
    const { setVariant } = useCursor();
    return (
        <div onMouseEnter={() => setVariant('hover')} onMouseLeave={() => setVariant('default')}>
            <Header textColorClass={textColorClass} />
        </div>
    );
}

const Navbar = ({ layoutType = 'minimal' }: NavbarProps) => {
    const { user } = useAuthStore();
    const { setVariant, setZIndex } = useCursor();

    const handleLogoEnter = () => {
        setVariant('hover');
        setZIndex(1); 
    };

    const handleLogoLeave = () => {
        setVariant('default');
        setZIndex(9900);
    };

    const textColorClass = "text-neutral-800";

    return (
        <header className={cn(
            "relative w-full z-50 isolation-isolate",
            layoutType === 'app' ? "bg-orange-50" : "bg-transparent",
            layoutType === 'app' ? "" : "shadow-sm", // Only apply shadow for minimal layout
            textColorClass
        )}>
            <div className="container mx-auto flex h-24 items-center justify-between px-4">
                
                <Magnetic>
                    <div 
                        onMouseEnter={handleLogoEnter}
                        onMouseLeave={handleLogoLeave}
                        className="relative z-10"
                    >
                        <Link to="/" className={cn("flex items-center", textColorClass)}>
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
                        <GuestMenu textColorClass={textColorClass} />
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;