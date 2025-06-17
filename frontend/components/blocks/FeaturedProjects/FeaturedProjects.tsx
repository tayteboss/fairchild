import styled from "styled-components";
import { ProjectType } from "../../../shared/types/types";
import FeaturedProjectCard from "../../elements/FeaturedProjectCard";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { useHeader } from "../../layout/HeaderContext";

const FeaturedProjectsWrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100lvh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    display: none;
  }
`;

const Inner = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  will-change: transform;
`;

const ParallaxWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  will-change: transform;
`;

type Props = {
  data: ProjectType[];
};

const springTransition = {
  type: "spring",
  stiffness: 100,
  damping: 30,
  mass: 1,
};

const PARALLAX_STRENGTH = 500;

const containerVariants = {
  hidden: {
    opacity: 0,
    y: 0,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delayChildren: 0.8,
      staggerChildren: 0.03,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const FeaturedProjects = (props: Props) => {
  const { data } = props;

  const { setHeaderText, setIsHovering } = useHeader();

  const [windowHeight, setWindowHeight] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [initialDelayComplete, setInitialDelayComplete] = useState(false);

  const motionY = useMotionValue(0);

  const hasData = data && data.length > 0;

  useEffect(() => {
    const timer = setTimeout(() => setInitialDelayComplete(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      motionY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [motionY]);

  useEffect(() => {
    const initialHeight = window.innerHeight;
    setWindowHeight(initialHeight);
    motionY.set(initialHeight / 2);

    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [motionY]);

  const liveNormalizedY = useTransform(motionY, (latestY) => {
    return windowHeight > 0 ? latestY / windowHeight - 0.5 : 0;
  });

  const liveTargetTranslateY = useTransform(
    liveNormalizedY,
    (latestNormalizedY) => -latestNormalizedY * PARALLAX_STRENGTH
  );

  const smoothedY = useSpring(liveTargetTranslateY, springTransition);

  const handleHoverStart = useCallback(
    (index: number) => {
      setHoveredIndex(index);
      const project = data[index % data.length];
      setHeaderText({
        logo: project.client,
        tagline: project.title,
        type: project.type,
        year: project.year,
      });
      setIsHovering(true);
    },
    [data, setHeaderText, setIsHovering]
  );

  const handleHoverEnd = useCallback(() => {
    setHoveredIndex(null);
    setIsHovering(false);
  }, [setIsHovering]);

  return (
    <FeaturedProjectsWrapper>
      <Inner variants={containerVariants} initial="hidden" animate="visible">
        <ParallaxWrapper
          style={{
            y: smoothedY,
          }}
        >
          {hasData &&
            [...data, ...data, ...data, ...data, ...data].map(
              (project, index) => (
                <motion.div
                  key={`${project.title}-${index}`}
                  variants={itemVariants}
                >
                  <FeaturedProjectCard
                    {...project}
                    index={index}
                    isHovered={hoveredIndex === index}
                    onHoverStart={() => handleHoverStart(index)}
                    onHoverEnd={handleHoverEnd}
                    hoveredIndex={hoveredIndex}
                    initialDelayComplete={initialDelayComplete}
                  />
                </motion.div>
              )
            )}
        </ParallaxWrapper>
      </Inner>
    </FeaturedProjectsWrapper>
  );
};

export default FeaturedProjects;
