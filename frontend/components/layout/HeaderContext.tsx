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
  projectType: string;
  setProjectType: (projectType: string) => void;
  projectStyles: string;
  setProjectStyles: (projectStyles: string) => void;
  projectCredits: any[];
  setProjectCredits: (projectCredits: any[]) => void;
};

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export const HeaderProvider = ({ children }: { children: ReactNode }) => {
  const [headerText, setHeaderText] = useState<HeaderTextType>({
    logo: "Fairchild",
    tagline: "",
  });
  const [isHovering, setIsHovering] = useState(false);
  const [isProjectView, setIsProjectView] = useState(false);
  const [projectType, setProjectType] = useState("");
  const [projectStyles, setProjectStyles] = useState("");
  const [projectCredits, setProjectCredits] = useState([]);

  return (
    <HeaderContext.Provider
      value={{
        headerText,
        setHeaderText,
        isHovering,
        setIsHovering,
        isProjectView,
        setIsProjectView,
        projectType,
        setProjectType,
        projectStyles,
        setProjectStyles,
        projectCredits,
        setProjectCredits,
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
