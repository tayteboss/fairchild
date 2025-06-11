import styled from "styled-components";
import { ProjectType } from "../../../shared/types/types";
import LayoutWrapper from "../../layout/LayoutWrapper";
import GalleryCard from "../../elements/GalleryCard";
import { useMouseMovement } from "../../../hooks/useMouseMovement";
import { useHeader } from "../../layout/HeaderContext";
import { motion } from "framer-motion";
import { useState } from "react";
import ProjectGalleryCarousel from "../../blocks/ProjectGalleryCarousel/ProjectGalleryCarousel";

const GalleryListWrapper = styled.div`
  position: relative;
  z-index: 1;
`;

const Inner = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const GalleryCardWrapper = styled(motion.div)`
  width: 25%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

type Props = {
  data: ProjectType[];
  filtersIsOpen: boolean;
};

const GalleryList = (props: Props) => {
  const { data, filtersIsOpen } = props;
  const { setHeaderText, setIsHovering } = useHeader();
  const { hasMoved } = useMouseMovement({
    initialDelay: 2000,
    movementThreshold: 5,
    throttleMs: 100,
  });
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<
    number | null
  >(null);
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState<
    number | null
  >(null);
  const [animationPhase, setAnimationPhase] = useState<
    "idle" | "fade" | "center" | "carousel"
  >("idle");

  const hasData = data && data.length > 0;

  const handleGalleryClick = (projectIndex: number, galleryIndex: number) => {
    setSelectedGalleryIndex(galleryIndex);
    setSelectedProjectIndex(projectIndex);
    setAnimationPhase("fade");

    // After fade, move to carousel
    setTimeout(() => {
      setAnimationPhase("carousel");
    }, 500);
  };

  const handleCloseCarousel = () => {
    setSelectedProjectIndex(null);
    setSelectedGalleryIndex(null);
    setAnimationPhase("idle");
  };

  const selectedProject =
    selectedProjectIndex !== null ? data[selectedProjectIndex] : null;

  return (
    <>
      <GalleryListWrapper>
        <LayoutWrapper>
          {/* <LayoutGrid> */}
          <Inner>
            {hasData &&
              data.map((project, i) =>
                project.gallery?.map((galleryItem, j) => (
                  <GalleryCardWrapper key={`${i}-${j}`}>
                    <GalleryCard
                      project={project}
                      gallery={galleryItem}
                      hasMouseMoved={hasMoved}
                      setHeaderText={setHeaderText}
                      setIsHovering={setIsHovering}
                      onClick={() => handleGalleryClick(i, j)}
                      isSelected={selectedProjectIndex === i}
                      animationPhase={animationPhase}
                      filtersIsOpen={filtersIsOpen}
                    />
                  </GalleryCardWrapper>
                ))
              )}
          </Inner>
          {/* </LayoutGrid> */}
        </LayoutWrapper>
      </GalleryListWrapper>

      <ProjectGalleryCarousel
        project={selectedProject}
        onClose={handleCloseCarousel}
        animationPhase={animationPhase}
        initialGalleryIndex={selectedGalleryIndex}
      />
    </>
  );
};

export default GalleryList;
