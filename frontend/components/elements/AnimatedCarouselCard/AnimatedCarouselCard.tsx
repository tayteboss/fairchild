import styled from "styled-components";
import { ProjectType } from "../../../shared/types/types";
import {
  motion,
  useTransform,
  MotionValue,
  useMotionValue,
  useSpring,
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
  /* Performance optimizations for smooth animations */
  will-change: width;
  transform: translateZ(0);
  backface-visibility: hidden;
`;

const SCALE_THRESHOLD = 0.5;

export type CardLayout = { top: number; height: number };

type AnimatedCarouselCardProps = {
  project: ProjectType | null;
  galleryItem: any;
  scrollY: MotionValue<number>;
  viewportHeight: number;
  onImageLoad: () => void;
  isOverlayActive: boolean;
  hasScrolled: boolean;
  isSelected: boolean;
  maxWidth: number;
  minWidth: number;
  index: number;
  isMobile: boolean;
  selectedProjectRatio: {
    label: string;
    value: string;
  };
};

const AnimatedCarouselCard = ({
  project,
  galleryItem,
  scrollY,
  viewportHeight,
  onImageLoad,
  isOverlayActive,
  hasScrolled,
  isSelected,
  maxWidth,
  minWidth,
  index,
  isMobile,
  selectedProjectRatio,
}: AnimatedCarouselCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const rawWidth = useMotionValue(isSelected ? maxWidth : minWidth);
  
  // Use spring animation for smooth, natural width transitions
  // This prevents jumpiness by smoothly interpolating between values
  const width = useSpring(rawWidth, {
    stiffness: isMobile ? 100 : 150,
    damping: isMobile ? 25 : 30,
    mass: 0.5,
  });

  useEffect(() => {
    // Use requestAnimationFrame to batch DOM reads and avoid layout thrashing
    let rafId: number | null = null;
    
    const updateWidth = (scroll: number) => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        if (!cardRef.current || viewportHeight === 0) {
          rawWidth.set(isSelected ? maxWidth : minWidth);
          return;
        }

        // Use getBoundingClientRect instead of offsetTop/offsetHeight for better performance
        // This batches layout reads and is more efficient
        const rect = cardRef.current.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;
        const viewportCenter = viewportHeight / 2;

        const distanceFromCenter = Math.abs(cardCenter - viewportCenter);
        const normalizedDistance = Math.min(
          distanceFromCenter / (viewportHeight * SCALE_THRESHOLD),
          1
        );
        
        // Smooth easing function for more natural width transitions
        // Using easeOutCubic for smoother feel
        const easedDistance = 1 - Math.pow(1 - normalizedDistance, 3);
        const newWidth = maxWidth - easedDistance * (maxWidth - minWidth);
        
        // Update the raw width - spring will handle smooth interpolation
        rawWidth.set(newWidth);
      });
    };

    const unsubscribe = scrollY.onChange(updateWidth);

    const timer = setTimeout(() => updateWidth(scrollY.get()), 100);

    return () => {
      unsubscribe();
      clearTimeout(timer);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [scrollY, viewportHeight, isSelected, maxWidth, minWidth, rawWidth, isMobile]);

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
      id={`carousel-card-${index}`}
    >
      <CarouselCard
        project={project}
        gallery={galleryItem}
        onLoad={onImageLoad}
        isOverlayActive={isOverlayActive}
        hasScrolled={hasScrolled}
        isMobile={isMobile}
        selectedProjectRatio={selectedProjectRatio}
      />
    </CarouselCardWrapper>
  );
};

export default AnimatedCarouselCard;
