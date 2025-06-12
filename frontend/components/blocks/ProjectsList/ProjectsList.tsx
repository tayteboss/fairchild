import styled from "styled-components";
import { ProjectType } from "../../../shared/types/types";
import ProjectHeader from "../../elements/ProjectHeader";
import pxToRem from "../../../utils/pxToRem";
import LayoutWrapper from "../../layout/LayoutWrapper";
import ProjectListCard from "../../elements/ProjectListCard";

const ProjectsListWrapper = styled.section`
  padding: ${pxToRem(130)} 0 calc(50lvh + 12px);
  mix-blend-mode: difference;
`;

const ProjectsWrapper = styled.div`
  display: flex;
  flex-direction: column;
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

  return (
    <ProjectsListWrapper>
      <LayoutWrapper>
        <ProjectHeader handleSort={handleSort} sortConfig={sortConfig} />
        <ProjectsWrapper>
          {hasProjects ? (
            [
              ...projects,
              ...projects,
              ...projects,
              ...projects,
              ...projects,
            ].map((project, index) => (
              <ProjectListCard
                key={index}
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
