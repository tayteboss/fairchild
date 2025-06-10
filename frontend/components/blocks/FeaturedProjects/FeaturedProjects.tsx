import styled from "styled-components";
import { ProjectType } from "../../../shared/types/types";
import FeaturedProjectCard from "../../elements/FeaturedProjectCard";
import { motion } from "framer-motion";
import { useMousePosition } from "../../../hooks/useMousePosition";
import { useEffect, useState, useMemo } from "react";

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
`;

const Inner = styled(motion.div)`
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

const PARALLAX_STRENGTH = 1500;

const FeaturedProjects = (props: Props) => {
  const { data } = props;
  const { y } = useMousePosition();
  const hasData = data && data.length > 0;
  const [windowHeight, setWindowHeight] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    setWindowHeight(window.innerHeight);
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const liveNormalizedY = useMemo(
    () => (y !== null && windowHeight > 0 ? y / windowHeight - 0.5 : 0),
    [y, windowHeight]
  );

  const liveTargetTranslateY = useMemo(
    () => -liveNormalizedY * PARALLAX_STRENGTH,
    [liveNormalizedY]
  );

  const itemInitialState = {
    y: 0,
  };

  const itemAnimateState = {
    y: liveTargetTranslateY,
  };

  const itemTransitionConfig = {
    y: { ...springTransition },
  };

  return (
    <FeaturedProjectsWrapper>
      <Inner
        initial={itemInitialState}
        animate={itemAnimateState}
        transition={itemTransitionConfig}
      >
        {hasData &&
          [...data, ...data].map((project, index) => (
            <FeaturedProjectCard
              key={`${project.title}-${index}`}
              {...project}
              index={index}
              totalCards={data.length * 2}
              isHovered={hoveredIndex === index}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              hoveredIndex={hoveredIndex}
            />
          ))}
      </Inner>
    </FeaturedProjectsWrapper>
  );
};

export default FeaturedProjects;
