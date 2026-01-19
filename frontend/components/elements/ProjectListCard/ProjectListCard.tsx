import styled from "styled-components";
import LayoutGrid from "../../layout/LayoutGrid";
import { ProjectType } from "../../../shared/types/types";
import pxToRem from "../../../utils/pxToRem";
import FullScreenSvg from "../../svgs/FullScreenSvg";
import MuxPlayer from "@mux/mux-player-react/lazy";
import { useInView } from "react-intersection-observer";
import { AnimatePresence, motion } from "framer-motion";
import { memo, useRef, useEffect } from "react";

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

  return (
    <>
      <DesktopProjectListCardWrapper
        onMouseOver={() =>
          setActiveProject({ project: project, action: "hover" })
        }
        onMouseLeave={() =>
          setActiveProject({ project: null, action: "inactive" })
        }
        onClick={() =>
          setActiveProject({ project: project, action: "fullscreen" })
        }
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
          <AnimatePresence>
            {inView && (
              <MediaWrapper
                variants={wrapperVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
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
                    maxResolution="720p"
                    playsInline={true}
                    poster={project.fallbackImage.asset.url}
                  />
                )}
              </MediaWrapper>
            )}
          </AnimatePresence>
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
