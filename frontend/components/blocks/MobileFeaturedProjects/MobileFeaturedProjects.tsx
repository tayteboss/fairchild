import styled from "styled-components";
import { ProjectType } from "../../../shared/types/types";
import MobileFeaturedProjectCard from "../../elements/MobileFeaturedProjectCard/MobileFeaturedProjectCard";
import { motion, useScroll } from "framer-motion";
import DynamicWidthCard from "./DynamicWidthCard";
import { ReactLenis, useLenis } from "@studio-freight/react-lenis";
import { useEffect, useRef, useState, useCallback } from "react";

const MobileFeaturedProjectsWrapper = styled(motion.div)`
  display: none;
  transform-origin: center center;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 50vh 0;
    width: 100%;
  }
`;

type Props = {
  data: ProjectType[];
};

const MobileFeaturedProjects = (props: Props) => {
  const { data } = props;

  const { scrollY } = useScroll();
  const ref = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const [cardLayouts, setCardLayouts] = useState<
    { top: number; height: number }[]
  >([]);
  const didInitialScroll = useRef(false);

  const middleIndex = data.length > 0 ? Math.floor(data.length / 2) : 0;
  const maxWidth = 100;
  const minWidth = 40;

  const recalculateLayout = useCallback(() => {
    if (ref.current && data.length > 0) {
      const cards = ref.current.children;
      if (cards.length === 0) return;

      const style = window.getComputedStyle(cards[0]);
      const marginTop = parseFloat(style.marginTop) || 0;
      const marginBottom = parseFloat(style.marginBottom) || 0;
      const margin = marginTop + marginBottom;

      const vw = window.innerWidth / 100;
      let accumulatedTop = window.innerHeight / 2;

      const newLayouts = Array.from(cards).map((_, index) => {
        const isActive = index === middleIndex;
        const cardWidthVw = isActive ? maxWidth : minWidth;
        const cardWidthPx = cardWidthVw * vw;
        const cardHeightPx = (cardWidthPx * 9) / 16;

        const top = accumulatedTop;
        accumulatedTop += cardHeightPx + margin;
        return { top, height: cardHeightPx };
      });

      setCardLayouts(newLayouts);
    }
  }, [data, middleIndex]);

  useEffect(() => {
    const handleResize = () => {
      recalculateLayout();
    };

    const timeoutId = setTimeout(() => {
      recalculateLayout();
    }, 100);

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, [recalculateLayout]);

  useEffect(() => {
    if (lenis && cardLayouts.length > 0 && !didInitialScroll.current) {
      const timeout = setTimeout(() => {
        if (!ref.current) return;

        const targetLayout = cardLayouts[middleIndex];
        if (targetLayout) {
          didInitialScroll.current = true;
          const deviceHeight = window.innerHeight;
          const offset =
            targetLayout.top - deviceHeight / 2 + targetLayout.height / 2;

          lenis.scrollTo(offset, {
            duration: 2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
        }
      }, 100);

      return () => clearTimeout(timeout);
    }
  }, [lenis, cardLayouts, middleIndex]);

  return (
    <MobileFeaturedProjectsWrapper
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      ref={ref}
    >
      {data.map((project, i) => (
        <DynamicWidthCard
          key={`mobile-featured-project-${i}`}
          scrollY={scrollY}
          maxWidth={100}
          minWidth={40}
        >
          <MobileFeaturedProjectCard project={project} />
        </DynamicWidthCard>
      ))}
    </MobileFeaturedProjectsWrapper>
  );
};

export default MobileFeaturedProjects;
