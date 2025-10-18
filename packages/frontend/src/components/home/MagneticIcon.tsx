// src/components/home/MagneticIcon.tsx

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { ReactNode, MouseEvent } from 'react';
import { useCursor } from '@/context/CursorContext';

/**
 * Props for the MagneticIcon component.
 */
interface MagneticIconProps {
  /** The icon component to be displayed. */
  children: ReactNode;
  /** The URL the icon should link to. */
  href: string;
}

/**
 * A component that wraps an icon, making it "magnetic" to the user's cursor on hover.
 * It also interacts with the global CursorContext to change the cursor's appearance.
 */
export default function MagneticIcon({ children, href }: MagneticIconProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const { setVariant } = useCursor();

  /**
   * Calculates the icon's position based on the cursor's location within the element.
   */
  const handleMouseMove = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { width, height, left, top } = ref.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPosition({ x, y });
  };

  /**
   * Sets the cursor variant to 'hover' when the mouse enters the component.
   */
  const handleMouseEnter = () => {
    setVariant('hover');
  };

  /**
   * Resets the icon's position and the cursor variant when the mouse leaves.
   */
  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    setVariant('default');
  };

  const { x, y } = position;

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{ x, y }}
      transition={{ type: 'spring', stiffness: 250, damping: 15, mass: 0.5 }}
      // A z-index is applied to ensure the icon is on a higher layer than the cursor
      // within its local stacking context, preventing visual glitches.
      className="group relative z-10 inline-flex items-center justify-center p-4 rounded-full"
    >
      {children}
    </motion.a>
  );
}