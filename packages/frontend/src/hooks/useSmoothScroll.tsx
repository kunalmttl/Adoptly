// src/hooks/useSmoothScroll.ts

import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

const useSmoothScroll = () => 
{
  // We use useEffect to initialize and clean up Lenis
        useEffect(() => 
        {
                // Initialize Lenis with some nice default options
                const lenis = new Lenis(
                {
                        duration: 1.2,
                        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // A nice ease-out curve
                });

                // This function is called on every animation frame
                function raf(time: number) 
                {
                        lenis.raf(time);
                        requestAnimationFrame(raf);
                }

                // Start the animation loop
                requestAnimationFrame(raf);

                // Cleanup function: This is crucial.
                // It runs when the component unmounts to destroy the Lenis instance.
                return () => {lenis.destroy();};
        }, []); // The empty dependency array ensures this runs only once
};

export default useSmoothScroll;