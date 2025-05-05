import React, { createContext, ReactNode, useContext, useState } from "react";

interface ViewModeContextType {
  isFullView: boolean;
  toggleFullView: () => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(
  undefined
);

export const ViewModeProvider: React.FC<{
  children: ReactNode;
  initialSection: string;
}> = ({ children, initialSection }) => {
  const [isFullView, setIsFullView] = useState(false);
  const [activeSection, setActiveSection] = useState(initialSection);

  const toggleFullView = () => {
    setIsFullView((prev) => !prev);
  };

  return (
    <ViewModeContext.Provider
      value={{
        isFullView,
        toggleFullView,
        activeSection,
        setActiveSection,
      }}
    >
      {children}
    </ViewModeContext.Provider>
  );
};

export const useViewMode = (): ViewModeContextType => {
  const context = useContext(ViewModeContext);
  if (context === undefined) {
    throw new Error("useViewMode must be used within a ViewModeProvider");
  }
  return context;
};
