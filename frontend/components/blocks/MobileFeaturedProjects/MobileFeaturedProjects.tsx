import styled from "styled-components";
import { ProjectType } from "../../../shared/types/types";
import {
  motion,
  useMotionValue,
  useTransform,
  MotionValue,
} from "framer-motion";
import {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useLayoutEffect,
  MutableRefObject,
} from "react";
import React from "react";
import FeaturedProjectCard from "../../elements/FeaturedProjectCard";
import { useHeader } from "../../layout/HeaderContext";
import ReactLenis, { useLenis } from "@studio-freight/react-lenis";

const MobileFeaturedProjectsWrapper = styled.div`
  display: none;
  position: relative;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    display: block;
    padding-top: 50svh;
    padding-bottom: 50svh;
  }
`;

const AnimatedContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  transform-origin: center;
  position: relative;
  z-index: 1;
`;

const CardWrapper = styled.div`
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

type Props = {
  data: ProjectType[];
};

const MAX_WIDTH_MOBILE = 100;
const MIN_WIDTH_MOBILE = 50;
const SCALE_THRESHOLD = 0.5;

// Toggle to enable/disable dynamic width scroll effect for performance testing
const ENABLE_DYNAMIC_WIDTH = false;

const MobileFeaturedProjects = (props: Props) => {
  const { data } = props;

  const [activeIndex, setActiveIndex] = useState(0);
  const [initialDelayComplete, setInitialDelayComplete] = useState(false);
  const [isInitialScrollComplete, setIsInitialScrollComplete] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(0);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lenis = useLenis();
  const { setHeaderText, setIsHovering } = useHeader();
  const scrollY = useMotionValue(0);

  const hasData = data && data.length > 0;

  // Stable no-op function for hover handlers in mobile view
  const handleHoverNoOp = () => {};

  useLenis(({ scroll }: { scroll: number }) => {
    scrollY.set(scroll);
  });

  useEffect(() => {
    setViewportHeight(window.innerHeight);
    const handleResize = () => setViewportHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, data.length * 2);
  }, [data]);

  useEffect(() => {
    if (isReady) {
      setInitialDelayComplete(true);
    }
  }, [isReady]);

  useEffect(() => {
    if (!lenis || !hasData || !wrapperRef.current || isInitialScrollComplete)
      return;

    const performCentering = () => {
      const middleIndex = Math.floor(data.length / 2);
      const targetCard = cardRefs.current[middleIndex];

      if (!targetCard) return;

      // Force initial width update for correct measurement
      // We need to simulate the scroll position check once before reading rects
      // effectively, we assume we are at some scroll position, calculate target, move there.

      // First pass
      let rect = targetCard.getBoundingClientRect();
      let currentScroll = lenis.scroll;
      const CENTER_OFFSET = -20;
      let targetScroll =
        rect.top +
        currentScroll +
        rect.height / 2 -
        (window.innerHeight / 2 + CENTER_OFFSET);

      lenis.scrollTo(targetScroll, { immediate: true });

      // Second pass (after layout update)
      requestAnimationFrame(() => {
        // Re-measure after width/height adjustments from scroll
        rect = targetCard.getBoundingClientRect();

        // Target slightly below exact center to account for browser chrome/optical center
        // "Slightly higher" observation suggests we need to push it down.
        // Adding a small offset to the target center position.
        const CENTER_OFFSET = 20;
        const targetCenter = window.innerHeight / 2 + CENTER_OFFSET;

        const deviation = rect.top + rect.height / 2 - targetCenter;

        if (Math.abs(deviation) > 2) {
          lenis.scrollTo(lenis.scroll + deviation, { immediate: true });
        }

        // Finalize
        requestAnimationFrame(() => {
          setIsInitialScrollComplete(true);
          setIsReady(true);
        });
      });
    };

    // Small delay to ensure initial render and refs are ready
    const timer = setTimeout(performCentering, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [lenis, hasData, isInitialScrollComplete, data.length]);

  useEffect(() => {
    if (!hasData) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number((entry.target as HTMLElement).dataset.index);
            if (!isNaN(index)) {
              setActiveIndex(index);
              const project = data[index % data.length];
              if (project) {
                setHeaderText({
                  logo: project.client,
                  tagline: project.title,
                  type: project.type,
                  year: project.year,
                });
                setIsHovering(true);
              }
            }
          }
        });
      },
      {
        rootMargin: "-50% 0px -50% 0px",
        threshold: 0,
      }
    );

    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => {
      observer.disconnect();
    };
  }, [data, hasData, setHeaderText, setIsHovering]);

  useEffect(() => {
    // Set initial header text
    if (hasData) {
      const project = data[0];
      setHeaderText({
        logo: project.client,
        tagline: project.title,
        type: project.type,
        year: project.year,
      });
      setIsHovering(true);
    }

    return () => {
      setIsHovering(false);
    };
  }, [hasData, data, setHeaderText, setIsHovering]);

  return (
    <MobileFeaturedProjectsWrapper ref={wrapperRef}>
      <AnimatedContainer
        initial={{ opacity: 0 }}
        animate={{
          opacity: isReady ? 1 : 0,
        }}
        transition={{
          opacity: { duration: 0.5, ease: "easeInOut" },
        }}
      >
        {hasData &&
          data.map((project, index) => (
            <ScrollControlledCard
              key={`${project.title}-${index}`}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              project={project}
              index={index}
              activeIndex={activeIndex}
              initialDelayComplete={initialDelayComplete}
              onHover={handleHoverNoOp}
              scrollY={scrollY}
              viewportHeight={viewportHeight}
              enableDynamicWidth={ENABLE_DYNAMIC_WIDTH}
            />
          ))}
      </AnimatedContainer>
    </MobileFeaturedProjectsWrapper>
  );
};

type ScrollControlledCardProps = {
  project: ProjectType;
  index: number;
  activeIndex: number;
  initialDelayComplete: boolean;
  onHover: () => void;
  scrollY: MotionValue<number>;
  viewportHeight: number;
  enableDynamicWidth: boolean;
};

const ScrollControlledCard = forwardRef<
  HTMLDivElement,
  ScrollControlledCardProps
>(
  (
    {
      project,
      index,
      activeIndex,
      initialDelayComplete,
      onHover,
      scrollY,
      viewportHeight,
      enableDynamicWidth,
    },
    ref
  ) => {
    const isCardActive = activeIndex === index;
    const localRef = useRef<HTMLDivElement | null>(null);
    const width = useMotionValue(
      enableDynamicWidth ? MIN_WIDTH_MOBILE : MAX_WIDTH_MOBILE
    );

    useEffect(() => {
      if (!enableDynamicWidth) return;

      const updateWidth = () => {
        if (!localRef.current || viewportHeight === 0) {
          return;
        }

        const rect = localRef.current.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;
        const viewportCenter = viewportHeight / 2;

        const distanceFromCenter = Math.abs(cardCenter - viewportCenter);
        const normalizedDistance = Math.min(
          distanceFromCenter / (viewportHeight * SCALE_THRESHOLD),
          1
        );
        const newWidth =
          MAX_WIDTH_MOBILE -
          normalizedDistance * (MAX_WIDTH_MOBILE - MIN_WIDTH_MOBILE);
        width.set(newWidth);
      };

      // Initial update
      updateWidth();

      const unsubscribe = scrollY.onChange(updateWidth);

      return () => {
        unsubscribe();
      };
    }, [scrollY, viewportHeight, width, enableDynamicWidth]);

    const widthVw = enableDynamicWidth
      ? useTransform(width, (w) => `${w}vw`)
      : "100vw";

    return (
      <CardWrapper
        ref={(el) => {
          localRef.current = el;
          if (typeof ref === "function") ref(el);
          else if (ref) {
            (ref as any).current = el;
          }
        }}
        data-index={index}
      >
        <FeaturedProjectCard
          {...project}
          index={index}
          isHovered={initialDelayComplete && isCardActive}
          onHoverStart={onHover}
          onHoverEnd={onHover}
          hoveredIndex={activeIndex}
          initialDelayComplete={initialDelayComplete}
          isMobile={true}
          customWidth={widthVw}
        />
      </CardWrapper>
    );
  }
);

ScrollControlledCard.displayName = "ScrollControlledCard";

export default MobileFeaturedProjects;
