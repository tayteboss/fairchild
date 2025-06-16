import styled from "styled-components";
import LayoutWrapper from "../../layout/LayoutWrapper";
import LayoutGrid from "../../layout/LayoutGrid";
import Link from "next/link";
import useActiveLink from "../../../hooks/useActiveLink";
import pxToRem from "../../../utils/pxToRem";
import { SiteSettingsType } from "../../../shared/types/types";
import { motion } from "framer-motion";
import { useMousePosition } from "../../../hooks/useMousePosition";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useHeader } from "../../layout/HeaderContext";
import { useMouseMovement } from "../../../hooks/useMouseMovement";

const HeaderWrapper = styled(motion.header)<{ $isProjectsPage?: boolean }>`
  padding: ${pxToRem(8)} 0;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  will-change: transform;
  pointer-events: none;
  mix-blend-mode: difference;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    top: ${({ $isProjectsPage }) => ($isProjectsPage ? "0" : "50dvh")};
  }
`;

const LogoWrapper = styled(motion.div)`
  grid-column: 1 / 2;
  position: relative;
  height: ${pxToRem(12)};
  display: flex;
  align-items: center;

  a {
    pointer-events: all;
    color: var(--colour-white);
  }
`;

const TaglineWrapper = styled(motion.div)`
  grid-column: 2 / 5;
  display: flex;
  align-items: center;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    display: none;
  }
`;

const ProjectYearWrapper = styled(motion.div)`
  grid-column: 12 / -1;
  text-align: right;
`;

const NavigationWrapper = styled(motion.div)`
  grid-column: 10 / -1;
  text-align: right;
  display: flex;
  justify-content: flex-end;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    display: none;
  }

  span {
    white-space: pre;
    color: var(--colour-white);
    cursor: default;
  }
`;

const MenuTrigger = styled.button`
  display: none;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    grid-column: -2 / -1;
    text-align: right;
    pointer-events: all;
    display: block;
  }
`;

const Text = styled.div`
  color: var(--colour-white);
  width: 100%;
  white-space: nowrap;

  &:hover {
    text-decoration: underline;
  }
`;

const LinkText = styled.div<{ $isActive?: boolean }>`
  text-decoration: ${({ $isActive }) => ($isActive ? "underline" : "none")};
  color: var(--colour-white);
  pointer-events: all;

  &:hover {
    text-decoration: underline;
  }
`;

type Props = {
  tagline: SiteSettingsType["tagline"];
  setIsMobileMenuOpen: (isOpen: boolean) => void;
};

const Header = (props: Props) => {
  const { tagline, setIsMobileMenuOpen } = props;

  const [centerPosition, setCenterPosition] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const {
    headerText,
    isHovering,
    isProjectView,
    projectType,
    projectStyles,
    projectCredits,
    setHeaderText,
    setIsHovering,
  } = useHeader();
  const { y } = useMousePosition();
  const router = useRouter();
  const activeLink = useActiveLink();

  const { hasMoved } = useMouseMovement({
    initialDelay: 2000,
    movementThreshold: 5,
    throttleMs: 100,
  });

  const isHomePage = router.pathname === "/";
  const isInformationPage = router.pathname === "/information";
  const isGalleryPage = router.pathname === "/gallery";
  const isProjectsPage = router.pathname === "/projects";

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Set center position on mount and window resize
  useEffect(() => {
    const updateCenterPosition = () => {
      setCenterPosition(window.innerHeight / 2 - 12);
    };

    updateCenterPosition();
    window.addEventListener("resize", updateCenterPosition);

    return () => {
      window.removeEventListener("resize", updateCenterPosition);
    };
  }, []);

  // Reset header text when navigating away from home page
  useEffect(() => {
    if (!isHomePage) {
      setHeaderText({
        logo: "Fairchild",
        tagline: tagline || "",
      });
      setIsHovering(false);
    }
  }, [isHomePage, setHeaderText, setIsHovering, tagline]);

  const getAnimateY = () => {
    if (isProjectsPage) {
      return 0;
    }

    if (isHomePage && !isMobile) {
      return y ? y - 12 : centerPosition;
    }

    return centerPosition;
  };

  const getInitialY = () => {
    if (isMobile) {
      if (isProjectsPage) {
        return 0;
      }
      return "-50%";
    }
    return centerPosition;
  };

  return (
    <HeaderWrapper
      $isProjectsPage={isProjectsPage}
      className="header"
      initial={{ opacity: 0, y: getInitialY() }}
      animate={{
        opacity: hasMoved ? 1 : 0,
        y: isMobile ? (isProjectsPage ? 0 : "-50%") : getAnimateY(),
      }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1],
        y: {
          type: "spring",
          stiffness: 300,
          damping: 20,
          mass: 0.5,
        },
      }}
    >
      <LayoutWrapper>
        <LayoutGrid>
          <LogoWrapper>
            <Text>
              {isHovering ? headerText.logo : <Link href="/">Fairchild</Link>}
            </Text>
          </LogoWrapper>
          <TaglineWrapper>
            <Text>{isHovering ? headerText.tagline : tagline || ""}</Text>
          </TaglineWrapper>
          {isProjectView ? (
            <>
              <ProjectYearWrapper>
                <Text>{headerText.year || ""}</Text>
              </ProjectYearWrapper>
            </>
          ) : (
            <>
              <NavigationWrapper>
                {isHovering && headerText.type && headerText.year ? (
                  <Text>
                    {headerText.type?.[0]?.name || ""} — {headerText.year || ""}
                  </Text>
                ) : (
                  <>
                    <Link href="/projects">
                      <LinkText $isActive={activeLink === "Projects"}>
                        Projects
                      </LinkText>
                    </Link>
                    <span>, </span>
                    <Link href="/gallery">
                      <LinkText $isActive={activeLink === "Gallery"}>
                        Gallery
                      </LinkText>
                    </Link>
                    <span>, </span>
                    <Link href="/information">
                      <LinkText $isActive={activeLink === "Information"}>
                        Information
                      </LinkText>
                    </Link>
                  </>
                )}
              </NavigationWrapper>
              <MenuTrigger onClick={() => setIsMobileMenuOpen(true)}>
                Menu
              </MenuTrigger>
            </>
          )}
        </LayoutGrid>
      </LayoutWrapper>
    </HeaderWrapper>
  );
};

export default Header;
