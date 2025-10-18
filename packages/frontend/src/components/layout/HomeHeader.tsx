// src/components/layout/HomeHeader.tsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

import { useAuthStore } from '@/store/authStore';
import { useCursor } from '@/context/CursorContext';
import Magnetic from '@/components/common/Magnetic';
import Header from '@/components/Header'; // The hamburger menu component
import { UserNav } from './UserNav';
import { ProfileSwitcher } from './ProfileSwitcher';

/**
 * A menu component specifically for guest (unauthenticated) users.
 * It wraps the main Header (burger menu) to provide cursor context interaction.
 */
const GuestMenu = ({ textColorClass }: { textColorClass: string }) => {
  const { setVariant } = useCursor();
  return (
    <div onMouseEnter={() => setVariant('hover')} onMouseLeave={() => setVariant('default')}>
      <Header textColorClass={textColorClass} />
    </div>
  );
};

/**
 * A special header component for the homepage.
 * It starts as transparent and transitions to a solid background with a shadow
 * as the user scrolls down the page.
 */
export const HomeHeader = () => {
  const { user } = useAuthStore();
  const { setVariant, setZIndex } = useCursor();
  // State to track whether the user has scrolled past a certain threshold.
  const [isScrolled, setIsScrolled] = useState(false);

  // Effect to add and clean up the scroll event listener.
  useEffect(() => {
    const handleScroll = () => {
      // Set isScrolled to true if the user has scrolled more than 100 pixels.
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handlers to manage the custom cursor's z-index for the logo.
  const handleLogoEnter = () => {
    setVariant('hover');
    setZIndex(1); // Lower z-index to go behind the logo.
  };
  const handleLogoLeave = () => {
    setVariant('default');
    setZIndex(9900); // Restore high z-index.
  };

  // Dynamically determine the text color based on the scroll state.
  const textColorClass = isScrolled ? 'text-neutral-800' : 'text-white';

  return (
    <header
      className={cn(
        'sticky top-0 left-0 w-full z-50 isolation-isolate transition-colors duration-300',
        isScrolled ? 'bg-orange-50 shadow-sm' : 'bg-transparent',
        textColorClass
      )}
    >
      <div className="container mx-auto flex h-24 items-center justify-between px-4">
        {/* Logo with Magnetic Effect */}
        <Magnetic>
          <div onMouseEnter={handleLogoEnter} onMouseLeave={handleLogoLeave} className="relative z-10">
            <Link to="/" className={cn('flex items-center', textColorClass)}>
              <img src="/adoptlySVG.svg" alt="Adoptly Logo" className="h-12 w-auto" />
            </Link>
          </div>
        </Magnetic>

        {/* Right side actions: Conditionally render guest or user menu. */}
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