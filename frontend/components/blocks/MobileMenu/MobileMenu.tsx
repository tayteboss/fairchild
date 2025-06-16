import Link from "next/link";
import styled from "styled-components";
import useActiveLink from "../../../hooks/useActiveLink";
import { AnimatePresence, motion } from "framer-motion";
import pxToRem from "../../../utils/pxToRem";
import { useRef } from "react";
import { useClickOutside } from "../../../hooks/useClickOutside";

const MobileMenuWrapper = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100lvh;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Inner = styled.div`
  display: flex;
  gap: ${pxToRem(8)};
`;

const LinkText = styled.div<{ $isActive?: boolean }>`
  text-decoration: ${({ $isActive }) => ($isActive ? "underline" : "none")};
  color: var(--colour-white);
  pointer-events: all;

  &:hover {
    text-decoration: underline;
  }
`;

const wrapperVariants = {
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const MobileMenu = (props: Props) => {
  const { isOpen, setIsOpen } = props;

  const activeLink = useActiveLink();

  const ref = useRef<HTMLDivElement>(null!);
  useClickOutside(ref, () => {
    setIsOpen(false);
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <MobileMenuWrapper
          variants={wrapperVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <Inner ref={ref} onClick={() => setIsOpen(false)}>
            <Link href="/projects">
              <LinkText $isActive={activeLink === "Projects"}>
                Projects
              </LinkText>
            </Link>
            <span> / </span>
            <Link href="/gallery">
              <LinkText $isActive={activeLink === "Gallery"}>Gallery</LinkText>
            </Link>
            <span> / </span>
            <Link href="/information">
              <LinkText $isActive={activeLink === "Information"}>
                Information
              </LinkText>
            </Link>
          </Inner>
        </MobileMenuWrapper>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
