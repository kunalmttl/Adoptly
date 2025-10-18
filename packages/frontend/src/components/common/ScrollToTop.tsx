// src/components/common/ScrollToTop.tsx

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * A utility component that automatically scrolls the window to the top (0, 0)
 * whenever the user navigates to a new page (i.e., when the URL pathname changes).
 *
 * This component does not render any visible UI. It should be placed once
 * at a high level in your application, typically inside your router setup.
 */
export default function ScrollToTop() {
  // Get the current location object from React Router.
  const { pathname } = useLocation();

  // Use an effect that is triggered whenever the `pathname` changes.
  useEffect(() => {
    // Execute the scroll to the top-left corner of the page.
    window.scrollTo(0, 0);
  }, [pathname]); // The dependency array ensures this effect only runs on a URL change.

  // This component is purely for side effects and renders nothing.
  return null;
}