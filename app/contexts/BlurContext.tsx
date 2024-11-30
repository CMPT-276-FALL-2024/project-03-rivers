import React, { createContext, useState, useContext } from 'react';

type BlurContextType = {
  isBlurred: boolean;
  setIsBlurred: React.Dispatch<React.SetStateAction<boolean>>;
};

const BlurContext = createContext<BlurContextType | undefined>(undefined);

export const BlurProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isBlurred, setIsBlurred] = useState(false);

  return (
    <BlurContext.Provider value={{ isBlurred, setIsBlurred }}>
      {children}
    </BlurContext.Provider>
  );
};

export const useBlur = () => {
  const context = useContext(BlurContext);
  if (context === undefined) {
    throw new Error('useBlur must be used within a BlurProvider');
  }
  return context;
};

