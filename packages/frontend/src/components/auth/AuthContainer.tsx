// src/components/auth/AuthContainer.tsx

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

/**
 * Props for the AuthContainer component.
 */
interface AuthContainerProps {
  /** A React component to be displayed as the illustration (left side). */
  illustration: ReactNode;
  /** The form component (e.g., AuthForm) to be displayed (right side). */
  form: ReactNode;
}

/**
 * A reusable layout component for authentication pages (Login/Register).
 * It creates a two-column container with an illustration on the left and a form on the right.
 */
const AuthContainer = ({ illustration, form }: AuthContainerProps) => {
  return (
    // Main container with rounded corners, shadow, and a flex layout.
    <div className="flex w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl">
      {/* Left Column: Illustration */}
      {/* This column is hidden on smaller screens (md:flex). */}
      <div className="hidden md:flex md:w-2/5 items-center justify-center bg-orange-50 p-8">
        <motion.div
          // Animate the illustration on load for a nice visual effect.
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
        >
          {illustration}
        </motion.div>
      </div>

      {/* Right Column: Form */}
      {/* This column takes up the full width on small screens and 3/5 on medium screens and up. */}
      <div className="w-full md:w-3/5 p-4 sm:p-8 flex items-center justify-center">
        {form}
      </div>
    </div>
  );
};

export default AuthContainer;