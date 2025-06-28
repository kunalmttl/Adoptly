// src/components/auth/AuthContainer.tsx

import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface AuthContainerProps 
{
  illustration: ReactNode;
  form: ReactNode;
}

const AuthContainer = ({ illustration, form }: AuthContainerProps) => 
{
  return (
    // This is the main container with the rounded corners and shadow
    <div className="flex w-full max-w-4xl overflow-hidden rounded-2xl bg-beige shadow-xl">
      {/* Left Column: Illustration */}
      <div className="w-10px h-auto bg-orange-50 p-5">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
        >
          {illustration}
        </motion.div>
      </div>

      {/* Right Column: Form */}
      <div className="items-center">
        {form}
      </div>
    </div>
  );
};

export default AuthContainer;