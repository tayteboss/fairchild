import styled from "styled-components";
import { ProjectType } from "../../../shared/types/types";
import { motion } from "framer-motion";
import {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useLayoutEffect,
} from "react";
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

const MobileFeaturedProjects = (props: Props) => {
  const { data } = props;

  const [activeIndex, setActiveIndex] = useState(0);
  const [initialDelayComplete, setInitialDelayComplete] = useState(false);
  const [isInitialScrollComplete, setIsInitialScrollComplete] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [targetScrollPosition, setTargetScrollPosition] = useState<
    number | null
  >(null);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lenis = useLenis();
  const { setHeaderText, setIsHovering } = useHeader();

  const hasData = data && data.length > 0;

  // Stable no-op function for hover handlers in mobile view
  const handleHoverNoOp = () => {};

  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, data.length * 2);
  }, [data]);

  useEffect(() => {
    if (isReady) {
      const timer = setTimeout(() => {
        setInitialDelayComplete(true);
      }, 2000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [isReady]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (wrapperRef.current && lenis && hasData) {
        const wrapperElement = wrapperRef.current;
        const rect = wrapperElement.getBoundingClientRect();
        const top = rect.top + lenis.scroll;
        const wrapperHeight = wrapperElement.offsetHeight;

        // The vertical center of the wrapper
        const middleOfWrapper = top + wrapperHeight / 2;

        // Scroll so that this point is in the middle of the viewport
        const scrollToPosition = middleOfWrapper - window.innerHeight / 2;

        setTargetScrollPosition(scrollToPosition);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [lenis, hasData, wrapperRef]);

  useEffect(() => {
    if (targetScrollPosition !== null) {
      requestAnimationFrame(() => {
        // Try all possible native scroll targets
        if (document.scrollingElement) {
          document.scrollingElement.scrollTop = targetScrollPosition;
        }
        if (document.documentElement) {
          document.documentElement.scrollTop = targetScrollPosition;
        }
        if (document.body) {
          document.body.scrollTop = targetScrollPosition;
        }
        window.scrollTo(0, targetScrollPosition);

        setIsInitialScrollComplete(true);
        setIsReady(true);
      });
    }
  }, [targetScrollPosition]);

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
        initial={{ opacity: 0, scale: 0.25 }}
        animate={{
          opacity: isReady ? 1 : 0,
          scale: initialDelayComplete ? 1 : 0.25,
        }}
        transition={{
          scale: { duration: 0.5, ease: "easeInOut" },
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
};

const ScrollControlledCard = forwardRef<
  HTMLDivElement,
  ScrollControlledCardProps
>(({ project, index, activeIndex, initialDelayComplete, onHover }, ref) => {
  const isCardActive = activeIndex === index;

  return (
    <CardWrapper ref={ref} data-index={index}>
      <FeaturedProjectCard
        {...project}
        index={index}
        isHovered={initialDelayComplete && isCardActive}
        onHoverStart={onHover}
        onHoverEnd={onHover}
        hoveredIndex={activeIndex}
        initialDelayComplete={initialDelayComplete}
        isMobile={true}
      />
    </CardWrapper>
  );
});

ScrollControlledCard.displayName = "ScrollControlledCard";

export default MobileFeaturedProjects;
