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
  grid-column: span 1;
  position: relative;
  height: ${pxToRem(12)};
  display: flex;
  align-items: center;

  a {
    pointer-events: all;
  }
`;

const TaglineWrapper = styled(motion.div)`
  grid-column: span 5;
  position: relative;
  height: ${pxToRem(12)};
  display: flex;
  align-items: center;
`;

const NavigationWrapper = styled(motion.div)`
  grid-column: span 6;
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
  position: absolute;
  width: 100%;
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

  const [initialY, setInitialY] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);
  const [previousPage, setPreviousPage] = useState<string | null>(null);
  const [centerPosition, setCenterPosition] = useState(0);

  const { headerText, isHovering, setHeaderText, setIsHovering } = useHeader();
  const { y } = useMousePosition();
  const router = useRouter();

  const activeLink = useActiveLink();

  const isHomePage = router.pathname === "/";
  const isInformationPage = router.pathname === "/information";

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

  useEffect(() => {
    if (isHomePage) {
      setInitialY(centerPosition);
    }
  }, [isHomePage, centerPosition]);

  useEffect(() => {
    if (y !== null && !hasMoved) {
      setHasMoved(true);
      setTimeout(() => {
        setShouldShow(true);
      }, 200);
    }
  }, [y, hasMoved]);

  // Track page changes
  useEffect(() => {
    setPreviousPage(router.pathname);
  }, [router.pathname]);

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

  const getInitialY = () => {
    if (!isHomePage) {
      return centerPosition;
    }
    if (previousPage && !isHomePage) {
      return centerPosition;
    }
    return initialY;
  };

  const getAnimateY = () => {
    if (!isHomePage) {
      return centerPosition;
    }
    if (isHomePage) {
      return y ? y - 12 : initialY;
    }
    return 0;
  };

  return (
    <HeaderWrapper
      className="header"
      initial={{ opacity: 0, y: getInitialY() }}
      animate={{
        opacity: shouldShow ? 1 : 0,
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
          <NavigationWrapper>
            {isHovering ? (
              <Text>
                {headerText.type?.[0]?.name} — {headerText.year}
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
        </LayoutGrid>
      </LayoutWrapper>
    </HeaderWrapper>
  );
};

export default Header;
