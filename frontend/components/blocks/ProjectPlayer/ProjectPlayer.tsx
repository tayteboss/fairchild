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

  transition: all var(--transition-speed-default) var(--transition-ease);
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

const ColorOverlay = styled.div<{ $isVisible: boolean; $color?: string }>`
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  transition: opacity var(--transition-speed-fast) var(--transition-ease);
  background-color: ${({ $color }) => $color || "transparent"};
`;

const ImageOverlay = styled.div<{ $isVisible: boolean }>`
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  transition: opacity var(--transition-speed-fast) var(--transition-ease);

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
  const [showColorOverlay, setShowColorOverlay] = useState(true);
  const [showImageOverlay, setShowImageOverlay] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);

  const muxPlayerRef = useRef<any>(null);
  const closeTimeoutRef = useRef<number | null>(null);
  const colorToImageTimeoutRef = useRef<number | null>(null);
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

    // First transition out of fullscreen, then remove the project
    setIsFullScreen(false);

    if (isMobile) {
      setIsActive(false);
    }

    // if (activeProject?.project) {
    //   setActiveProject({
    //     project: activeProject.project,
    //     action: "hover",
    //   });

    //   if (closeTimeoutRef.current) {
    //     window.clearTimeout(closeTimeoutRef.current);
    //   }

    //   closeTimeoutRef.current = window.setTimeout(() => {
    //     setActiveProject({ project: null, action: "inactive" });
    //     closeTimeoutRef.current = null;
    //   }, 300);
    // } else {
    //   setActiveProject({ project: null, action: "inactive" });
    // }
  }, [activeProject, router, setActiveProject, setIsFullScreen, useCloseLink]);

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
      setShowColorOverlay(true);
      setShowImageOverlay(false);
      setIsVideoReady(false);
      isVideoReadyRef.current = false;
      if (colorToImageTimeoutRef.current) {
        window.clearTimeout(colorToImageTimeoutRef.current);
        colorToImageTimeoutRef.current = null;
      }
    } else {
      // Start with color overlay
      setShowColorOverlay(true);
      setShowImageOverlay(false);
      setIsVideoReady(false);
      isVideoReadyRef.current = false;

      // Clear any existing timeout
      if (colorToImageTimeoutRef.current) {
        window.clearTimeout(colorToImageTimeoutRef.current);
      }

      // After 0.5s, switch to image overlay
      colorToImageTimeoutRef.current = window.setTimeout(() => {
        setShowColorOverlay(false);
        setShowImageOverlay(true);
        colorToImageTimeoutRef.current = null;

        // If video is already ready, hide image overlay after it fades in
        if (isVideoReadyRef.current) {
          setTimeout(() => {
            setShowImageOverlay(false);
          }, 200);
        }
      }, 500);
    }

    return () => {
      if (colorToImageTimeoutRef.current) {
        window.clearTimeout(colorToImageTimeoutRef.current);
        colorToImageTimeoutRef.current = null;
      }
    };
  }, [
    activeProject?.project,
    activeProject?.project?.video?.asset?.playbackId,
  ]);

  useEffect(() => {
    if (!muxPlayerRef.current) return;
    muxPlayerRef.current.play();
  }, []);

  useEffect(() => {
    muxPlayerRef?.current?.play();
  }, []);

  useEffect(() => {
    const isActiveAction =
      activeProject.action === "hover" || activeProject.action === "fullscreen";
    setIsActive(isActiveAction);

    if (activeProject.action === "fullscreen") {
      setIsFullScreen(true);
    } else if (activeProject.action === "inactive") {
      setIsActive(false);
      setIsFullScreen(false);
    }
  }, [activeProject, setIsFullScreen]);

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
      if (colorToImageTimeoutRef.current) {
        window.clearTimeout(colorToImageTimeoutRef.current);
      }
    },
    []
  );

  useEffect(() => {
    if (!isActive) {
      setShowColorOverlay(true);
      setShowImageOverlay(false);
      setIsVideoReady(false);
      isVideoReadyRef.current = false;
      if (colorToImageTimeoutRef.current) {
        window.clearTimeout(colorToImageTimeoutRef.current);
        colorToImageTimeoutRef.current = null;
      }
    }
  }, [isActive]);

  const aspectRatioString =
    activeProject?.project?.video?.asset?.data?.aspect_ratio || "16:9";

  const thumbnailColor = activeProject?.project?.thumbnailColor?.hex;
  const fallbackImageUrl = activeProject?.project?.fallbackImage?.asset?.lores;

  const handleVideoReady = () => {
    setIsVideoReady(true);
    isVideoReadyRef.current = true;
    // If image overlay is visible, hide it after video fades in
    // Otherwise, it will be hidden when the timeout fires
    if (showImageOverlay) {
      // Wait for video to fade in before hiding image overlay to prevent gaps
      setTimeout(() => {
        setShowImageOverlay(false);
      }, 0);
    }
  };

  return (
    <AnimatePresence>
      {isActive && (
        <ProjectPlayerWrapper
          variants={wrapperVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          $isFullScreen={isFullScreen}
        >
          <Backdrop $isActive={isFullScreen} />
          <CreditsModal
            isOpen={isCreditsOpen}
            setIsOpen={setIsCreditsOpen}
            project={activeProject?.project}
          />
          <MobileProjectDetails
            project={activeProject?.project}
            isActive={isFullScreen}
          />
          <Outer $isFullScreen={isFullScreen}>
            <Ratio
              $aspectRatio={aspectRatioString}
              $isFullScreen={isFullScreen}
            >
              {/* {thumbnailColor && (
                <ColorOverlay
                  $isVisible={showColorOverlay}
                  $color={thumbnailColor}
                />
              )} */}
              {fallbackImageUrl && activeProject?.project && (
                <ImageOverlay $isVisible={showImageOverlay}>
                  <Image
                    src={fallbackImageUrl}
                    alt={activeProject.project.title || "Project poster"}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
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
                    thumbnailTime={1}
                    preload="auto"
                    muted={isMuted}
                    playsInline={true}
                    style={
                      {
                        "--media-object-fit": "contain",
                        aspectRatio: aspectRatioString.replace(":", " / "),
                        height: "100%",
                      } as CSSProperties
                    }
                    onPlaying={handleVideoReady}
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
