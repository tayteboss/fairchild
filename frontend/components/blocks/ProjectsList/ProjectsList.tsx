import styled from "styled-components";
import { ProjectType } from "../../../shared/types/types";
import ProjectHeader from "../../elements/ProjectHeader";
import pxToRem from "../../../utils/pxToRem";
import LayoutWrapper from "../../layout/LayoutWrapper";
import ProjectListCard from "../../elements/ProjectListCard";
import useViewportWidth from "../../../hooks/useViewportWidth";
import { useState } from "react";
import MobileProjectPlayer from "../MobileProjectPlayer";

const ProjectsListWrapper = styled.section`
  padding: ${pxToRem(130)} 0 calc(50lvh + 12px);
  mix-blend-mode: difference;
`;

const ProjectsWrapper = styled.div`
  display: flex;
  flex-direction: column;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    gap: ${pxToRem(24)};
  }
`;

type Props = {
  projects: ProjectType[];
  handleSort: (key: string) => void;
  sortConfig: {
    key: string;
    direction: string;
  };
  setActiveProject: (project: {
    project: ProjectType | null;
    action: "hover" | "fullscreen" | "inactive";
  }) => void;
  isFullScreen: boolean;
};

const ProjectsList = (props: Props) => {
  const { projects, handleSort, sortConfig, setActiveProject, isFullScreen } =
    props;

  const hasProjects = projects && projects.length > 0;

  const viewport = useViewportWidth();
  const isMobile = viewport === "mobile" || viewport === "tabletPortrait";

  return (
    <ProjectsListWrapper>
      <LayoutWrapper>
        <ProjectHeader handleSort={handleSort} sortConfig={sortConfig} />
        <ProjectsWrapper>
          {hasProjects ? (
            (isMobile
              ? projects
              : [...projects, ...projects, ...projects, ...projects]
            ).map((project, index) => (
              <ProjectListCard
                key={isMobile ? `mobile-${index}` : `desktop-${index}`}
                project={project}
                setActiveProject={setActiveProject}
                isFullScreen={isFullScreen}
              />
            ))
          ) : (
            <p>No projects found</p>
          )}
        </ProjectsWrapper>
      </LayoutWrapper>
    </ProjectsListWrapper>
  );
};

export default ProjectsList;
