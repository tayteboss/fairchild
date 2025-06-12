import styled from "styled-components";
import pxToRem from "../../../utils/pxToRem";
import { AnimatePresence, motion } from "framer-motion";
import { useMouseMovement } from "../../../hooks/useMouseMovement";
import { useRef } from "react";
import { useClickOutside } from "../../../hooks/useClickOutside";
import ProjectFilter from "../../elements/ProjectFilter";

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
    opacity: 0.9;
  }
`;

const FiltersTrigger = styled.button<{ $isActive: boolean }>`
  position: fixed;
  top: 50%;
  right: 50%;
  z-index: 25;
  transform: translate(50%, -50%);
  height: ${pxToRem(12)};
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: ${pxToRem(3)};
  opacity: ${({ $isActive }) => ($isActive ? 1 : 0)};
  white-space: pre;

  transition: all var(--transition-speed-default) var(--transition-ease);

  &:hover {
    span {
      text-decoration: underline;
    }
  }
`;

const Inner = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  width: ${pxToRem(450)};
  display: flex;
  flex-direction: column;
  gap: ${pxToRem(64)};
  margin-bottom: ${pxToRem(64)};
`;

const CloseTrigger = styled.button`
  text-align: center;
  opacity: 0.5;

  transition: all var(--transition-speed-default) var(--transition-ease);

  &:hover {
    opacity: 1;
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
  filtersAreOn: boolean;
  projectTypes: { name: string }[];
  projectStyles: { name: string }[];
  selectedTypes: string[];
  setSelectedTypes: (types: string[]) => void;
  selectedStyles: string[];
  setSelectedStyles: (styles: string[]) => void;
};

const ProjectFilters = (props: Props) => {
  const {
    isOpen,
    setIsOpen,
    filtersAreOn,
    projectTypes,
    projectStyles,
    selectedTypes,
    setSelectedTypes,
    selectedStyles,
    setSelectedStyles,
  } = props;

  const ref = useRef<HTMLDivElement>(null!);

  useClickOutside(ref, () => {
    setIsOpen(false);
  });

  const { hasMoved } = useMouseMovement({
    initialDelay: 2000,
    movementThreshold: 5,
    throttleMs: 100,
  });

  return (
    <>
      <FiltersTrigger onClick={() => setIsOpen(!isOpen)} $isActive={hasMoved}>
        <span>Filters</span> ({filtersAreOn ? "On" : "Off"})
      </FiltersTrigger>
      <AnimatePresence>
        {isOpen && (
          <FiltersWrapper
            variants={wrapperVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <Inner ref={ref}>
              <Container>
                <ProjectFilter
                  title="Types"
                  options={projectTypes}
                  selectedOptions={selectedTypes}
                  setSelectedOptions={setSelectedTypes}
                />
                <ProjectFilter
                  title="Styles"
                  options={projectStyles}
                  selectedOptions={selectedStyles}
                  setSelectedOptions={setSelectedStyles}
                />
              </Container>
              <CloseTrigger onClick={() => setIsOpen(false)}>
                Close
              </CloseTrigger>
            </Inner>
          </FiltersWrapper>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProjectFilters;
