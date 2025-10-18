// src/components/common/Magnetic.tsx

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { ReactNode, MouseEvent } from 'react';

/**
 * Props for the Magnetic component.
 */
interface MagneticProps {
  /** The child element(s) that will have the magnetic effect applied. */
  children: ReactNode;
}

/**
 * A wrapper component that applies a "magnetic" hover effect to its children.
 * When the user's mouse moves over the component, the child element will be
 * smoothly pulled towards the cursor's position.
 */
export default function Magnetic({ children }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  /**
   * Handles the mouse move event to calculate the new position for the child element.
   */
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const { clientX, clientY } = e;
    const { width, height, left, top } = ref.current.getBoundingClientRect();

    // Calculate the distance of the mouse from the center of the element.
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);

    setPosition({ x, y });
  };

  /**
   * Resets the position when the mouse leaves the component, causing the child
   * to animate back to its original centered position.
   */
  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      // Animate the element's position based on the calculated x and y values.
      animate={{ x, y }}
      // Use a spring transition for a natural, bouncy physical effect.
      transition={{ type: 'spring', stiffness: 350, damping: 15, mass: 0.5 }}
    >
      {children}
    </motion.div>
  );
}