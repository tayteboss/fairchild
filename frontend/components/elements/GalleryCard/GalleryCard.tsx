import styled from "styled-components";
import { ProjectType } from "../../../shared/types/types";
import { motion } from "framer-motion";
import Image from "next/image";
import { useProximityScale } from "../../../hooks/useProximityScale";

const CardWrapper = styled(motion.div)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Outer = styled.div`
  width: 100%;
  padding-top: 56.25%;
  position: relative;
`;

const InnerWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Inner = styled(motion.div)`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ImageOuter = styled.div`
  width: 100%;
  padding-top: 56.25%;
  position: relative;
  overflow: hidden;
`;

const ImageInner = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
`;

const ColorOverlay = styled(motion.div)<{
  $isSelected: boolean;
  $animationPhase: "idle" | "fade" | "center" | "carousel";
  $color: string;
  $hasMouseMoved: boolean;
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${(props) => props.$color};
  z-index: 2;
  pointer-events: none;
  opacity: ${(props) => {
    if (!props.$hasMouseMoved) return 1;
    return 0;
  }};
  transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1);
`;

type Props = {
  project: ProjectType;
  gallery: {
    image: {
      asset: {
        url: string;
      };
    };
    thumbnailColor: {
      hex: string;
    };
    colorTempFilter: {
      minTemp: number;
      maxTemp: number;
    };
    saturationFilter: number;
  };
  hasMouseMoved: boolean;
  setHeaderText: (text: {
    logo: string;
    tagline: string;
    type?: { name: string }[];
    year?: string;
  }) => void;
  setIsHovering: (isHovering: boolean) => void;
  onClick: () => void;
  isSelected: boolean;
  animationPhase: "idle" | "fade" | "center" | "carousel";
  filtersIsOpen: boolean;
};

const GalleryCard = ({
  project,
  gallery,
  hasMouseMoved,
  setHeaderText,
  setIsHovering,
  onClick,
  isSelected,
  animationPhase,
  filtersIsOpen,
}: Props) => {
  const { elementRef, scale } = useProximityScale({
    maxScale: 1,
    minScale: 0.25,
    proximityRadius: 300,
  });

  return (
    <CardWrapper onClick={onClick}>
      <Outer>
        <InnerWrapper>
          <Inner
            ref={elementRef}
            layout
            animate={{
              width:
                isSelected && animationPhase === "carousel"
                  ? "100%"
                  : filtersIsOpen
                    ? "25%"
                    : `${scale * 100}%`,
            }}
            transition={{
              layout: {
                duration: 1.5,
                ease: [0.16, 1, 0.3, 1],
              },
            }}
            onHoverStart={() => {
              setIsHovering(true);
              setHeaderText({
                logo: project.client,
                tagline: project.title,
              });
            }}
            onHoverEnd={() => {
              setIsHovering(false);
              setHeaderText({
                logo: "Fairchild",
                tagline: "",
              });
            }}
          >
            <ImageOuter>
              <ImageInner>
                <Image
                  src={gallery.image.asset.url}
                  alt={project.title}
                  fill
                  style={{
                    objectFit: "cover",
                    transform: hasMouseMoved ? "scale(1.1)" : "scale(1)",
                    transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                  sizes="25vw"
                  loading="lazy"
                  quality={50}
                />
                <ColorOverlay
                  $color={gallery.thumbnailColor.hex}
                  $isSelected={isSelected}
                  $animationPhase={animationPhase}
                  $hasMouseMoved={hasMouseMoved}
                />
              </ImageInner>
            </ImageOuter>
          </Inner>
        </InnerWrapper>
      </Outer>
    </CardWrapper>
  );
};

export default GalleryCard;
