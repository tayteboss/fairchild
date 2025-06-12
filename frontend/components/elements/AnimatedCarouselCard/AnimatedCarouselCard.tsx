import styled from "styled-components";
import { ProjectType } from "../../../shared/types/types";
import {
  motion,
  useTransform,
  MotionValue,
  useMotionValue,
} from "framer-motion";
import { useEffect, useRef } from "react";
import CarouselCard from "../CarouselCard/CarouselCard";

export const CarouselCardWrapper = styled(motion.div)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin: 0 auto;
`;

const SCALE_THRESHOLD = 0.5;

export type CardLayout = { top: number; height: number };

type AnimatedCarouselCardProps = {
  project: ProjectType | null;
  galleryItem: any;
  scrollY: MotionValue<number>;
  viewportHeight: number;
  layout: CardLayout | undefined;
  onImageLoad: () => void;
  isOverlayActive: boolean;
  hasScrolled: boolean;
  isSelected: boolean;
  maxWidth: number;
  minWidth: number;
};

const AnimatedCarouselCard = ({
  project,
  galleryItem,
  scrollY,
  viewportHeight,
  layout,
  onImageLoad,
  isOverlayActive,
  hasScrolled,
  isSelected,
  maxWidth,
  minWidth,
}: AnimatedCarouselCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const width = useMotionValue(isSelected ? maxWidth : minWidth);

  useEffect(() => {
    const updateWidth = (scroll: number) => {
      if (!cardRef.current || viewportHeight === 0) {
        width.set(isSelected ? maxWidth : minWidth);
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
    };

    const unsubscribe = scrollY.onChange(updateWidth);

    const timer = setTimeout(() => updateWidth(scrollY.get()), 100);

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, [scrollY, viewportHeight, isSelected, maxWidth, minWidth, width]);

  const widthVw = useTransform(width, (w) => `${w}vw`);

  return (
    <CarouselCardWrapper
      ref={cardRef}
      className="carousel-card"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        width: widthVw,
      }}
    >
      <CarouselCard
        project={{
          ...(project as ProjectType),
          title: galleryItem.projectTitle,
          client: galleryItem.projectClient,
        }}
        gallery={galleryItem}
        onLoad={onImageLoad}
        isOverlayActive={isOverlayActive}
        hasScrolled={hasScrolled}
      />
    </CarouselCardWrapper>
  );
};

export default AnimatedCarouselCard;
