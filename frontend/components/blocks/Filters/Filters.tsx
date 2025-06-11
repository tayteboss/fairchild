import styled from "styled-components";
import pxToRem from "../../../utils/pxToRem";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useClickOutside } from "../../../hooks/useClickOutside";

const FiltersWrapper = styled(motion.div)`
  position: fixed;
  top: 50%;
  right: 50%;
  z-index: 200;
  transform: translate(50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100lvh;
  width: 100%;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--colour-bg);
    opacity: 0.8;
  }
`;

const FiltersTrigger = styled.button`
  position: fixed;
  top: 50%;
  right: 50%;
  z-index: 100;
  transform: translate(50%, -50%);
  height: ${pxToRem(12)};
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: ${pxToRem(3)};
`;

const Inner = styled.div`
  max-width: ${pxToRem(450)};
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

const Filters = () => {
  const [isOpen, setIsOpen] = useState(false);

  const ref = useRef<HTMLDivElement>(null!);
  useClickOutside(ref, () => {
    setIsOpen(false);
  });

  return (
    <>
      <FiltersTrigger onClick={() => setIsOpen(!isOpen)}>
        Filters (off)
      </FiltersTrigger>
      <AnimatePresence>
        {isOpen && (
          <FiltersWrapper
            variants={wrapperVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <Inner ref={ref}></Inner>
          </FiltersWrapper>
        )}
      </AnimatePresence>
    </>
  );
};

export default Filters;
