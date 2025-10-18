// # Cursor Context Provider

import { createContext, useState, useContext, useCallback } from 'react';
import type { ReactNode } from 'react';

type CursorVariant = 'default' | 'text' | 'hover';

// ! FIX: Add zIndex and its setter to the context type
interface CursorContextType {
  variant: CursorVariant;
  setVariant: (variant: CursorVariant) => void;
  zIndex: number;
  setZIndex: (zIndex: number) => void;
}

const CursorContext = createContext<CursorContextType | undefined>(undefined);

export const CursorProvider = ({ children }: { children: ReactNode }) => {
  const [variant, setVariant] = useState<CursorVariant>('default');
  // * NEW: Add state for the cursor's z-index
  const [zIndex, setZIndex] = useState(9900); // =-= Default high z-index

  const stableSetVariant = useCallback((newVariant: CursorVariant) => {
    setVariant(newVariant);
  }, []);

  // * NEW: Memoize the z-index setter function
  const stableSetZIndex = useCallback((newZIndex: number) => {
    setZIndex(newZIndex);
  }, []);

  // =-= Provide all values to the context
  const value = { variant, setVariant: stableSetVariant, zIndex, setZIndex: stableSetZIndex };

  return (
    <CursorContext.Provider value={value}>
      {children}
    </CursorContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCursor = () => {
  const context = useContext(CursorContext);
  if (!context) {
    throw new Error('useCursor must be used within a CursorProvider');
  }
  return context;
};