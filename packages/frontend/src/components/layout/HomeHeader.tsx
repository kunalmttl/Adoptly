// # Minimal Header for Homepage

import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useCursor } from "@/context/CursorContext";
import Magnetic from "@/components/common/Magnetic";
import Header from "@/components/Header"; // The hamburger menu component
import { UserNav } from "./UserNav";
import { ProfileSwitcher } from "./ProfileSwitcher";
import { useState, useEffect } from "react"; // Import useState and useEffect
import { cn } from "@/lib/utils"; // Import cn for conditional class names

const GuestMenu = ({ textColorClass }: { textColorClass: string }) => {
    const { setVariant } = useCursor();
    return (
        <div onMouseEnter={() => setVariant('hover')} onMouseLeave={() => setVariant('default')}>
            <Header textColorClass={textColorClass} />
        </div>
    );
};

export const HomeHeader = () => {
  const { user } = useAuthStore();
  const { setVariant, setZIndex } = useCursor();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) { // Adjust scroll threshold as needed
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogoEnter = () => {
    setVariant('hover');
    setZIndex(1);
  };

  const handleLogoLeave = () => {
    setVariant('default');
    setZIndex(9900);
  };

  const textColorClass = isScrolled ? "text-neutral-800" : "text-white";

  return (
    <header className={cn(
      "top-0 left-0 w-full z-50 sticky isolation-isolate transition-colors duration-300",
      isScrolled ? "bg-orange-50 shadow-sm" : "bg-transparent",
      textColorClass
    )}>
      <div className="container mx-auto flex h-24 items-center justify-between px-4">
        
        {/* Logo with Magnetic Effect */}
        <Magnetic>
          <div 
            onMouseEnter={handleLogoEnter}
            onMouseLeave={handleLogoLeave}
            className="relative z-10"
          >
            <Link to="/" className={cn("flex items-center", textColorClass)}>
              <img src="/adoptlySVG.svg" alt="Adoptly Logo" className="h-15 w-auto" />
            </Link>
          </div>
        </Magnetic>

        {/* # Right side actions: either guest menu or user menu */}
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