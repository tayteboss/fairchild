import styled from "styled-components";
import LayoutGrid from "../../layout/LayoutGrid";
import { ProjectType } from "../../../shared/types/types";
import pxToRem from "../../../utils/pxToRem";
import FullScreenSvg from "../../svgs/FullScreenSvg";
import MuxPlayer from "@mux/mux-player-react";

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

const MediaWrapper = styled.div`
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

type Props = {
  project: ProjectType;
  setActiveProject: (project: {
    project: ProjectType | null;
    action: "hover" | "fullscreen" | "inactive";
  }) => void;
  isFullScreen: boolean;
};

const ProjectListCard = (props: Props) => {
  const { project, isFullScreen, setActiveProject } = props;

  return (
    <>
      <DesktopProjectListCardWrapper
        onMouseOver={() =>
          setActiveProject({ project: project, action: "hover" })
        }
        onMouseLeave={() => {
          if (!isFullScreen) {
            setActiveProject({ project: null, action: "inactive" });
          }
        }}
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
        <Inner>
          <MediaWrapper>
            {project?.video?.asset?.playbackId && (
              <MuxPlayer
                streamType="on-demand"
                playbackId={project.video.asset.playbackId}
                autoPlay="muted"
                loop={true}
                thumbnailTime={1}
                preload="auto"
                muted
                playsInline={true}
                poster={project.fallbackImage.asset.url}
              />
            )}
          </MediaWrapper>
        </Inner>
        <ContentWrapper>
          <Client>{project.client || "N/A"}</Client>
          <Project>{project.title || "N/A"}</Project>
        </ContentWrapper>
      </MobileProjectListCardWrapper>
    </>
  );
};

export default ProjectListCard;
