// # Custom Cursor Component (Refactored for Performance)

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useCursor } from "@/context/CursorContext"; 

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  // * Use a ref to store the mouse position. This avoids re-renders on every mouse move.
  const mousePosition = useRef({ x: 0, y: 0 });
  const { variant } = useCursor();

  useEffect(() => {
    // # Event listener to update the stored mouse position
    const onMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
    };

    // # GSAP ticker function for smooth animation
    // =-= This function runs on every animation frame, managed by GSAP.
    const updateCursor = () => {
      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          x: mousePosition.current.x,
          y: mousePosition.current.y,
          duration: 0.4, // Controls the "lag" or smoothness
          ease: "power3.out",
        });
      }
    };

    // * Set initial state to be invisible and centered
    gsap.set(cursorRef.current, { xPercent: -50, yPercent: -50, scale: 0, opacity: 0 });

    // * Fade in the cursor on the first mouse move
    const onFirstMove = () => {
        gsap.to(cursorRef.current, { scale: 1, opacity: 1, duration: 0.5, ease: "power3.out" });
        window.removeEventListener('mousemove', onFirstMove); // ? Remove this listener after it runs once
    };

    // # Add event listeners
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener('mousemove', onFirstMove);
    gsap.ticker.add(updateCursor);

    // ! Cleanup function is crucial to prevent memory leaks
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener('mousemove', onFirstMove);
      gsap.ticker.remove(updateCursor);
    };
  }, []);

  // # Effect to handle variant changes (scaling)
  useEffect(() => {
    let newScale = 1;
    if (variant === 'text') {
      newScale = 5; 
    } else if (variant === 'hover') {
      newScale = 3;
    }
    
    gsap.to(cursorRef.current, {
      scale: newScale,
      duration: 0.3,
      ease: "power3.out",
    });

  }, [variant]);

  return (
    <div
      ref={cursorRef}
      className="
        pointer-events-none fixed left-0 top-0 z-[9900] 
        h-4 w-4 rounded-full 
        bg-white mix-blend-difference
      "
    />
  );
};