import styled from "styled-components";
import pxToRem from "../../../utils/pxToRem";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useClickOutside } from "../../../hooks/useClickOutside";
import MultiRangeSlider from "./MultiRangeSlider";
import { useMouseMovement } from "../../../hooks/useMouseMovement";

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
  mix-blend-mode: difference;

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
  colorTemp: { min: number; max: number };
  setColorTemp: (colorTemp: { min: number; max: number }) => void;
  saturation: { min: number; max: number };
  setSaturation: (saturation: { min: number; max: number }) => void;
  year: { min: number; max: number };
  setYear: (year: { min: number; max: number }) => void;
  yearRange: { min: number; max: number };
  setIsDragging: (isDragging: boolean) => void;
  filtersAreOn: boolean;
};

const GalleryFilters = (props: Props) => {
  const {
    isOpen,
    setIsOpen,
    colorTemp,
    setColorTemp,
    saturation,
    setSaturation,
    year,
    setYear,
    yearRange,
    setIsDragging,
    filtersAreOn,
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
                <MultiRangeSlider
                  min={2300}
                  max={7000}
                  onChange={setColorTemp}
                  label="Color Temperature"
                  symbol="K"
                  setIsDragging={setIsDragging}
                  value={colorTemp}
                  step={100}
                />
                <MultiRangeSlider
                  min={0}
                  max={100}
                  onChange={setSaturation}
                  label="Saturation"
                  symbol="%"
                  setIsDragging={setIsDragging}
                  value={saturation}
                  step={5}
                />
                <MultiRangeSlider
                  min={yearRange.min || 0}
                  max={yearRange.max || 0}
                  onChange={setYear}
                  label="Year"
                  setIsDragging={setIsDragging}
                  value={year}
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

export default GalleryFilters;
