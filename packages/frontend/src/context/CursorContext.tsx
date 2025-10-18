// src/context/CursorContext.tsx

import { createContext, useState, useContext, useCallback } from 'react';
import type { ReactNode } from 'react';

/**
 * Defines the possible variants for the custom cursor's appearance.
 * - 'default': The standard small dot.
 * - 'text': A larger size, typically used when hovering over text.
 * - 'hover': An intermediate size for general interactive elements.
 */
type CursorVariant = 'default' | 'text' | 'hover';

/**
 * Defines the shape of the data that the CursorContext will provide.
 */
interface CursorContextType {
  /** The current appearance variant of the cursor. */
  variant: CursorVariant;
  /** A function to update the cursor's variant. */
  setVariant: (variant: CursorVariant) => void;
  /** The current z-index of the cursor, used for layering. */
  zIndex: number;
  /** A function to update the cursor's z-index. */
  setZIndex: (zIndex: number) => void;
}

// Create the React Context with an initial value of undefined.
const CursorContext = createContext<CursorContextType | undefined>(undefined);

/**
 * The provider component that wraps parts of the application that need access to the cursor's state.
 * It manages the state for the cursor's variant and z-index and makes them available to its children.
 */
export const CursorProvider = ({ children }: { children: ReactNode }) => {
  const [variant, setVariant] = useState<CursorVariant>('default');
  // State for the cursor's z-index, defaulting to a high value to be on top of most content.
  const [zIndex, setZIndex] = useState(9900);

  // Memoize the setter functions using useCallback. This is a performance optimization
  // that ensures these functions are not recreated on every render, preventing
  // unnecessary re-renders in child components that consume the context.
  const stableSetVariant = useCallback((newVariant: CursorVariant) => {
    setVariant(newVariant);
  }, []);

  const stableSetZIndex = useCallback((newZIndex: number) => {
    setZIndex(newZIndex);
  }, []);

  // The value object that will be passed down through the context provider.
  const value = {
    variant,
    setVariant: stableSetVariant,
    zIndex,
    setZIndex: stableSetZIndex,
  };

  return <CursorContext.Provider value={value}>{children}</CursorContext.Provider>;
};

/**
 * A custom hook that provides a convenient way for components to access the cursor context.
 * It includes an error check to ensure it is only used within a <CursorProvider>.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useCursor = () => {
  const context = useContext(CursorContext);
  if (context === undefined) {
    throw new Error('useCursor must be used within a CursorProvider');
  }
  return context;
};