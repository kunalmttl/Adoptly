// src/components/Header/index.tsx

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Burger from './Burger';
import Nav from './Nav';
import MagneticButton from './MagneticButton';

/**
 * Props for the main Header component.
 */
interface HeaderProps {
  /** An optional CSS class to control the color of the burger icon lines. */
  textColorClass?: string;
}

/**
 * The main header component for the application.
 * It manages the open/closed state of the navigation menu and orchestrates
 * the Burger button and the slide-out Nav panel.
 */
export default function Header({ textColorClass }: HeaderProps) {
  const [isActive, setIsActive] = useState(false);

  return (
    // Use a relative container to properly position the absolute elements.
    <div className="relative">
      {/* Wrap the Burger in a MagneticButton for the hover effect. */}
      <MagneticButton isActive={isActive}>
        <Burger isActive={isActive} setIsActive={setIsActive} textColorClass={textColorClass} />
      </MagneticButton>

      {/* AnimatePresence handles the mounting and unmounting animations of the Nav panel. */}
      <AnimatePresence mode="wait">
        {isActive && <Nav />}
      </AnimatePresence>
    </div>
  );
}