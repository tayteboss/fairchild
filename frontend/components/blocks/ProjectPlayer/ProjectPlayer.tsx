import styled, { css } from "styled-components";
import { ProjectType } from "../../../shared/types/types";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import MuxPlayer from "@mux/mux-player-react";
import pxToRem from "../../../utils/pxToRem";
import VideoControls from "../VideoControls";
import CreditsModal from "../CreditsModal";
import MobileProjectDetails from "../MobileProjectDetails";
import { useRouter } from "next/navigation";
import useViewportWidth from "../../../hooks/useViewportWidth";

const calculateAspectRatio = (aspectRatio: string) => {
  const [width, height] = aspectRatio.split(":");
  return `${(parseInt(height) / parseInt(width)) * 100}%`;
};

const ProjectPlayerWrapper = styled(motion.section)<{ $isFullScreen: boolean }>`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: ${({ $isFullScreen }) => ($isFullScreen ? "all" : "none")};
  z-index: 1000;

  /* transition: all var(--transition-speed-default) ease-in-out; */
`;

const Backdrop = styled.div<{ $isActive: boolean }>`
  position: absolute;
  inset: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  opacity: ${({ $isActive }) => ($isActive ? 1 : 0)};
  z-index: 1;
  pointer-events: ${({ $isActive }) => ($isActive ? "all" : "none")};

  transition: all var(--transition-speed-slow) var(--transition-ease);
`;

const Outer = styled.div<{ $isFullScreen: boolean }>`
  width: ${({ $isFullScreen }) => ($isFullScreen ? "100%" : "33.33%")};
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 2;
  padding: ${pxToRem(8)};

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    bottom: 32px;
    width: 100%;
  }

  transition: all var(--transition-speed-slow) var(--transition-ease);
`;

const Ratio = styled.div<{ $aspectRatio: string; $isFullScreen: boolean }>`
  position: relative;

  ${({ $aspectRatio, $isFullScreen }) =>
    $isFullScreen
      ? css`
          aspect-ratio: ${$aspectRatio.replace(":", " / ")};
          max-height: 100vh;
          max-width: 100vw;
          margin: 0 auto;
        `
      : css`
          width: 100%;
          padding-top: ${calculateAspectRatio($aspectRatio)};
        `};
`;

const Inner = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;

  mux-player {
    object-fit: contain;
    object-position: center;
    height: 100%;
    width: 100%;
  }
`;

const ImageOverlay = styled.div<{ $isVisible: boolean }>`
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  /* transition: opacity var(--transition-speed-fast) var(--transition-ease); */

  img {
    object-fit: cover;
    object-position: center;
    height: 100%;
    width: 100%;
  }
`;

const CloseTrigger = styled(motion.button)`
  position: fixed;
  top: ${pxToRem(8)};
  right: ${pxToRem(8)};
  z-index: 10;
  color: var(--colour-white);
  text-decoration: underline;
`;

const LoadingIndicator = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
  pointer-events: none;
`;

const LoadingDot = styled.div`
  width: ${pxToRem(8)};
  height: ${pxToRem(8)};
  border-radius: 50%;
  background-color: var(--colour-white);
  animation: flash 0.5s ease-in-out infinite;

  @keyframes flash {
    0%,
    100% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
  }
`;

const wrapperVariants = {
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

type Props = {
  activeProject: {
    project: ProjectType | null;
    action: "hover" | "fullscreen" | "inactive";
  };
  isFullScreen: boolean;
  setIsFullScreen: (isFullScreen: boolean) => void;
  setActiveProject: (project: {
    project: ProjectType | null;
    action: "hover" | "fullscreen" | "inactive";
  }) => void;
  useCloseLink?: boolean;
};

const ProjectPlayer = (props: Props) => {
  const {
    activeProject,
    isFullScreen,
    useCloseLink,
    setIsFullScreen,
    setActiveProject,
  } = props;

  const [isActive, setIsActive] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoLength, setVideoLength] = useState(
    activeProject?.project?.video?.asset?.data?.duration || 0
  );
  const [isCreditsOpen, setIsCreditsOpen] = useState(false);
  const [showImageOverlay, setShowImageOverlay] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);

  const muxPlayerRef = useRef<any>(null);
  const closeTimeoutRef = useRef<number | null>(null);
  const imageTimeoutRef = useRef<number | null>(null);
  const isVideoReadyRef = useRef<boolean>(false);
  const router = useRouter();
  const viewportWidth = useViewportWidth();
  const isMobile =
    viewportWidth === "mobile" || viewportWidth === "tabletPortrait";

  const handleSeek = (time: number) => {
    if (muxPlayerRef?.current) {
      muxPlayerRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleClose = useCallback(() => {
    if (useCloseLink) {
      router.push(`/projects`);
      return;
    }

    // First transition out of fullscreen
    setIsFullScreen(false);

    if (isMobile) {
      setIsActive(false);
      // Clear the active project immediately on mobile to ensure clean state for next open
      setActiveProject({ project: null, action: "inactive" });
    } else {
      // On desktop, transition to hover mode - keep video playing until another project is hovered
      if (activeProject?.project) {
        // Clear any existing close timeout since we're keeping it in hover state
        if (closeTimeoutRef.current) {
          window.clearTimeout(closeTimeoutRef.current);
          closeTimeoutRef.current = null;
        }

        // Transition to hover state - video will keep playing
        setActiveProject({
          project: activeProject.project,
          action: "hover",
        });
      } else {
        setActiveProject({ project: null, action: "inactive" });
      }
    }
  }, [
    activeProject,
    router,
    setActiveProject,
    setIsFullScreen,
    useCloseLink,
    isMobile,
  ]);

  useEffect(() => {
    if (muxPlayerRef.current) {
      if (isPlaying) {
        muxPlayerRef.current.play();
      } else {
        muxPlayerRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    setVideoLength(activeProject?.project?.video?.asset?.data?.duration || 0);
  }, [activeProject]);

  useEffect(() => {
    // Reset overlays for each new active project / playback id
    if (!activeProject.project) {
      setShowImageOverlay(false);
      setIsVideoReady(false);
      isVideoReadyRef.current = false;
      if (imageTimeoutRef.current) {
        window.clearTimeout(imageTimeoutRef.current);
        imageTimeoutRef.current = null;
      }
    } else {
      // Start with image overlay hidden, then show after 100ms delay
      setShowImageOverlay(false);
      setIsVideoReady(false);
      isVideoReadyRef.current = false;

      // Clear any existing timeout
      if (imageTimeoutRef.current) {
        window.clearTimeout(imageTimeoutRef.current);
      }

      // Show fallback image after 100ms delay
      imageTimeoutRef.current = window.setTimeout(() => {
        setShowImageOverlay(true);
        imageTimeoutRef.current = null;
      }, 100);
    }

    return () => {
      if (imageTimeoutRef.current) {
        window.clearTimeout(imageTimeoutRef.current);
        imageTimeoutRef.current = null;
      }
    };
  }, [
    activeProject?.project,
    activeProject?.project?.video?.asset?.playbackId,
  ]);

  useEffect(() => {
    const isActiveAction =
      activeProject.action === "hover" || activeProject.action === "fullscreen";

    if (activeProject.action === "fullscreen") {
      setIsActive(true);
      setIsFullScreen(true);
    } else if (activeProject.action === "hover") {
      setIsActive(true);
      setIsFullScreen(false);
    } else if (activeProject.action === "inactive") {
      setIsActive(false);
      setIsFullScreen(false);
    }
  }, [activeProject.action, setIsFullScreen]);

  useEffect(() => {
    if (!isFullScreen) {
      setIsMuted(true);
    }
  }, [isFullScreen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isFullScreen) {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullScreen, handleClose]);

  useEffect(
    () => () => {
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current);
      }
      if (imageTimeoutRef.current) {
        window.clearTimeout(imageTimeoutRef.current);
      }
    },
    []
  );

  useEffect(() => {
    if (!isActive) {
      setShowImageOverlay(false);
      setIsVideoReady(false);
      isVideoReadyRef.current = false;
      if (imageTimeoutRef.current) {
        window.clearTimeout(imageTimeoutRef.current);
        imageTimeoutRef.current = null;
      }
    }
  }, [isActive]);

  const aspectRatioString =
    activeProject?.project?.video?.asset?.data?.aspect_ratio || "16:9";

  const fallbackImageUrl = activeProject?.project?.fallbackImage?.asset?.lores;

  const handleVideoPlaying = () => {
    // Video is actually playing now - show the video
    setIsVideoReady(true);
    isVideoReadyRef.current = true;
    // Hide fallback image only after video has fully faded in (200ms transition + 50ms buffer)
    // This ensures no black gap between fallback and video
    setTimeout(() => {
      setShowImageOverlay(false);
    }, 250);
  };

  // Ensure player opens when action is fullscreen
  const shouldShow = isActive || activeProject.action === "fullscreen";
  // Ensure backdrop shows when in fullscreen mode or when action is fullscreen (for mobile)
  const backdropIsActive =
    isFullScreen || activeProject.action === "fullscreen";

  return (
    <AnimatePresence>
      {shouldShow && (
        <ProjectPlayerWrapper
          variants={wrapperVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          $isFullScreen={isFullScreen}
        >
          <Backdrop $isActive={backdropIsActive} />
          <CreditsModal
            isOpen={isCreditsOpen}
            setIsOpen={setIsCreditsOpen}
            project={activeProject?.project}
          />
          <MobileProjectDetails
            project={activeProject?.project}
            isActive={isFullScreen}
            setIsCreditsOpen={setIsCreditsOpen}
          />
          <Outer $isFullScreen={isFullScreen}>
            <Ratio
              $aspectRatio={aspectRatioString}
              $isFullScreen={isFullScreen}
            >
              {fallbackImageUrl && (
                <ImageOverlay $isVisible={showImageOverlay}>
                  <Image
                    src={fallbackImageUrl}
                    alt={activeProject?.project?.title || "Project poster"}
                    fill
                    sizes="(max-width: 1024px) 50vw, 20vw"
                    priority={true}
                  />
                </ImageOverlay>
              )}
              <Inner
                style={{
                  opacity: isVideoReady ? 1 : 0,
                  transition: "opacity 0.2s ease",
                }}
              >
                {!isVideoReady &&
                  activeProject?.project?.video?.asset?.playbackId && (
                    <LoadingIndicator>
                      <LoadingDot />
                    </LoadingIndicator>
                  )}
                <AnimatePresence>
                  {isFullScreen && (
                    <CloseTrigger
                      onClick={handleClose}
                      variants={wrapperVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      Close
                    </CloseTrigger>
                  )}
                </AnimatePresence>
                <VideoControls
                  isMuted={isMuted}
                  currentTime={currentTime}
                  videoLength={videoLength}
                  isFullScreen={isFullScreen}
                  setIsMuted={setIsMuted}
                  handleSeek={handleSeek}
                  handleClose={handleClose}
                  setIsCreditsOpen={setIsCreditsOpen}
                />
                {activeProject?.project?.video?.asset?.playbackId && (
                  <MuxPlayer
                    ref={muxPlayerRef}
                    streamType="on-demand"
                    playbackId={activeProject?.project?.video.asset.playbackId}
                    autoPlay="muted"
                    loop={true}
                    preload="auto"
                    muted={isMuted}
                    playsInline={true}
                    minResolution="1080p"
                    style={
                      {
                        "--media-object-fit": "contain",
                        aspectRatio: aspectRatioString.replace(":", " / "),
                        height: "100%",
                        opacity: isVideoReady ? 1 : 0,
                      } as CSSProperties
                    }
                    onPlaying={handleVideoPlaying}
                    onTimeUpdate={() => {
                      if (muxPlayerRef.current) {
                        setCurrentTime(muxPlayerRef.current.currentTime);
                      }
                    }}
                  />
                )}
              </Inner>
            </Ratio>
          </Outer>
        </ProjectPlayerWrapper>
      )}
    </AnimatePresence>
  );
};

export default ProjectPlayer;
