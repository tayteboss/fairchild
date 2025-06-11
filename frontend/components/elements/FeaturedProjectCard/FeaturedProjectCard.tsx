import styled from "styled-components";
import { ProjectType } from "../../../shared/types/types";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { useMousePosition } from "../../../hooks/useMousePosition";

// Base and max width variables for easy adjustment
const INITIAL_WIDTH = "2vw";
const BASE_WIDTH = "5vw";
const HOVER_BASE_WIDTH = "5vw";
const MAX_WIDTH = "50vw";
const ADJACENT_WIDTH = "25vw";
const STAGGER_CARDS = 7;

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
  client: ProjectType["client"];
  thumbnailColor: ProjectType["thumbnailColor"];
  fallbackImage: ProjectType["fallbackImage"];
  video: ProjectType["video"];
  index: number;
  totalCards: number;
  isHovered: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  hoveredIndex: number | null;
};

const FeaturedProjectCard = (props: Props) => {
  const {
    title,
    client,
    thumbnailColor,
    fallbackImage,
    video,
    index,
    totalCards,
    isHovered,
    onHoverStart,
    onHoverEnd,
    hoveredIndex,
  } = props;

  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [hasVideoLoaded, setHasVideoLoaded] = useState(false);
  const [initialDelayComplete, setInitialDelayComplete] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [initialY, setInitialY] = useState<number | null>(null);

  const { y } = useMousePosition();

  const hasVideo = video?.asset?.playbackId;
  const hasFallbackImage = fallbackImage?.asset?.url;

  // Use refs for all video state to persist between re-renders
  const playerRef = useRef<any>(null);

  useEffect(() => {
    // Set initial cursor position
    if (y !== null && initialY === null) {
      setInitialY(y);
    }
  }, [y, initialY]);

  useEffect(() => {
    // Start the initial 2-second timer
    const initialTimer = setTimeout(() => {
      setInitialDelayComplete(true);
    }, 2000);

    return () => clearTimeout(initialTimer);
  }, []);

  useEffect(() => {
    // After 2 seconds, check for cursor movement
    if (initialDelayComplete && initialY !== null && y !== null && !hasMoved) {
      if (Math.abs(y - initialY) > 5) {
        // Small threshold to detect movement
        setHasMoved(true);
      }
    }
  }, [initialDelayComplete, initialY, y, hasMoved]);

  useEffect(() => {
    if (!playerRef.current) return;

    const player = playerRef.current;

    const handlePlay = () => {
      setIsVideoPlaying(true);
    };

    const handlePause = () => {
      setIsVideoPlaying(false);
    };

    player.addEventListener("play", handlePlay);
    player.addEventListener("pause", handlePause);

    if (isHovered) {
      player.play();
    } else {
      player.pause();
    }

    return () => {
      player.removeEventListener("play", handlePlay);
      player.removeEventListener("pause", handlePause);
    };
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

    return `${parseFloat(ADJACENT_WIDTH) - staggerAmount * (distanceFromHovered - 1)}vw`;
  };

  return (
    <FeaturedProjectCardWrapper
      $bgColor={thumbnailColor?.hex || "#000"}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      style={{
        width: getStaggeredWidth(),
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
              playbackId={video.asset.playbackId}
              autoPlay="muted"
              loop={true}
              preload="auto"
              muted
              playsInline={true}
              minResolution="720p"
              onCanPlay={() => setHasVideoLoaded(true)}
            />
            {hasFallbackImage && !hasVideoLoaded && (
              <PosterImage
                animate={{
                  opacity: isVideoPlaying ? 0 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={fallbackImage.asset.url}
                  alt={title}
                  priority={true}
                  fill
                  style={{
                    objectFit: "cover",
                    transform: "translateZ(0)",
                  }}
                  sizes="50vw"
                  loading="eager"
                />
              </PosterImage>
            )}
          </VideoWrapper>
        )}
        {!hasVideo && isHovered && hasFallbackImage && (
          <Image
            src={fallbackImage.asset.url}
            alt={title}
            priority={true}
            fill
            style={{
              objectFit: "cover",
              transform: "translateZ(0)",
            }}
            sizes="50vw"
            loading="eager"
          />
        )}
      </Inner>
    </FeaturedProjectCardWrapper>
  );
};

export default FeaturedProjectCard;
