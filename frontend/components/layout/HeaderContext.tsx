import { createContext, useContext, useState, ReactNode } from "react";

type HeaderContextType = {
  headerText: {
    logo: string;
    tagline: string;
  };
  setHeaderText: (text: { logo: string; tagline: string }) => void;
  isHovering: boolean;
  setIsHovering: (isHovering: boolean) => void;
};

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export const HeaderProvider = ({ children }: { children: ReactNode }) => {
  const [headerText, setHeaderText] = useState({
    logo: "Fairchild",
    tagline: "",
  });
  const [isHovering, setIsHovering] = useState(false);

  return (
    <HeaderContext.Provider
      value={{
        headerText,
        setHeaderText,
        isHovering,
        setIsHovering,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeader = () => {
  const context = useContext(HeaderContext);
  if (context === undefined) {
    throw new Error("useHeader must be used within a HeaderProvider");
  }
  return context;
};
