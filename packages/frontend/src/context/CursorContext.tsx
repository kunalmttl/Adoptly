// src/context/CursorContext.tsx

import { createContext, useState, useContext, useCallback } from 'react';
import type { ReactNode } from 'react';

type CursorVariant = 'default' | 'text' | 'hover';

interface CursorContextType 
{
  variant: CursorVariant;
  setVariant: (variant: CursorVariant) => void;
}

const CursorContext = createContext<CursorContextType | undefined>(undefined);

export const CursorProvider = ({ children }: { children: ReactNode }) => 
{
  const [variant, setVariant] = useState<CursorVariant>('default');
  const stableSetVariant = useCallback((newVariant: CursorVariant) => {
    setVariant(newVariant);
  }, []); // Empty dependency array means this function is created only once.

  const value = { variant, setVariant: stableSetVariant };


  return (
    <CursorContext.Provider value={value}>
      {children}
    </CursorContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCursor = () => 
{
  const context = useContext(CursorContext);
  if (!context) {
    throw new Error('useCursor must be used within a CursorProvider');
  }
  return context;
};
