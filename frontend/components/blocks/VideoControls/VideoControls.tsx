import { useEffect, useState } from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import throttle from "lodash.throttle";
import useViewportWidth from "../../../hooks/useViewportWidth";
import ControlsPanel from "../ControlsPanel";
import useWindowDimensions from "../../../hooks/useWindowDimensions";
import LayoutWrapper from "../../layout/LayoutWrapper";
import LayoutGrid from "../../layout/LayoutGrid";
import pxToRem from "../../../utils/pxToRem";

const VideoControlsWrapper = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  z-index: 4;
  color: var(--colour-white);
  mix-blend-mode: difference;
`;

const Inner = styled(motion.div)`
  width: 100%;
  height: 100%;
  padding: 0 ${pxToRem(16)};
`;

const CreditsTrigger = styled.button`
  grid-column: 3 / 4;
  text-align: left;
  color: var(--colour-white);
`;

const MuteTrigger = styled.button`
  grid-column: -4 / -3;
  text-align: right;
  color: var(--colour-white);
`;

const wrapperVariants = {
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
      delay: 0.6,
    },
  },
};

const innerVariants = {
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

type Props = {
  isMuted: boolean;
  currentTime: number;
  videoLength: number | undefined;
  isFullScreen: boolean;
  setIsMuted: (isMuted: boolean) => void;
  handleSeek: (time: number) => void;
  handleClose: () => void;
  setIsCreditsOpen: (isCreditsOpen: boolean) => void;
};

const VideoControls = (props: Props) => {
  const {
    isMuted,
    currentTime,
    videoLength,
    isFullScreen,
    setIsMuted,
    handleSeek,
    handleClose,
    setIsCreditsOpen,
  } = props;

  const [isActive, setIsActive] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const viewportWidth = useViewportWidth();
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (viewportWidth === "tabletPortrait" || viewportWidth === "mobile") {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, [viewportWidth]);

  useEffect(() => {
    let timeout: any;

    const body = document.querySelector("body");

    if (!body) return;

    if (!isActive) {
      body.classList.add("hide-cursor");
    } else {
      body.classList.remove("hide-cursor");
    }

    const handleMouseInactive = () => {
      if (width < 1125) {
        setIsActive(true);
        return;
      }

      timeout = setTimeout(
        () => {
          setIsActive(false);
        },
        isMobile ? 6000 : 2000
      );
    };

    // Call handleMouseInactive initially
    handleMouseInactive();

    const handleMouseActive = () => {
      if (width < 1125) {
        setIsActive(true);
        return;
      }

      clearTimeout(timeout);
      setIsActive(true);

      // Restart the timer when the mouse becomes active again
      handleMouseInactive();
    };

    const throttledHandleMouseMove = throttle(handleMouseActive, 200);
    window.addEventListener("mousemove", throttledHandleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseActive);
      clearTimeout(timeout);
    };
  }, [isActive, width]);

  return (
    <AnimatePresence>
      {isFullScreen && (
        <VideoControlsWrapper
          variants={wrapperVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          key={1}
        >
          <AnimatePresence>
            {isActive && (
              <Inner
                variants={innerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                key={2}
              >
                <LayoutGrid>
                  <CreditsTrigger onClick={() => setIsCreditsOpen(true)}>
                    Credits
                  </CreditsTrigger>
                  <MuteTrigger onClick={() => setIsMuted(!isMuted)}>
                    {isMuted ? "Unmute" : "Mute"}
                  </MuteTrigger>
                </LayoutGrid>
                <ControlsPanel
                  currentTime={currentTime}
                  videoLength={videoLength}
                  handleSeek={handleSeek}
                />
              </Inner>
            )}
          </AnimatePresence>
        </VideoControlsWrapper>
      )}
    </AnimatePresence>
  );
};

export default VideoControls;
