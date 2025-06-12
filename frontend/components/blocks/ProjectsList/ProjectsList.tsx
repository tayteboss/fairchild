import styled from "styled-components";
import { ProjectType } from "../../../shared/types/types";
import ProjectHeader from "../../elements/ProjectHeader";
import pxToRem from "../../../utils/pxToRem";
import LayoutWrapper from "../../layout/LayoutWrapper";
import LayoutGrid from "../../layout/LayoutGrid";
import ProjectListCard from "../../elements/ProjectListCard";

const ProjectsListWrapper = styled.section`
  padding-top: ${pxToRem(130)};
`;

const ProjectsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

type Props = {
  projects: ProjectType[];
};

const ProjectsList = (props: Props) => {
  const { projects } = props;

  const hasProjects = projects && projects.length > 0;

  return (
    <ProjectsListWrapper>
      <LayoutWrapper>
        <ProjectHeader />
        <ProjectsWrapper>
          {hasProjects ? (
            projects.map((project, index) => (
              <ProjectListCard key={index} project={project} />
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
