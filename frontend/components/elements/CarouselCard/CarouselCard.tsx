import styled from "styled-components";
import { ProjectType } from "../../../shared/types/types";
import { motion } from "framer-motion";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import { useHeader } from "../../layout/HeaderContext";
import { useEffect } from "react";

const CardWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: crosshair;
`;

const Outer = styled.div<{ $ratio: string }>`
  width: 100%;
  padding-top: ${(props) => props.$ratio}%;
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

const ImageOuter = styled.div<{ $ratio: string }>`
  width: 100%;
  padding-top: ${(props) => props.$ratio}%;
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
  project: ProjectType | null;
  isMobile: boolean;
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
  hasScrolled: boolean;
  selectedProjectRatio: {
    label: string;
    value: string;
  };
};

const CarouselCard = ({
  project,
  gallery,
  onLoad,
  isOverlayActive,
  hasScrolled,
  isMobile,
  selectedProjectRatio,
}: Props) => {
  const { setHeaderText } = useHeader();

  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.5,
  });

  useEffect(() => {
    if (inView) {
      setHeaderText({
        logo: isMobile ? "" : project?.client || "",
        tagline: isMobile ? "" : project?.title || "",
        year: isMobile ? "" : project?.year || "",
      });
    }
  }, [inView, project, setHeaderText, isMobile, hasScrolled]);

  return (
    <CardWrapper ref={ref}>
      <Outer $ratio={selectedProjectRatio.value || "56.25"}>
        <InnerWrapper>
          <Inner>
            <ImageOuter $ratio={selectedProjectRatio.value || "56.25"}>
              <ImageInner>
                <Image
                  src={gallery.image.asset.url}
                  alt={project ? project.title : ""}
                  fill
                  style={{
                    objectFit: "cover",
                  }}
                  sizes="(max-width: 1024px) 100vw, 50vw"
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
