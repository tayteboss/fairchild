import styled from "styled-components";
import { ProjectType } from "../../../shared/types/types";
import { motion } from "framer-motion";
import Image from "next/image";

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
  $isActive: boolean;
  $bg: string;
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${(props) => props.$bg};
  z-index: 2;
  pointer-events: none;
  opacity: ${(props) => (props.$isActive ? 1 : 0)};
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
  onLoad?: () => void;
  isOverlayActive: boolean;
};

const CarouselCard = ({ project, gallery, onLoad, isOverlayActive }: Props) => {
  return (
    <CardWrapper
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 1.5,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Outer>
        <InnerWrapper>
          <Inner>
            <ImageOuter>
              <ImageInner>
                <Image
                  src={gallery.image.asset.url}
                  alt={project.title}
                  fill
                  style={{
                    objectFit: "cover",
                  }}
                  sizes="70vw"
                  loading="lazy"
                  onLoad={onLoad}
                />
              </ImageInner>
            </ImageOuter>
            <ColorOverlay
              $isActive={isOverlayActive}
              $bg={gallery.thumbnailColor?.hex || "var(--colour-fg)"}
            />
          </Inner>
        </InnerWrapper>
      </Outer>
    </CardWrapper>
  );
};

export default CarouselCard;
