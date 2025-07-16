// src/components/home/AnimatedLogoText.tsx

import { motion } from "framer-motion";

// Animation variants for the SVG path
const drawVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { type: "spring", duration: 2.5, bounce: 0 },
      opacity: { duration: 0.01 }
    }
  }
};

export const AnimatedLogoText = () => {
  return (
    <motion.svg
      width="800" // Adjust width to fit your text
      height="250" // Adjust height to fit your text
      viewBox="0 0 800 250" // Adjust viewBox to fit your text
      initial="hidden"
      animate="visible"
    >
      {/* This is where you paste your SVG path data */}
      <motion.path
        d="M 10 120 C 20 0, 40 0, 50 120 S 80 240, 90 120 ... PASTE YOUR LONG SVG PATH DATA HERE ..."
        fill="transparent"
        stroke="white"
        strokeWidth="3" // Adjust stroke width for desired thickness
        variants={drawVariants}
      />
    </motion.svg>
  );
};

