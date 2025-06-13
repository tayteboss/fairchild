import styled from "styled-components";
import { ProjectType } from "../../../shared/types/types";
import {
  motion,
  MotionValue,
  useMotionValue,
  AnimatePresence,
} from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import { useHeader } from "../../layout/HeaderContext";
import Lenis from "@studio-freight/lenis";
import AnimatedCarouselCard, {
  CardLayout,
} from "../../elements/AnimatedCarouselCard/AnimatedCarouselCard";
import useViewportWidth from "../../../hooks/useViewportWidth";
import pxToRem from "../../../utils/pxToRem";

const CarouselWrapper = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 50;
  overflow: hidden;
  cursor: pointer;
`;

const Backdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--colour-bg);
  opacity: 0.8;
`;

const CloseTrigger = styled.div`
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  z-index: 100;
  padding: ${pxToRem(8)};
  color: var(--colour-white);
  mix-blend-mode: difference;
`;

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
`;

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  width: 60vw;
  margin: 0 auto;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    width: 100%;
  }
`;

const wrapperVariants = {
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
      delay: 0.5,
    },
  },
};

type Props = {
  project: ProjectType | null;
  onClose: () => void;
  animationPhase: "idle" | "fade" | "center" | "carousel";
  initialGalleryIndex: number | null;
  allProjects: ProjectType[];
  isOpen: boolean;
};

const ProjectGalleryCarousel = (props: Props) => {
  const {
    project,
    onClose,
    animationPhase,
    initialGalleryIndex,
    allProjects,
    isOpen,
  } = props;
  const [cardLayouts, setCardLayouts] = useState<CardLayout[]>([]);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [isOverlayActive, setIsOverlayActive] = useState(true);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  const { setHeaderText, setIsHovering, setIsProjectView } = useHeader();

  const viewport = useViewportWidth();
  const isMobile = viewport === "mobile" || viewport === "tabletPortrait";

  const loadedImageCounter = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const didInitialScroll = useRef(false);

  const scrollY = useMotionValue(0);

  const MAX_WIDTH = 50;
  const MIN_WIDTH = 30;
  const MAX_WIDTH_MOBILE = 100;
  const MIN_WIDTH_MOBILE = 50;

  const allGalleryItems = allProjects.reduce((acc, project) => {
    if (project.gallery) {
      return [
        ...acc,
        ...project.gallery.map((item) => ({
          ...item,
          projectTitle: project.title,
          projectClient: project.client,
          projectThumbnailColor: project.thumbnailColor,
        })),
      ];
    }
    return acc;
  }, [] as Array<any>);

  const findSelectedImageIndex = useCallback(() => {
    if (!project || initialGalleryIndex === null) return null;

    let currentIndex = 0;
    for (const p of allProjects) {
      if (p.gallery) {
        if (p === project) {
          return currentIndex + initialGalleryIndex;
        }
        currentIndex += p.gallery.length;
      }
    }
    return null;
  }, [allProjects, project, initialGalleryIndex]);

  const recalculateLayout = useCallback(() => {
    if (
      containerRef.current &&
      innerRef.current &&
      allGalleryItems.length > 0
    ) {
      const cards =
        containerRef.current.querySelectorAll<HTMLElement>(".carousel-card");
      if (cards.length === 0) return;

      const paddingTop = containerRef.current.clientHeight / 2;
      const selectedIndex = findSelectedImageIndex();
      const vw = window.innerWidth / 100;
      const style = window.getComputedStyle(cards[0]);
      const marginTop = parseFloat(style.marginTop);
      const marginBottom = parseFloat(style.marginBottom);

      let accumulatedTop = paddingTop;
      const newLayouts: CardLayout[] = Array.from(cards).map((_, index) => {
        const isActive = index === selectedIndex;
        const cardWidthVw =
          selectedIndex !== null
            ? isActive
              ? MAX_WIDTH
              : MIN_WIDTH
            : MIN_WIDTH;
        const cardWidthPx = cardWidthVw * vw;
        const cardHeightPx = (cardWidthPx * 9) / 16;

        const top = accumulatedTop;
        accumulatedTop += cardHeightPx + marginTop + marginBottom;
        return { top, height: cardHeightPx };
      });

      setCardLayouts(newLayouts);
    }
  }, [findSelectedImageIndex, allGalleryItems.length]);

  const handleImageLoad = useCallback(() => {
    loadedImageCounter.current += 1;
    if (loadedImageCounter.current >= allGalleryItems.length) {
      setTimeout(() => {
        setAllImagesLoaded(true);
      }, 100);
    }
  }, [allGalleryItems.length]);

  const handleClose = () => {
    setHeaderText({
      logo: "Fairchild",
      tagline: "",
      year: "",
    });
    setIsHovering(false);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      setIsProjectView(true);
      setIsOverlayActive(true);
      loadedImageCounter.current = 0;
      setAllImagesLoaded(false);
      didInitialScroll.current = false;
    } else {
      setIsProjectView(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (allImagesLoaded) {
      recalculateLayout();
    }
  }, [allImagesLoaded, recalculateLayout]);

  useEffect(() => {
    if (
      lenisRef.current &&
      containerRef.current &&
      cardLayouts.length > 0 &&
      !didInitialScroll.current
    ) {
      setTimeout(() => {
        if (!containerRef.current || !lenisRef.current) return;
        const container = containerRef.current;
        const selectedIndex = findSelectedImageIndex();

        if (selectedIndex !== null) {
          didInitialScroll.current = true;
          const targetLayout = cardLayouts[selectedIndex];

          if (targetLayout) {
            const offset =
              targetLayout.top -
              container.clientHeight / 2 +
              targetLayout.height / 2;
            const scrollDuration = 2;
            lenisRef.current.scrollTo(offset, {
              duration: scrollDuration,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            });
            const timeoutId = setTimeout(() => {
              setHasScrolled(true);
            }, 2000);
            return () => clearTimeout(timeoutId);
          }
        }
      }, 100);
    }
  }, [cardLayouts, findSelectedImageIndex]);

  useEffect(() => {
    if (project && animationPhase === "carousel") {
      const container = containerRef.current;
      const innerEl = innerRef.current;
      if (!container || !innerEl) return;

      setHeaderText({
        logo: project.client || "",
        tagline: project.title || "",
        year: isMobile ? "" : project.year || "",
      });
      setIsHovering(true);

      const handleRecalculate = () => {
        setViewportHeight(window.innerHeight);
        recalculateLayout();
      };
      handleRecalculate();

      const ro = new ResizeObserver(handleRecalculate);
      ro.observe(innerEl);
      window.addEventListener("resize", handleRecalculate);
      const timeoutId = setTimeout(handleRecalculate, 500);

      const lenis = new Lenis({
        wrapper: container,
        content: container,
        smoothWheel: true,
        touchMultiplier: 1,
        wheelMultiplier: 0.5,
      });
      lenisRef.current = lenis;
      lenis.on("scroll", ({ scroll }: { scroll: number }) =>
        scrollY.set(scroll)
      );

      const overlayTimeoutId = setTimeout(() => {
        setIsOverlayActive(false);
      }, 1000);

      const raf = (time: number) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);

      return () => {
        lenis.destroy();
        lenisRef.current = null;
        ro.disconnect();
        window.removeEventListener("resize", handleRecalculate);
        clearTimeout(timeoutId);
        clearTimeout(overlayTimeoutId);
      };
    }
  }, [
    project,
    animationPhase,
    recalculateLayout,
    scrollY,
    setHeaderText,
    setIsHovering,
  ]);

  useEffect(() => {
    if (project && hasScrolled) {
      setHeaderText({
        logo: project.client || "",
        tagline: project.title || "",
        year: isMobile ? "" : project.year || "",
      });
      setIsHovering(true);
    }
  }, [hasScrolled]);

  return (
    <AnimatePresence>
      {isOpen && (
        <CarouselWrapper
          variants={wrapperVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={handleClose}
        >
          <Backdrop />
          <CloseTrigger onClick={handleClose}>Close</CloseTrigger>
          <CarouselContainer ref={containerRef}>
            <Inner
              ref={innerRef}
              style={{
                paddingTop: `${viewportHeight / 2}px`,
                paddingBottom: `${viewportHeight / 2}px`,
              }}
            >
              {allGalleryItems.map((galleryItem, index) => (
                <AnimatedCarouselCard
                  key={`carousel-${index}`}
                  project={project}
                  galleryItem={galleryItem}
                  scrollY={scrollY}
                  viewportHeight={viewportHeight}
                  onImageLoad={handleImageLoad}
                  isOverlayActive={isOverlayActive}
                  hasScrolled={hasScrolled}
                  isSelected={index === findSelectedImageIndex()}
                  maxWidth={isMobile ? MAX_WIDTH_MOBILE : MAX_WIDTH}
                  minWidth={isMobile ? MIN_WIDTH_MOBILE : MIN_WIDTH}
                />
              ))}
            </Inner>
          </CarouselContainer>
        </CarouselWrapper>
      )}
    </AnimatePresence>
  );
};

export default ProjectGalleryCarousel;
