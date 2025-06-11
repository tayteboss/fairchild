import styled from "styled-components";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { ReactNode } from "react";
import { ReactLenis, useLenis } from "@studio-freight/react-lenis";
import { SiteSettingsType } from "../../shared/types/types";
import { HeaderProvider } from "./HeaderContext";
import LogoSaver from "../blocks/LogoSaver";

const siteSettings: SiteSettingsType = require("../../json/siteSettings.json");

const Main = styled.main``;

type Props = {
  children: ReactNode;
};

const Layout = (props: Props) => {
  const { children } = props;

  useLenis();

  return (
    <HeaderProvider>
      <Header tagline={siteSettings.tagline} />
      <ReactLenis root>
        <Main>{children}</Main>
      </ReactLenis>
      <LogoSaver />
    </HeaderProvider>
  );
};

export default Layout;
