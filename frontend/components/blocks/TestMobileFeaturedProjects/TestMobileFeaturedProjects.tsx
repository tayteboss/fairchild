import styled from "styled-components";
import { ProjectType } from "../../../shared/types/types";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import {
  useEffect,
  useState,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import FeaturedProjectCard from "../../elements/FeaturedProjectCard";
import { useHeader } from "../../layout/HeaderContext";
import Lenis from "@studio-freight/lenis";

const TestMobileFeaturedProjectsWrapper = styled(motion.div)`
  display: none;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    display: flex;
    flex-direction: column;
    /* gap: 10vh; */
    padding-top: 50svh; // Adjust as needed
    padding-bottom: 50svh; // Adjust as needed
  }
`;

const CardWrapper = styled.div`
  height: auto; // Adjust as needed, makes card positions easier to calculate
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
  const { setHeaderText, setIsHovering } = useHeader();
  const [activeIndex, setActiveIndex] = useState(0);
  const [initialDelayComplete, setInitialDelayComplete] = useState(false);
  const activeLock = useRef(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  const hasData = data && data.length > 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialDelayComplete(true);
    }, 2000);

    const lenis = new Lenis();
    lenisRef.current = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      clearTimeout(timer);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const handleActiveChange = useCallback(
    (index: number) => {
      if (activeLock.current) return;

      activeLock.current = true;
      setActiveIndex(index);
      const project = data[index];
      if (project) {
        setHeaderText({
          logo: project.client,
          tagline: project.title,
          type: project.type,
          year: project.year,
        });
        setIsHovering(true);
      }

      setTimeout(() => {
        activeLock.current = false;
      }, 300);
    },
    [data, setHeaderText, setIsHovering]
  );

  useLayoutEffect(() => {
    if (initialDelayComplete && wrapperRef.current && lenisRef.current) {
      if (wrapperRef.current.offsetParent === null) {
        return;
      }

      // const element = wrapperRef.current;
      // const elementTop = element.offsetTop;
      // const elementHeight = element.offsetHeight;
      // const middleOfElement = elementTop + elementHeight / 2;
      // const scrollToPosition = middleOfElement - document.innerHeight / 2;

      const middleOfDocument = document.documentElement.scrollHeight / 2;
      const scrollToPosition = middleOfDocument - window.innerHeight / 2;

      lenisRef.current.scrollTo(scrollToPosition, {
        duration: 2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    }
  }, [initialDelayComplete]);

  useEffect(() => {
    // Set initial header text
    if (hasData) {
      handleActiveChange(0);
    }

    return () => {
      setIsHovering(false);
    };
  }, [hasData, handleActiveChange, setIsHovering]);

  return (
    <TestMobileFeaturedProjectsWrapper ref={wrapperRef}>
      {hasData &&
        [...data, ...data, ...data, ...data, ...data].map((project, index) => (
          <ScrollControlledCard
            key={`${project.title}-${index}`}
            project={project}
            index={index}
            activeIndex={activeIndex}
            onBecameActive={() => handleActiveChange(index)}
            initialDelayComplete={initialDelayComplete}
          />
        ))}
    </TestMobileFeaturedProjectsWrapper>
  );
};

type ScrollControlledCardProps = {
  project: ProjectType;
  index: number;
  activeIndex: number;
  onBecameActive: () => void;
  initialDelayComplete: boolean;
};

const ScrollControlledCard = ({
  project,
  index,
  activeIndex,
  onBecameActive,
  initialDelayComplete,
}: ScrollControlledCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const prevProgress = useRef(0);
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > 0.4 && latest < 0.6) {
      if (activeIndex !== index) {
        onBecameActive();
      }
    }
  });

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
      />
    </CardWrapper>
  );
};

export default TestMobileFeaturedProjects;
