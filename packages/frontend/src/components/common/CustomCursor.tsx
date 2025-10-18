// src/components/common/CustomCursor.tsx

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useCursor } from '@/context/CursorContext';

/**
 * A custom cursor component that follows the user's mouse.
 * It uses GSAP for high-performance, smooth animation and integrates with
 * a React Context to dynamically change its appearance (size and z-index).
 */
export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  // Get the current cursor variant and zIndex from the global CursorContext.
  const { variant, zIndex } = useCursor();

  // Effect for handling the cursor's movement animation.
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
    };

    // Use GSAP's ticker for a smooth, performant animation loop.
    const updateCursor = () => {
      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          x: mousePosition.current.x,
          y: mousePosition.current.y,
          duration: 0.4,
          ease: 'power3.out',
        });
      }
    };

    // Initial setup: hide the cursor and center it.
    gsap.set(cursorRef.current, { xPercent: -50, yPercent: -50, scale: 0, opacity: 0 });

    // Animate the cursor into view on the first mouse move.
    const onFirstMove = () => {
      gsap.to(cursorRef.current, { scale: 1, opacity: 1, duration: 0.5, ease: 'power3.out' });
      window.removeEventListener('mousemove', onFirstMove);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousemove', onFirstMove);
    gsap.ticker.add(updateCursor);

    // Cleanup function to remove listeners when the component unmounts.
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousemove', onFirstMove);
      gsap.ticker.remove(updateCursor);
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount.

  // Effect for handling changes in the cursor's appearance (variant).
  useEffect(() => {
    let newScale = 1;
    if (variant === 'text') newScale = 5;
    else if (variant === 'hover') newScale = 3;

    // Animate the scale of the cursor based on the current variant.
    gsap.to(cursorRef.current, { scale: newScale, duration: 0.3, ease: 'power3.out' });
  }, [variant]); // This effect re-runs whenever the 'variant' changes.

  return (
    <div
      ref={cursorRef}
      // Apply the dynamic zIndex from the context via inline styles.
      style={{ zIndex }}
      className="pointer-events-none fixed left-0 top-0 h-4 w-4 rounded-full bg-white mix-blend-difference"
    />
  );
}