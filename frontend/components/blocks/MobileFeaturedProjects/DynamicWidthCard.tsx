import React, {
  useEffect,
  useRef,
  useState,
  ReactElement,
  useCallback,
} from "react";
import styled from "styled-components";
import {
  motion,
  MotionValue,
  useMotionValue,
  useTransform,
} from "framer-motion";

const DynamicWidthWrapper = styled(motion.div)`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ACTIVE_THRESHOLD_MODIFIER = 0.1;
const SCALE_THRESHOLD = 0.5;

type DynamicWidthCardProps = {
  children: ReactElement;
  scrollY: MotionValue<number>;
  maxWidth: number;
  minWidth: number;
};

const DynamicWidthCard = ({
  children,
  scrollY,
  maxWidth,
  minWidth,
}: DynamicWidthCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [isCardActive, setIsCardActive] = useState(false);
  const width = useMotionValue(minWidth);

  useEffect(() => {
    const handleResize = () => setViewportHeight(window.innerHeight);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const updateCard = useCallback(
    (scroll: number) => {
      if (!cardRef.current || viewportHeight === 0) {
        return;
      }

      const cardTop = cardRef.current.offsetTop;
      const cardHeight = cardRef.current.offsetHeight;
      const cardCenter = cardTop + cardHeight / 2;
      const viewportCenterInScrollable = viewportHeight / 2 + scroll;
      const distanceFromCenter = Math.abs(
        cardCenter - viewportCenterInScrollable
      );

      const normalizedDistance = Math.min(
        distanceFromCenter / (viewportHeight * SCALE_THRESHOLD),
        1
      );
      const newWidth = maxWidth - normalizedDistance * (maxWidth - minWidth);
      width.set(newWidth);

      const activeThreshold = viewportHeight * ACTIVE_THRESHOLD_MODIFIER;
      setIsCardActive(distanceFromCenter < activeThreshold);
    },
    [viewportHeight, maxWidth, minWidth, width]
  );

  useEffect(() => {
    const unsubscribe = scrollY.onChange(updateCard);
    // Initial call to set width
    updateCard(scrollY.get());
    return () => unsubscribe();
  }, [scrollY, updateCard]);

  const widthVw = useTransform(width, (w) => `${w}vw`);

  return (
    <DynamicWidthWrapper ref={cardRef} style={{ width: widthVw }}>
      {React.cloneElement(children, { isOverlayActive: !isCardActive })}
    </DynamicWidthWrapper>
  );
};

export default DynamicWidthCard;
