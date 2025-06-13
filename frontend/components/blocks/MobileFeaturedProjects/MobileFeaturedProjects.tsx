import styled from "styled-components";
import { ProjectType } from "../../../shared/types/types";
import MobileFeaturedProjectCard from "../../elements/MobileFeaturedProjectCard/MobileFeaturedProjectCard";
import { motion, useScroll } from "framer-motion";
import DynamicWidthCard from "./DynamicWidthCard";

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

  return (
    <MobileFeaturedProjectsWrapper
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
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
