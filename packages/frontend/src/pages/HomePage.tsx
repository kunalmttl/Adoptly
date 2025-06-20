// src/pages/HomePage.tsx

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion"; 
import Preloader from "@/components/common/Preloader";

// Animation variants for the main text container
const headingContainerVariants: Variants = {
  hidden: {}, // Can be empty if we only use it for staggerChildren
  visible: {
    transition: {
      staggerChildren: 0.4, // Stagger the animation of children
    },
  },
};

// Animation variants for each line of the heading
const headingItemVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    // Using a string for the 'ease' property to satisfy TypeScript types
    transition: { duration: 0.8, ease: "easeOut" }, 
  },
};

const HomePage = () => 
  {
  // State to manage the pre-loader visibility
  const [isLoading, setIsLoading] = useState(true);

  // Simulate a loading process with a timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // The pre-loader will be visible for 3 seconds

    // Cleanup function to clear the timer when the component unmounts
    return () => clearTimeout(timer);
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return (
    <>
      {/* 
        AnimatePresence handles the exit animation of the Preloader when it's
        removed from the component tree (when isLoading becomes false).
      */}
      <AnimatePresence>
        {isLoading && <Preloader />}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden bg-black">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute"
          src="https://videos.pexels.com/video-files/3191251/3191251-uhd_2732_1440_25fps.mp4"
        />
        {/* Darkening Overlay */}
        <div className="absolute top-0 left-0 z-10 h-full w-full bg-black/50" />
        
        {/* Content */}
        <div className="relative z-20 flex h-full flex-col items-start  justify-end py-10 p-5 text-center text-white">
          <motion.h1
            className="
              text-right font-black leading-none 
              text-[10rem] md:text-[10rem] lg:text-[15rem]
            "
            variants={headingContainerVariants}
            initial="hidden"

            animate={!isLoading ? "visible" : "hidden"} // Animate only when loading is done
          >
            <motion.span className="block" variants={headingItemVariants}>
              adoptly
            </motion.span>
          </motion.h1>
        </div>
      </section>

      {/* Second Section to allow scrolling */}
      <section className="h-screen bg-neutral-100 p-8">
        <h2 className="text-center text-4xl font-bold">More Content Here</h2>
        <p className="mt-4 text-center">The page is now scrollable.</p>
      </section>
    </>
  );
};

export default HomePage;