// src/components/Header/MagneticButton/index.tsx

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { ReactNode, MouseEvent } from 'react';
import styles from './style.module.scss';
import { useCursor } from '@/context/CursorContext';

/**
 * Props for the MagneticButton component.
 */
interface MagneticButtonProps {
  children: ReactNode;
  /** Whether the main navigation menu is active. */
  isActive: boolean;
}

/**
 * A specialized version of the Magnetic component for the header's burger button.
 * It disables the magnetic effect when the menu is open.
 */
const MagneticButton = ({ children, isActive }: MagneticButtonProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const { setVariant } = useCursor();

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    // Disable the magnetic effect if the menu is open.
    if (isActive || !ref.current) return;

    const { clientX, clientY } = e;
    const { width, height, left, top } = ref.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPosition({ x, y });
  };

  const handleMouseEnter = () => {
    setVariant('hover');
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    setVariant('default');
  };

  // Effect to reset the button's position if the menu is opened.
  useEffect(() => {
    if (isActive) {
      setPosition({ x: 0, y: 0 });
    }
  }, [isActive]);

  const { x, y } = position;

  return (
    <motion.div
      className={styles.magnetic}
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{ x, y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </motion.div>
  );
};

export default MagneticButton;