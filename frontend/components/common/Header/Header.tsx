import styled from "styled-components";
import LayoutWrapper from "../../layout/LayoutWrapper";
import LayoutGrid from "../../layout/LayoutGrid";
import Link from "next/link";
import useActiveLink from "../../../hooks/useActiveLink";
import pxToRem from "../../../utils/pxToRem";
import { SiteSettingsType } from "../../../shared/types/types";

const HeaderWrapper = styled.header`
  padding: ${pxToRem(8)} 0;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
`;

const LogoWrapper = styled.div`
  grid-column: span 1;
`;

const TaglineWrapper = styled.div`
  grid-column: span 5;
`;

const NavigationWrapper = styled.div`
  grid-column: span 6;
  text-align: right;
  display: flex;
  justify-content: flex-end;

  span {
    white-space: pre;
    color: var(--colour-fg);
  }
`;

const Text = styled.div`
  color: var(--colour-fg);
`;

const LinkText = styled.div<{ $isActive?: boolean }>`
  text-decoration: ${({ $isActive }) => ($isActive ? "underline" : "none")};
  color: var(--colour-fg);

  &:hover {
    text-decoration: underline;
  }
`;

type Props = {
  tagline: SiteSettingsType["tagline"];
};

const Header = (props: Props) => {
  const { tagline } = props;

  const activeLink = useActiveLink();

  return (
    <HeaderWrapper className="header">
      <LayoutWrapper>
        <LayoutGrid>
          <LogoWrapper>
            <Link href="">Fairchild</Link>
          </LogoWrapper>
          <TaglineWrapper>
            <Text>{tagline || ""}</Text>
          </TaglineWrapper>
          <NavigationWrapper>
            <Link href="/gallery">
              <LinkText $isActive={activeLink === "/gallery"}>Gallery</LinkText>
            </Link>
            <span>, </span>
            <Link href="/projects">
              <LinkText $isActive={activeLink === "/projects"}>
                Projects
              </LinkText>
            </Link>
            <span>, </span>
            <Link href="/information">
              <LinkText $isActive={activeLink === "/information"}>
                Information
              </LinkText>
            </Link>
          </NavigationWrapper>
        </LayoutGrid>
      </LayoutWrapper>
    </HeaderWrapper>
  );
};

export default Header;
