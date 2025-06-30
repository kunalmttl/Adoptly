// # Scroll To Top Utility Component

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * * This component automatically scrolls the window to the top (0, 0)
 * * whenever the route changes.
 */
export default function ScrollToTop() {
  // * Get the current location object, which contains the pathname
  const { pathname } = useLocation();

  // * Use an effect that triggers whenever the pathname changes
  useEffect(() => {
    // =-= Scroll the window to the top left corner
    window.scrollTo(0, 0);
  }, [pathname]); // ? The dependency array ensures this effect only runs on a URL change.

  // ? This component doesn't render any visible JSX.
  return null;
}