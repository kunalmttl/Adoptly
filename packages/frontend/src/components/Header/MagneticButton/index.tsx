// src/components/Header/MagneticButton/index.tsx

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import styles from './style.module.scss';
import { useCursor } from '@/context/CursorContext';

interface MagneticButtonProps {
  children: ReactNode;
  isActive: boolean;
}

const MagneticButton = ({ children, isActive }: MagneticButtonProps) => {
  // 1. Create a ref to get direct access to the DOM element
  const ref = useRef<HTMLDivElement>(null);

  // 2. State to store the element's position
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const { setVariant } = useCursor();
  
  // 3. The mouse move handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isActive) return;

    // Get the mouse coordinates and the element's bounding box
    const { clientX, clientY } = e;
    const { width, height, left, top } = ref.current!.getBoundingClientRect();

    // Calculate the distance from the mouse to the center of the element
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);

    // Update the position state
    setPosition({ x, y });
  };

  const handleMouseEnter = () => {
      // When the mouse enters, set the cursor to the 'hover' variant
      setVariant('hover');
    };

  // 4. The mouse leave handler to reset the position
  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    setVariant('default'); 
  };
  useEffect(() => {
    // If the menu is opened, force the button back to its center
    if (isActive) {
      setPosition({ x: 0, y: 0 });
    }
  }, [isActive]); 


  // Destructure the position for use in the animation
  const { x, y } = position;

  return (
    <motion.div
      className={styles.magnetic}
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter} // <-- Attach the new handler
      onMouseLeave={handleMouseLeave} 
      // Animate the element to the calculated position
      animate={{ x, y }}
      // Add a spring transition for a nice, bouncy feel
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </motion.div>
  );
};

export default MagneticButton;