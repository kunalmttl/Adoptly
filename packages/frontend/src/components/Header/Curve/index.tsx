// src/components/Header/Curve/index.tsx

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants, Easing } from 'framer-motion';
import styles from './style.module.scss';

/**
 * An animated SVG curve that creates a "gooey" effect on the side of the
 * navigation panel as it opens and closes.
 */
export default function Curve() {
  const [dimensions, setDimensions] = useState({ height: 0 });

  // Effect to get and update the window height for the SVG path.
  useEffect(() => {
    const updateHeight = () => {
      setDimensions({ height: window.innerHeight });
    };
    updateHeight(); // Set initial height
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // Defines the SVG path for the curve in its initial (curved) state.
  const initialPath = `M100 0 L100 ${dimensions.height} Q-100 ${dimensions.height / 2} 100 0`;
  // Defines the SVG path for the curve in its final (straight) state.
  const targetPath = `M100 0 L100 ${dimensions.height} Q100 ${dimensions.height / 2} 100 0`;

  // A custom easing function for the curve animation.
  const customEase: Easing = [0.76, 0, 0.24, 1];

  const curveVariants: Variants = {
    initial: { d: initialPath },
    enter: { d: targetPath, transition: { duration: 1, ease: customEase } },
    exit: { d: initialPath, transition: { duration: 0.8, ease: customEase } },
  };

  return (
    <svg className={styles.svgCurve}>
      <motion.path variants={curveVariants} initial="initial" animate="enter" exit="exit" />
    </svg>
  );
}