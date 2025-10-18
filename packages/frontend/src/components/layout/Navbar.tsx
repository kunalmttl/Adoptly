// src/components/layout/Navbar.tsx

import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

import { useCursor } from '@/context/CursorContext';
import { useAuthStore } from '@/store/authStore';
import Magnetic from '@/components/common/Magnetic';
import Header from '@/components/Header';
import { UserNav } from './UserNav';
import { ProfileSwitcher } from './ProfileSwitcher';

/**
 * Props for the Navbar component.
 */
interface NavbarProps {
  /** Determines the background style of the navbar. */
  layoutType?: 'app' | 'minimal';
}

/**
 * A menu component for guest (unauthenticated) users.
 */
const GuestMenu = () => {
  const { setVariant } = useCursor();
  return (
    <div onMouseEnter={() => setVariant('hover')} onMouseLeave={() => setVariant('default')}>
      {/* The text color is hardcoded to dark for this navbar variant. */}
      <Header textColorClass="text-neutral-800" />
    </div>
  );
};

/**
 * The main navigation bar for all non-homepage routes.
 * It has a solid background and provides consistent navigation controls.
 */
const Navbar = ({ layoutType = 'minimal' }: NavbarProps) => {
  const { user } = useAuthStore();
  const { setVariant, setZIndex } = useCursor();

  // Handlers to manage the custom cursor's z-index for the logo.
  const handleLogoEnter = () => {
    setVariant('hover');
    setZIndex(1);
  };
  const handleLogoLeave = () => {
    setVariant('default');
    setZIndex(9900);
  };

  return (
    <header
      className={cn(
        'relative w-full z-10 isolation-isolate text-neutral-800',
        layoutType === 'app' ? 'bg-orange-50' : 'bg-transparent'
      )}
    >
      <div className="container mx-auto flex h-24 items-center justify-between px-4">
        {/* Logo with Magnetic Effect */}
        <Magnetic>
          <div onMouseEnter={handleLogoEnter} onMouseLeave={handleLogoLeave} className="relative z-10">
            <Link to="/" className="flex items-center">
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
            <GuestMenu />
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;