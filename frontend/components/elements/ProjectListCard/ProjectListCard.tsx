import styled from "styled-components";
import LayoutGrid from "../../layout/LayoutGrid";
import { ProjectType } from "../../../shared/types/types";
import pxToRem from "../../../utils/pxToRem";
import FullScreenSvg from "../../svgs/FullScreenSvg";
import MuxPlayer from "@mux/mux-player-react/lazy";
import { useInView } from "react-intersection-observer";
import { AnimatePresence, motion } from "framer-motion";
import { memo, useRef, useEffect, useState } from "react";
import Image from "next/image";

const DesktopProjectListCardWrapper = styled.div`
  opacity: 0.4;
  cursor: pointer;
  padding: ${pxToRem(4)} 0;

  transition: all var(--transition-speed-fast) var(--transition-ease);

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    display: none;
  }

  &:hover {
    opacity: 1;

    .full-screen-trigger {
      opacity: 1;
    }
  }
`;

const Client = styled.p`
  grid-column: span 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Project = styled.p`
  grid-column: span 3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Type = styled.p`
  grid-column: span 2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Styles = styled.p`
  grid-column: span 4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Year = styled.p`
  grid-column: span 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const FullScreen = styled.button`
  grid-column: span 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${pxToRem(8)};
  opacity: 0;

  transition: all var(--transition-speed-fast) var(--transition-ease);

  svg {
    width: ${pxToRem(9)};
    height: ${pxToRem(9)};
  }

  &:hover {
    span {
      text-decoration: underline;
    }
  }
`;

const MobileProjectListCardWrapper = styled.div`
  display: none;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    display: flex;
    flex-direction: column;
    gap: ${pxToRem(4)};
    width: 100%;
    position: relative;
    z-index: 1;
  }
`;

const Inner = styled.div`
  position: relative;
  width: 100%;
  padding-top: 56.25%;
`;

const MediaWrapper = styled(motion.div)`
  position: absolute;
  inset: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;

  mux-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
`;

const FallbackImageOverlay = styled.div<{ $isVisible: boolean }>`
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

const ContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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
    },
  },
};

type Props = {
  project: ProjectType;
  setActiveProject: (project: {
    project: ProjectType | null;
    action: "hover" | "fullscreen" | "inactive";
  }) => void;
  isFullScreen: boolean;
  isActiveProject: boolean;
  activeProject: {
    project: ProjectType | null;
    action: "hover" | "fullscreen" | "inactive";
  };
};

const ProjectListCard = memo((props: Props) => {
  const { project, isFullScreen, setActiveProject, isActiveProject, activeProject } = props;

  const playerRef = useRef<any>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.25,
  });

  // Control playback based on active project and viewport visibility
  useEffect(() => {
    if (!playerRef.current) return;

    const player = playerRef.current;

    // If there's any active project, pause all ProjectListCard players
    if (activeProject.project) {
      player.pause();
    } else {
      // No active project - only play if in viewport
      if (inView) {
        player.play().catch(() => {
          // Silently handle play errors
        });
      } else {
        player.pause();
      }
    }
  }, [activeProject.project, inView]);

  // Reset video ready state when project changes
  useEffect(() => {
    setIsVideoReady(false);
  }, [project?.snippetVideo?.asset?.playbackId]);

  const handleVideoReady = () => {
    setIsVideoReady(true);
  };

  const handleMouseLeave = () => {
    // Don't set to inactive if this project is in fullscreen mode
    if (activeProject.project?.title === project.title && activeProject.action === "fullscreen") {
      return;
    }
    // Don't set to inactive if any project is in fullscreen mode
    if (isFullScreen || activeProject.action === "fullscreen") {
      return;
    }
    setActiveProject({ project: null, action: "inactive" });
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Set fullscreen immediately, preventing mouseLeave from interfering
    setActiveProject({ project: project, action: "fullscreen" });
  };

  const handleMouseDown = () => {
    // Set fullscreen on mousedown to prevent mouseLeave from interfering
    // This fires before mouseLeave, so we can set the state earlier
    setActiveProject({ project: project, action: "fullscreen" });
  };

  return (
    <>
      <DesktopProjectListCardWrapper
        onMouseOver={() => {
          // Don't set hover if already in fullscreen
          if (activeProject.project?.title === project.title && activeProject.action === "fullscreen") {
            return;
          }
          if (!isFullScreen && activeProject.action !== "fullscreen") {
            setActiveProject({ project: project, action: "hover" });
          }
        }}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
      >
        <LayoutGrid>
          <Client>{project.client || "N/A"}</Client>
          <Project>{project.title || "N/A"}</Project>
          <Type>{project.type[0].name || "N/A"}</Type>
          <Styles>
            {project.styles.map((style) => style.name).join(", ") || "N/A"}
          </Styles>
          <Year>{project.year || "N/A"}</Year>
          <FullScreen className="full-screen-trigger">
            <span>Full Screen</span> <FullScreenSvg />
          </FullScreen>
        </LayoutGrid>
      </DesktopProjectListCardWrapper>
      <MobileProjectListCardWrapper
        onClick={() =>
          setActiveProject({ project: project, action: "fullscreen" })
        }
      >
        <Inner ref={ref}>
          <MediaWrapper
            variants={wrapperVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {(() => {
              const fallbackImageUrl =
                project?.snippetFallbackImage?.asset?.url ||
                project?.fallbackImage?.asset?.lores ||
                project?.fallbackImage?.asset?.url;

              return (
                <>
                  {fallbackImageUrl && (
                    <FallbackImageOverlay $isVisible={!isVideoReady}>
                      <Image
                        src={fallbackImageUrl}
                        alt={project.title || "Project thumbnail"}
                        fill
                        sizes="(max-width: 1024px) 80vw, 50vw"
                        priority={false}
                      />
                    </FallbackImageOverlay>
                  )}
                  {project?.snippetVideo?.asset?.playbackId && (
                    <MuxPlayer
                      ref={playerRef}
                      streamType="on-demand"
                      playbackId={project.snippetVideo.asset.playbackId}
                      autoPlay="muted"
                      loop={true}
                      thumbnailTime={1}
                      preload="auto"
                      muted
                      loading="viewport"
                      maxResolution="720p"
                      playsInline={true}
                      onPlay={handleVideoReady}
                      style={{
                        opacity: isVideoReady ? 1 : 0,
                        transition: "opacity 0.2s ease",
                      }}
                    />
                  )}
                </>
              );
            })()}
          </MediaWrapper>
        </Inner>
        <ContentWrapper
          className={`view-element-fade-in ${
            inView ? "view-element-fade-in--in-view" : ""
          }`}
        >
          <Client>{project.client || "N/A"}</Client>
          <Project>{project.title || "N/A"}</Project>
        </ContentWrapper>
      </MobileProjectListCardWrapper>
    </>
  );
});

ProjectListCard.displayName = "ProjectListCard";

export default ProjectListCard;
