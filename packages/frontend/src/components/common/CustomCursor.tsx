// # Custom Cursor Component (Refactored for Performance & Dynamic Z-Index)

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useCursor } from "@/context/CursorContext"; 

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  
  // ! FIX: Get the dynamic zIndex from the context
  const { variant, zIndex } = useCursor();

  useEffect(() => {
    // ... (The animation logic inside useEffect remains the same)
    const onMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
    };
    const updateCursor = () => {
      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          x: mousePosition.current.x,
          y: mousePosition.current.y,
          duration: 0.4,
          ease: "power3.out",
        });
      }
    };
    gsap.set(cursorRef.current, { xPercent: -50, yPercent: -50, scale: 0, opacity: 0 });
    const onFirstMove = () => {
        gsap.to(cursorRef.current, { scale: 1, opacity: 1, duration: 0.5, ease: "power3.out" });
        window.removeEventListener('mousemove', onFirstMove);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener('mousemove', onFirstMove);
    gsap.ticker.add(updateCursor);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener('mousemove', onFirstMove);
      gsap.ticker.remove(updateCursor);
    };
  }, []);

  useEffect(() => {
    // ... (The scaling logic for variants remains the same)
    let newScale = 1;
    if (variant === 'text') newScale = 5; 
    else if (variant === 'hover') newScale = 3;
    gsap.to(cursorRef.current, { scale: newScale, duration: 0.3, ease: "power3.out" });
  }, [variant]);

  return (
    <div
      ref={cursorRef}
      // ! FIX: Apply zIndex via inline style and remove the hardcoded z-index class
      style={{ zIndex }}
      className="
        pointer-events-none fixed left-0 top-0
        h-4 w-4 rounded-full 
        bg-white mix-blend-difference
      "
    />
  );
};