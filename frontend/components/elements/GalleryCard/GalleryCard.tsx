import styled from "styled-components";
import { ProjectType } from "../../../shared/types/types";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useProximityScale } from "../../../hooks/useProximityScale";

const GalleryCardWrapper = styled.div`
  grid-column: span 3;
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

const Inner = styled(motion.div)<{ $isHovered: boolean }>`
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
`;

const ColorBlock = styled.div<{ $bg: string; $isVisible: boolean }>`
  background: ${({ $bg }) => $bg};
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
`;

const ImageInner = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
`;

type Props = {
  project: ProjectType;
  gallery: ProjectType["gallery"][number];
  hasMouseMoved: boolean;
  setHeaderText: (text: {
    logo: string;
    tagline: string;
    type: { name: string }[];
    year: string;
  }) => void;
  setIsHovering: (isHovering: boolean) => void;
};

const GalleryCard = (props: Props) => {
  const { project, gallery, hasMouseMoved, setHeaderText, setIsHovering } =
    props;
  const [isHovered, setIsHovered] = useState(false);
  const [showColorBlock, setShowColorBlock] = useState(true);

  const { elementRef, scale } = useProximityScale({
    maxScale: 1,
    minScale: 0.25,
    proximityRadius: 300,
  });

  useEffect(() => {
    if (hasMouseMoved) {
      const randomDelay = Math.floor(Math.random() * 2000);
      const colorBlockTimer = setTimeout(() => {
        setShowColorBlock(false);
      }, randomDelay);
      return () => clearTimeout(colorBlockTimer);
    }
  }, [hasMouseMoved]);

  const handleHoverStart = () => {
    setIsHovered(true);
    setHeaderText({
      logo: project.client,
      tagline: project.title,
      type: project.type,
      year: project.year,
    });
    setIsHovering(true);
  };

  const handleHoverEnd = () => {
    setIsHovered(false);
    setIsHovering(false);
  };

  return (
    <GalleryCardWrapper>
      <Outer>
        <InnerWrapper>
          <Inner
            ref={elementRef}
            $isHovered={isHovered}
            animate={{
              // scale,
              width: `${scale * 100}%`,
            }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 15,
              mass: 0.5,
            }}
          >
            <ImageOuter>
              <ImageInner
                onMouseOver={handleHoverStart}
                onMouseOut={handleHoverEnd}
              >
                <ColorBlock
                  $bg={gallery?.thumbnailColor?.hex || "#000"}
                  $isVisible={showColorBlock}
                />
                <Image
                  src={gallery?.image?.asset?.url}
                  alt={project.title}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="25vw"
                  loading="lazy"
                />
              </ImageInner>
            </ImageOuter>
          </Inner>
        </InnerWrapper>
      </Outer>
    </GalleryCardWrapper>
  );
};

export default GalleryCard;
