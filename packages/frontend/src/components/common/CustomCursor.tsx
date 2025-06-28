// src/components/common/CustomCursor.tsx
import { useRef, useEffect } from "react";
import gsap from "gsap"; // <-- Import GSAP
import { useCursor } from "@/context/CursorContext"; 

const CustomCursor = () => 
{
  const cursorRef = useRef(null);
  const { variant } = useCursor(); 


  useEffect(() => 
  {
    // This function will be called whenever the mouse moves
    const onMouseMove = (e: MouseEvent) => 
    {
      const { clientX, clientY } = e;
      
      // Use GSAP to smoothly animate the cursor to the mouse position
      gsap.to(cursorRef.current,   
      {
        x: clientX,
        y: clientY,
        duration: 0.4, // Controls the "lag" or smoothness
        ease: "power3.out", // A nice easing function
      });
    };

    // Add the event listener when the component mounts
    window.addEventListener("mousemove", onMouseMove);

    // Cleanup: Remove the event listener when the component unmounts
    return () => 
    {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);


  useEffect(() => 
  {
    let newScale = 1;
    if (variant === 'text') {
      newScale = 5; 
    } else if (variant === 'hover') {
      newScale = 3; // Let's make it 3x bigger (or any size you like)
    }

    
    gsap.to(cursorRef.current, 
    {
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
        h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full 
        bg-white mix-blend-difference
      "
    />
  );
};

export default CustomCursor;