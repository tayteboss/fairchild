import styled from "styled-components";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { ReactNode, useState } from "react";
import { ReactLenis, useLenis } from "@studio-freight/react-lenis";
import { SiteSettingsType } from "../../shared/types/types";
import { HeaderProvider } from "./HeaderContext";
import LogoSaver from "../blocks/LogoSaver";
import MobileMenu from "../blocks/MobileMenu";

const siteSettings: SiteSettingsType = require("../../json/siteSettings.json");

const Main = styled.main``;

type Props = {
  children: ReactNode;
};

const Layout = (props: Props) => {
  const { children } = props;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useLenis();

  return (
    <HeaderProvider>
      <Header
        tagline={siteSettings.tagline}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <MobileMenu isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />
      <ReactLenis root>
        <Main>{children}</Main>
      </ReactLenis>
      <LogoSaver />
    </HeaderProvider>
  );
};

export default Layout;
