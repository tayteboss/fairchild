import styled from "styled-components";
import { ProjectType } from "../../../shared/types/types";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useRef, useState, memo } from "react";
import MuxPlayer from "@mux/mux-player-react/lazy";
import useViewportWidth from "../../../hooks/useViewportWidth";

// Base and max width variables for easy adjustment
const BASE_MOBILE_WIDTH = "100vw";

const INITIAL_WIDTH = "2vw";
const BASE_WIDTH = "5vw";
const HOVER_BASE_WIDTH = "5vw";
const ADJACENT_WIDTH = "25vw";
const MAX_WIDTH = "50vw";

const STAGGER_CARDS = 10;

const FeaturedProjectCardWrapper = styled(motion.div)<{ $bgColor: string }>`
  width: ${INITIAL_WIDTH};
  background: ${({ $bgColor }) => $bgColor || "#000"};
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;
  transform-origin: top;
  will-change: width;
  cursor: crosshair;
`;

const Inner = styled.div`
  padding-top: 56.25%;
  position: relative;
  overflow: hidden;
  transform-origin: top;

  img,
  mux-player {
    object-fit: cover;
    height: 100%;
    width: 100%;
  }
`;

const VideoWrapper = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const BackgroundColor = styled(motion.div)<{ $bgColor: string }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${({ $bgColor }) => $bgColor || "#000"};
  z-index: 1;
`;

const PosterImage = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
`;

type Props = {
  title: ProjectType["title"];
  thumbnailColor: ProjectType["thumbnailColor"];
  fallbackImage: ProjectType["fallbackImage"];
  video: ProjectType["video"];
  snippetVideo: ProjectType["snippetVideo"];
  snippetFallbackImage: ProjectType["snippetFallbackImage"];
  index: number;
  isHovered: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  hoveredIndex: number | null;
  initialDelayComplete: boolean;
};

const FeaturedProjectCard = memo((props: Props) => {
  const {
    title,
    thumbnailColor,
    fallbackImage,
    video,
    snippetVideo,
    snippetFallbackImage,
    index,
    isHovered,
    onHoverStart,
    onHoverEnd,
    hoveredIndex,
    initialDelayComplete,
  } = props;

  const viewport = useViewportWidth();
  const isMobile = viewport === "mobile" || viewport === "tabletPortrait";

  // Prioritize snippet video/image over regular video/image
  const hasVideo = snippetVideo?.asset?.playbackId || video?.asset?.playbackId;
  const hasFallbackImage =
    snippetFallbackImage?.asset?.url || fallbackImage?.asset?.url;
  const videoPlaybackId =
    snippetVideo?.asset?.playbackId || video?.asset?.playbackId;
  const fallbackImageUrl =
    snippetFallbackImage?.asset?.url || fallbackImage?.asset?.url;

  // Use refs for all video state to persist between re-renders
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (!playerRef.current) return;

    const player = playerRef.current;

    if (isHovered) {
      player.play();
    } else {
      player.pause();
    }
  }, [isHovered]);

  // Calculate the stagger effect based on distance from hovered card
  const getStaggeredWidth = () => {
    if (!initialDelayComplete) return INITIAL_WIDTH;
    if (hoveredIndex === null) return BASE_WIDTH;

    const distanceFromHovered = Math.abs(index - hoveredIndex);

    // Return base width for cards beyond the stagger range
    if (distanceFromHovered > STAGGER_CARDS + 1) return HOVER_BASE_WIDTH;

    // Return specific widths for hovered and adjacent cards
    if (distanceFromHovered === 0) return MAX_WIDTH;
    if (distanceFromHovered === 1) return ADJACENT_WIDTH;

    // Calculate remaining cards' widths with more pronounced stagger
    const widthDiff = parseFloat(ADJACENT_WIDTH) - parseFloat(HOVER_BASE_WIDTH);
    const staggerAmount = widthDiff / STAGGER_CARDS;

    return `${
      parseFloat(ADJACENT_WIDTH) - staggerAmount * (distanceFromHovered - 1)
    }vw`;
  };

  return (
    <FeaturedProjectCardWrapper
      $bgColor={thumbnailColor?.hex || "#000"}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      style={{
        width: isMobile ? BASE_MOBILE_WIDTH : getStaggeredWidth(),
        zIndex: isHovered ? 2 : 1,
        transform: "translateZ(0)",
      }}
    >
      <Inner>
        <BackgroundColor
          $bgColor={thumbnailColor?.hex || "#000"}
          animate={{
            opacity: isHovered ? 0 : 1,
          }}
          transition={{ duration: 0.3 }}
        />
        {hasVideo && (
          <VideoWrapper
            initial={{ opacity: 0 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              display: isHovered ? "block" : "none",
            }}
            transition={{ duration: 0.2 }}
          >
            <MuxPlayer
              ref={playerRef}
              streamType="on-demand"
              playbackId={videoPlaybackId}
              autoPlay="muted"
              loop={true}
              preload="metadata"
              loading="viewport"
              muted
              playsInline={true}
              minResolution="720p"
              poster={fallbackImageUrl}
            />
          </VideoWrapper>
        )}
        {!hasVideo && isHovered && hasFallbackImage && (
          <Image
            src={fallbackImageUrl}
            alt={title}
            priority={false}
            fill
            style={{
              objectFit: "cover",
              transform: "translateZ(0)",
            }}
            sizes="50vw"
          />
        )}
      </Inner>
    </FeaturedProjectCardWrapper>
  );
});

FeaturedProjectCard.displayName = "FeaturedProjectCard";

export default FeaturedProjectCard;
