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

const HeaderWrapper = styled(motion.header)`
  padding: ${pxToRem(8)} 0;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  will-change: transform;
  pointer-events: none;
  mix-blend-mode: difference;
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

  span {
    white-space: pre;
    color: var(--colour-white);
    cursor: default;
  }
`;

const Text = styled.div`
  color: var(--colour-white);
  width: 100%;

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
};

const Header = (props: Props) => {
  const { tagline } = props;

  const [centerPosition, setCenterPosition] = useState(0);

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

    if (isHomePage) {
      return y ? y - 12 : centerPosition;
    }

    return centerPosition;
  };

  return (
    <HeaderWrapper
      className="header"
      initial={{ opacity: 0, y: centerPosition }}
      animate={{
        opacity: hasMoved ? 1 : 0,
        y: getAnimateY(),
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
              <Link href="/">{isHovering ? headerText.logo : "Fairchild"}</Link>
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
            <NavigationWrapper>
              {isHovering && headerText.type && headerText.year ? (
                <Text>
                  {headerText.type?.[0]?.name || ""} — {headerText.year || ""}
                </Text>
              ) : (
                <>
                  <Link href="/gallery">
                    <LinkText $isActive={activeLink === "/gallery"}>
                      Gallery
                    </LinkText>
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
                </>
              )}
            </NavigationWrapper>
          )}
        </LayoutGrid>
      </LayoutWrapper>
    </HeaderWrapper>
  );
};

export default Header;
