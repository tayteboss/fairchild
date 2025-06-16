import styled from "styled-components";
import { ProjectType } from "../../../shared/types/types";
import pxToRem from "../../../utils/pxToRem";

const MobileProjectDetailsWrapper = styled.div`
  display: none;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    display: flex;
    flex-direction: column;
    gap: ${pxToRem(8)};
    position: absolute;
    top: ${pxToRem(8)};
    left: ${pxToRem(8)};
    z-index: 2;
  }
`;

const Cell = styled.div``;

const Title = styled.p`
  opacity: 0.3;
  color: var(--colour-white);
`;

const Text = styled.p`
  color: var(--colour-white);
`;

type Props = {
  project: ProjectType;
  isActive: boolean;
};

const MobileProjectDetails = (props: Props) => {
  const { project, isActive } = props;

  return (
    <MobileProjectDetailsWrapper>
      {project?.client && (
        <Cell>
          <Title>Client</Title>
          <Text>{project.client}</Text>
        </Cell>
      )}
      {project?.title && (
        <Cell>
          <Title>Project</Title>
          <Text>{project.title}</Text>
        </Cell>
      )}
      {project?.type[0].name && (
        <Cell>
          <Title>Type</Title>
          <Text>{project.type[0].name}</Text>
        </Cell>
      )}
      {project?.styles.length > 0 && (
        <Cell>
          <Title>Style</Title>
          <Text>{project.styles.map((style) => style.name).join(", ")}</Text>
        </Cell>
      )}
      {project?.year && (
        <Cell>
          <Title>Year</Title>
          <Text>{project.year}</Text>
        </Cell>
      )}
    </MobileProjectDetailsWrapper>
  );
};

export default MobileProjectDetails;
