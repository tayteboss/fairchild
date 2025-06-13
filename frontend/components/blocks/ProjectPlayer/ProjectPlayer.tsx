import styled from "styled-components";
import { ProjectType } from "../../../shared/types/types";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import pxToRem from "../../../utils/pxToRem";
import VideoControls from "../VideoControls";
import CreditsModal from "../CreditsModal";

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
    bottom: 50%;
    left: 50%;
    transform: translate(-50%, 50%);
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  transition: all var(--transition-speed-slow) var(--transition-ease);
`;

const Ratio = styled.div`
  position: relative;
  width: 100%;
  padding-top: 56.25%;
`;

const Inner = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;

  mux-player {
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
};

const ProjectPlayer = (props: Props) => {
  const { activeProject, isFullScreen, setIsFullScreen, setActiveProject } =
    props;

  const [isActive, setIsActive] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoLength, setVideoLength] = useState(
    activeProject?.project?.video?.asset?.data?.duration || 0
  );
  const [isCreditsOpen, setIsCreditsOpen] = useState(false);

  const muxPlayerRef = useRef<any>(null);

  const handleSeek = (time: number) => {
    if (muxPlayerRef?.current) {
      muxPlayerRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleClose = () => {
    setIsFullScreen(false);
    setActiveProject({ project: null, action: "inactive" });
  };

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
  }, [activeProject]);

  useEffect(() => {
    if (!isFullScreen) {
      setIsMuted(true);
    }
  }, [isFullScreen]);

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
          <Outer $isFullScreen={isFullScreen}>
            <Ratio>
              <Inner>
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
                {activeProject?.project?.video.asset.playbackId && (
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
                    poster={
                      activeProject?.project?.fallbackImage?.asset.metadata.lqip
                    }
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
