import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  // Retrieve capsuleId from localStorage if it exists, otherwise null
  const [capsuleId, setCapsuleIdState] = useState<number | null>(() => {
    const storedCapsuleId = localStorage.getItem('capsuleId');
    return storedCapsuleId ? Number(storedCapsuleId) : null;
  });

  // Update both local state and localStorage when capsuleId is set
  const setCapsuleId = (id: number) => {
    setCapsuleIdState(id);
    localStorage.setItem('capsuleId', String(id));  // Store in localStorage
  };

  // Cleanup localStorage when the capsuleId is null (optional)
  useEffect(() => {
    if (capsuleId === null) {
      localStorage.removeItem('capsuleId');
    }
  }, [capsuleId]);

  return (
    <CapsuleContext.Provider value={{ capsuleId, setCapsuleId }}>
      {children}
    </CapsuleContext.Provider>
  );
};
