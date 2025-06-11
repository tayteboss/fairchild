import styled from "styled-components";
import { ProjectType } from "../../../shared/types/types";
import { motion } from "framer-motion";
import { useEffect } from "react";
import CarouselCard from "../../elements/CarouselCard/CarouselCard";
import { useHeader } from "../../layout/HeaderContext";

const CarouselWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 50;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

const Backdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--colour-bg);
  opacity: 0.8;
`;

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120px 0;
  overflow: scroll;
`;

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 50vw;
  margin: 0 auto;
`;

const CarouselCardWrapper = styled(motion.div)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CloseButton = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: var(--color-white);
  font-size: 16px;
  cursor: pointer;
  z-index: 101;
  padding: 10px;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.7;
  }
`;

type Props = {
  project: ProjectType | null;
  onClose: () => void;
  animationPhase: "idle" | "fade" | "center" | "carousel";
  initialGalleryIndex: number | null;
};

const ProjectGalleryCarousel = (props: Props) => {
  const { project, onClose, animationPhase, initialGalleryIndex } = props;

  const { setHeaderText, setIsHovering } = useHeader();

  const handleClose = () => {
    setHeaderText({
      logo: "Fairchild",
      tagline: "",
    });
    setIsHovering(false);
    onClose();
  };

  useEffect(() => {
    if (project && animationPhase === "carousel") {
      setHeaderText({
        logo: project.client || "",
        tagline: project.title || "",
      });
      setIsHovering(true);
    }
  }, [project, animationPhase]);

  if (!project || animationPhase !== "carousel") return null;

  return (
    <CarouselWrapper data-lenis-prevent>
      <CarouselContainer>
        <Inner>
          <Backdrop />
          {project.gallery?.map((galleryItem, index) => {
            // Reorder the gallery items to show the selected one first
            const displayIndex =
              (index + (initialGalleryIndex || 0)) % project.gallery.length;
            const displayItem = project.gallery[displayIndex];

            return (
              <CarouselCardWrapper
                key={`carousel-${displayIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <CarouselCard project={project} gallery={displayItem} />
              </CarouselCardWrapper>
            );
          })}
        </Inner>
      </CarouselContainer>
      <CloseButton onClick={() => handleClose()}>Close</CloseButton>
    </CarouselWrapper>
  );
};

export default ProjectGalleryCarousel;
