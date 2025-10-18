// src/hooks/useSmoothScroll.ts

import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

/**
 * A custom hook to initialize and manage a smooth scrolling experience
 * for the entire application using the Lenis library.
 *
 * This hook should be called once in a top-level component (like App.tsx)
 * to apply the effect globally.
 */
const useSmoothScroll = () => {
  useEffect(() => {
    // Initialize a new Lenis instance with custom easing options for a smooth effect.
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // A standard ease-out curve
    });

    /**
     * The animation loop function.
     * On each animation frame, it tells Lenis to update the scroll position.
     * @param {number} time The current time provided by requestAnimationFrame.
     */
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    // Start the animation loop.
    requestAnimationFrame(raf);

    // The cleanup function. This is crucial for preventing memory leaks.
    // It runs when the component that uses this hook unmounts, ensuring
    // the Lenis instance and its animation loop are properly destroyed.
    return () => {
      lenis.destroy();
    };
  }, []); // The empty dependency array ensures this effect runs only once when the app mounts.
};

export default useSmoothScroll;