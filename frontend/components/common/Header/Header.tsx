import styled from "styled-components";
import LayoutWrapper from "../../layout/LayoutWrapper";
import LayoutGrid from "../../layout/LayoutGrid";
import Link from "next/link";
import useActiveLink from "../../../hooks/useActiveLink";
import pxToRem from "../../../utils/pxToRem";
import { SiteSettingsType } from "../../../shared/types/types";
import { motion, AnimatePresence } from "framer-motion";
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
`;

const LogoWrapper = styled(motion.div)`
  grid-column: span 1;
  position: relative;
  height: 1.5em;

  a {
    pointer-events: all;
  }
`;

const TaglineWrapper = styled(motion.div)`
  grid-column: span 5;
  position: relative;
  height: 1.5em;
`;

const NavigationWrapper = styled(motion.div)`
  grid-column: span 6;
  text-align: right;
  display: flex;
  justify-content: flex-end;

  span {
    white-space: pre;
    color: var(--colour-fg);
    cursor: default;
  }
`;

const Text = styled(motion.div)`
  color: var(--colour-fg);
  position: absolute;
  width: 100%;
`;

const LinkText = styled.div<{ $isActive?: boolean }>`
  text-decoration: ${({ $isActive }) => ($isActive ? "underline" : "none")};
  color: var(--colour-fg);
  pointer-events: all;

  &:hover {
    text-decoration: underline;
  }
`;

type Props = {
  tagline: SiteSettingsType["tagline"];
};

const springTransition = {
  type: "spring",
  stiffness: 300,
  damping: 20,
  mass: 0.5,
};

const textVariants = {
  initial: {
    y: 0,
    opacity: 1,
  },
  exit: {
    y: -25,
    opacity: 0,
  },
  enter: {
    y: 25,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
  },
};

const introVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const Header = (props: Props) => {
  const { tagline } = props;

  const [initialY, setInitialY] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  const { headerText, isHovering, setHeaderText, setIsHovering } = useHeader();
  const { y } = useMousePosition();
  const router = useRouter();

  const activeLink = useActiveLink();

  const isHomePage = router.pathname === "/";

  useEffect(() => {
    if (isHomePage) {
      setInitialY(window.innerHeight / 2 - 12);
    }
  }, [isHomePage]);

  useEffect(() => {
    if (y !== null && !hasMoved) {
      setHasMoved(true);
      setTimeout(() => {
        setShouldShow(true);
      }, 200);
    }
  }, [y, hasMoved]);

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

  const itemInitialState = {
    y: initialY,
  };

  const itemAnimateState = {
    y: isHomePage ? (y ? y - 12 : initialY) : 0,
  };

  const itemTransitionConfig = {
    y: { ...springTransition },
  };

  return (
    <AnimatePresence>
      {hasMoved && (
        <HeaderWrapper
          className="header"
          initial={{ opacity: 0 }}
          animate={{ opacity: shouldShow ? 1 : 0, ...itemAnimateState }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <LayoutWrapper>
            <LayoutGrid>
              <LogoWrapper>
                <AnimatePresence mode="wait">
                  <Text
                    key={isHovering ? headerText.logo : "default"}
                    variants={textVariants}
                    initial="enter"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link href="/">
                      {isHovering ? headerText.logo : "Fairchild"}
                    </Link>
                  </Text>
                </AnimatePresence>
              </LogoWrapper>
              <TaglineWrapper>
                <AnimatePresence mode="wait">
                  <Text
                    key={isHovering ? headerText.tagline : "default"}
                    variants={textVariants}
                    initial="enter"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {isHovering ? headerText.tagline : tagline || ""}
                  </Text>
                </AnimatePresence>
              </TaglineWrapper>
              <NavigationWrapper>
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
              </NavigationWrapper>
            </LayoutGrid>
          </LayoutWrapper>
        </HeaderWrapper>
      )}
    </AnimatePresence>
  );
};

export default Header;
