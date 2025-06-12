import styled from "styled-components";
import { ProjectType } from "../../../shared/types/types";
import LayoutWrapper from "../../layout/LayoutWrapper";
import GalleryCard from "../../elements/GalleryCard";
import { useMouseMovement } from "../../../hooks/useMouseMovement";
import { useHeader } from "../../layout/HeaderContext";
import { motion } from "framer-motion";

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
  handleGalleryClick: (projectIndex: number, galleryIndex: number) => void;
  selectedProjectIndex: number | null;
  animationPhase: "idle" | "fade" | "center" | "carousel";
};

const GalleryList = (props: Props) => {
  const {
    data,
    filtersIsOpen,
    handleGalleryClick,
    selectedProjectIndex,
    animationPhase,
  } = props;

  const { setHeaderText, setIsHovering } = useHeader();
  const { hasMoved } = useMouseMovement({
    initialDelay: 2000,
    movementThreshold: 5,
    throttleMs: 100,
  });

  const hasData = data && data.length > 0;

  return (
    <GalleryListWrapper>
      <LayoutWrapper>
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
      </LayoutWrapper>
    </GalleryListWrapper>
  );
};

export default GalleryList;
