import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CapsuleContextType {
  capsuleId: number | null;
  setCapsuleId: (id: number) => void;
}

const CapsuleContext = createContext<CapsuleContextType | undefined>(undefined);

export const useCapsule = () => {
  const context = useContext(CapsuleContext);
  if (!context) {
    throw new Error('useCapsule must be used within a CapsuleProvider');
  }
  return context;
};

export const CapsuleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [capsuleId, setCapsuleId] = useState<number | null>(null);

  return (
    <CapsuleContext.Provider value={{ capsuleId, setCapsuleId }}>
      {children}
    </CapsuleContext.Provider>
  );
};
