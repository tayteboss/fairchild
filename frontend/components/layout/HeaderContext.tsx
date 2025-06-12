import { createContext, useContext, useState, ReactNode } from "react";

type HeaderTextType = {
  logo: string;
  tagline: string;
  type?: { name: string }[];
  year?: string;
};

type HeaderContextType = {
  headerText: HeaderTextType;
  setHeaderText: (text: HeaderTextType) => void;
  isHovering: boolean;
  setIsHovering: (isHovering: boolean) => void;
  isProjectView: boolean;
  setIsProjectView: (isProjectView: boolean) => void;
};

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export const HeaderProvider = ({ children }: { children: ReactNode }) => {
  const [headerText, setHeaderText] = useState<HeaderTextType>({
    logo: "Fairchild",
    tagline: "",
  });
  const [isHovering, setIsHovering] = useState(false);
  const [isProjectView, setIsProjectView] = useState(false);

  return (
    <HeaderContext.Provider
      value={{
        headerText,
        setHeaderText,
        isHovering,
        setIsHovering,
        isProjectView,
        setIsProjectView,
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
