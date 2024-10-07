import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { fetchCapsules } from '../services/capsuleService';

interface Capsule {
  id: number;
  title: string;
  description: string;
}

interface CapsuleContextType {
  capsules: Capsule[];
  loadCapsules: () => Promise<void>;
}

const CapsuleContext = createContext<CapsuleContextType | undefined>(undefined);

export const CapsuleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [capsules, setCapsules] = useState<Capsule[]>([]);

  const loadCapsules = async () => {
    const data = await fetchCapsules();
    setCapsules(data);
  };

  useEffect(() => {
    loadCapsules();
  }, []);

  return (
    <CapsuleContext.Provider value={{ capsules, loadCapsules }}>
      {children}
    </CapsuleContext.Provider>
  );
};

export const useCapsuleContext = () => {
  const context = useContext(CapsuleContext);
  if (!context) throw new Error('useCapsuleContext must be used within a CapsuleProvider');
  return context;
};
