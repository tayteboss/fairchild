import styled from "styled-components";
import { ProjectType } from "../../../shared/types/types";
import {
  motion,
  useTransform,
  MotionValue,
  useMotionValue,
  AnimatePresence,
} from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import CarouselCard from "../../elements/CarouselCard/CarouselCard";
import { useHeader } from "../../layout/HeaderContext";
import Lenis from "@studio-freight/lenis";
import { useInView } from "react-intersection-observer";

const CarouselWrapper = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 50;
  overflow: hidden;
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
  width: 50vw;
  margin: 0 auto;
`;

const CarouselCardWrapper = styled(motion.div)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin: 0 auto;
`;

const CloseButton = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: var(--color-white);
  font-size: 16px;
  cursor: pointer;
  z-index: 101;
  padding: 10px;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.7;
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

const MAX_WIDTH = 50;
const MIN_WIDTH = 25;
const SCALE_THRESHOLD = 0.5;

type CardLayout = { top: number; height: number };

type AnimatedCarouselCardProps = {
  project: ProjectType | null;
  galleryItem: any;
  scrollY: MotionValue<number>;
  viewportHeight: number;
  layout: CardLayout | undefined;
  onImageLoad: () => void;
  isOverlayActive: boolean;
};

const AnimatedCarouselCard = ({
  project,
  galleryItem,
  scrollY,
  viewportHeight,
  layout,
  onImageLoad,
  isOverlayActive,
}: AnimatedCarouselCardProps) => {
  const width = useMotionValue(MIN_WIDTH);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  useEffect(() => {
    const updateWidth = (scroll: number) => {
      if (!layout || viewportHeight === 0) {
        width.set(MIN_WIDTH);
        return;
      }

      const cardCenter = layout.top + layout.height / 2;
      const viewportCenterInScrollable = viewportHeight / 2 + scroll;

      const distanceFromCenter = Math.abs(
        cardCenter - viewportCenterInScrollable
      );
      const normalizedDistance = Math.min(
        distanceFromCenter / (viewportHeight * SCALE_THRESHOLD),
        1
      );
      const newWidth = MAX_WIDTH - normalizedDistance * (MAX_WIDTH - MIN_WIDTH);
      width.set(newWidth);
    };

    const unsubscribe = scrollY.onChange(updateWidth);
    updateWidth(scrollY.get());

    return () => unsubscribe();
  }, [layout, scrollY, viewportHeight, width]);

  const widthVw = useTransform(width, (w) => `${w}vw`);

  return (
    <CarouselCardWrapper
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
      ref={ref}
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
      />
    </CarouselCardWrapper>
  );
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
  const { setHeaderText, setIsHovering, setIsProjectView } = useHeader();
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const didInitialScroll = useRef(false);
  const [cardLayouts, setCardLayouts] = useState<CardLayout[]>([]);
  const [viewportHeight, setViewportHeight] = useState(0);
  const scrollY = useMotionValue(0);
  const [isOverlayActive, setIsOverlayActive] = useState(true);
  const loadedImageCounter = useRef(0);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);

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
    if (containerRef.current) {
      const cards =
        containerRef.current.querySelectorAll<HTMLElement>(".carousel-card");
      const layouts = Array.from(cards).map((el) => ({
        top: el.offsetTop,
        height: el.clientHeight,
      }));
      setCardLayouts(layouts);
    }
  }, []);

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
          const cards = container.querySelectorAll(".carousel-card");
          if (cards[selectedIndex]) {
            const targetCard = cards[selectedIndex] as HTMLElement;
            const offset =
              targetCard.offsetTop -
              container.clientHeight / 2 +
              targetCard.clientHeight / 2;
            const scrollDuration = 2;
            lenisRef.current.scrollTo(offset, {
              duration: scrollDuration,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            });
          }
        }
      }, 0);
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

  return (
    <AnimatePresence>
      {isOpen && (
        <CarouselWrapper
          variants={wrapperVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <Backdrop />
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
                  layout={cardLayouts[index]}
                  onImageLoad={handleImageLoad}
                  isOverlayActive={isOverlayActive}
                />
              ))}
            </Inner>
          </CarouselContainer>
          <CloseButton onClick={handleClose}>Close</CloseButton>
        </CarouselWrapper>
      )}
    </AnimatePresence>
  );
};

export default ProjectGalleryCarousel;
