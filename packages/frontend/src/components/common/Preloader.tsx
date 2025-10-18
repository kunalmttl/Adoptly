// src/components/common/Preloader.tsx

import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

// Animation variants for the main preloader container.
const containerVariants: Variants = {
  initial: { y: 0 },
  // The 'exit' state, which slides the container up and out of view.
  slideUp: {
    y: '-100vh',
    transition: { duration: 1.0, ease: 'easeInOut' },
  },
};

// Animation variants for the text inside the preloader.
const textVariants: Variants = {
  initial: { opacity: 1 },
  // The 'exit' state, which fades the text out before the container slides up.
  exit: {
    opacity: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

/**
 * A full-screen preloader component that displays an animated message
 * when the application is first loading. It uses Framer Motion's `exit`
 * animations to smoothly transition out.
 */
const Preloader = () => {
  return (
    <motion.div
      className="fixed top-0 left-0 z-[10000] flex h-screen w-full items-center justify-center bg-black"
      variants={containerVariants}
      initial="initial"
      // The 'exit' prop tells Framer Motion to play this animation when the
      // component is removed from the React tree (e.g., inside an AnimatePresence).
      exit="slideUp"
    >
      <motion.p
        className="text-lg text-neutral-400"
        variants={textVariants}
        initial="initial"
        exit="exit"
      >
        Rescue a heart, find a friend.
      </motion.p>
    </motion.div>
  );
};

export default Preloader;