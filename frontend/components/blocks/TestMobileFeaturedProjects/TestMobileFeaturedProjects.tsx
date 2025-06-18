import styled from "styled-components";
import { ProjectType } from "../../../shared/types/types";
import { motion } from "framer-motion";
import { useEffect, useState, useRef, forwardRef } from "react";
import FeaturedProjectCard from "../../elements/FeaturedProjectCard";
import { useHeader } from "../../layout/HeaderContext";
import ReactLenis, { useLenis } from "@studio-freight/react-lenis";

const TestMobileFeaturedProjectsWrapper = styled(motion.div)`
  display: none;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    display: flex;
    flex-direction: column;
    padding-top: 50svh;
    padding-bottom: 50svh;
  }
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

const TestMobileFeaturedProjects = (props: Props) => {
  const { data } = props;

  const [activeIndex, setActiveIndex] = useState(0);
  const [initialDelayComplete, setInitialDelayComplete] = useState(false);
  const [isInitialScrollComplete, setIsInitialScrollComplete] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lenis = useLenis();
  const { setHeaderText, setIsHovering } = useHeader();

  const hasData = data && data.length > 0;

  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, data.length * 2);
  }, [data]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialDelayComplete(true);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (initialDelayComplete && wrapperRef.current && lenis) {
      if (wrapperRef.current.offsetParent === null) {
        return;
      }

      const wrapperElement = wrapperRef.current;
      let middleOfComponent =
        wrapperElement.offsetTop + wrapperElement.offsetHeight / 2;

      // For even number of cards, center on the first card of the second half
      if (data.length % 2 === 0) {
        const firstCard = cardRefs.current[0];
        if (firstCard) {
          const cardHeight = firstCard.offsetHeight;
          middleOfComponent += cardHeight / 2;
        }
      }

      const scrollToPosition = middleOfComponent - window.innerHeight / 2;

      lenis.scrollTo(scrollToPosition, {
        immediate: true,
      });

      setIsInitialScrollComplete(true);
      setIsReady(true);
    }
  }, [initialDelayComplete, lenis, data.length]);

  useEffect(() => {
    if (!lenis || !hasData) return;

    const handleScroll = () => {
      const viewportCenter = window.innerHeight / 2;
      let minDistance = Infinity;
      let newActiveIndex = -1;

      cardRefs.current.forEach((card, index) => {
        if (card) {
          const rect = card.getBoundingClientRect();
          const cardCenter = rect.top + rect.height / 2;
          const distance = Math.abs(viewportCenter - cardCenter);

          if (distance < minDistance) {
            minDistance = distance;
            newActiveIndex = index;
          }
        }
      });

      if (newActiveIndex !== -1 && activeIndex !== newActiveIndex) {
        setActiveIndex(newActiveIndex);
        const project = data[newActiveIndex % data.length];
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
    };

    lenis.on("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => {
      lenis.off("scroll", handleScroll);
    };
  }, [activeIndex, data, hasData, setHeaderText, setIsHovering, lenis]);

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
    <TestMobileFeaturedProjectsWrapper
      ref={wrapperRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: isReady ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      {hasData &&
        [...data].map((project, index) => (
          <ScrollControlledCard
            key={`${project.title}-${index}`}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            project={project}
            index={index}
            activeIndex={activeIndex}
            initialDelayComplete={initialDelayComplete}
            isInitialScrollComplete={isInitialScrollComplete}
          />
        ))}
    </TestMobileFeaturedProjectsWrapper>
  );
};

type ScrollControlledCardProps = {
  project: ProjectType;
  index: number;
  activeIndex: number;
  initialDelayComplete: boolean;
  isInitialScrollComplete: boolean;
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
      isInitialScrollComplete,
    },
    ref
  ) => {
    const isCardActive = activeIndex === index;

    return (
      <CardWrapper ref={ref}>
        <FeaturedProjectCard
          {...project}
          index={index}
          isHovered={isCardActive}
          onHoverStart={() => {}}
          onHoverEnd={() => {}}
          hoveredIndex={activeIndex}
          initialDelayComplete={initialDelayComplete}
          isInitialScrollComplete={isInitialScrollComplete}
        />
      </CardWrapper>
    );
  }
);

ScrollControlledCard.displayName = "ScrollControlledCard";

export default TestMobileFeaturedProjects;
