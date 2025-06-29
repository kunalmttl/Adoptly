// # Reusable Magnetic Icon Component with Cursor Interaction

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useCursor } from '@/context/CursorContext';

interface MagneticIconProps {
  children: ReactNode;
  href: string;
}

export default function MagneticIcon({ children, href }: MagneticIconProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const { setVariant } = useCursor();

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
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
      transition={{ type: "spring", stiffness: 250, damping: 15, mass: 0.5 }}
      // ! FIX: Add z-index to place this component on a higher layer within its stacking context.
      className="group relative z-10 inline-flex items-center justify-center p-4 rounded-full"
    >
      {children}
    </motion.a>
  );
}