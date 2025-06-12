import styled from "styled-components";
import LayoutGrid from "../../layout/LayoutGrid";
import { ProjectType } from "../../../shared/types/types";
import pxToRem from "../../../utils/pxToRem";
import FullScreenSvg from "../../svgs/FullScreenSvg";

const ProjectListCardWrapper = styled.div`
  opacity: 0.4;
  cursor: pointer;
  padding: ${pxToRem(4)} 0;

  transition: all var(--transition-speed-fast) var(--transition-ease);

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
    <ProjectListCardWrapper
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
    </ProjectListCardWrapper>
  );
};

export default ProjectListCard;
