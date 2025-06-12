import styled, { css } from "styled-components";
import LayoutWrapper from "../../layout/LayoutWrapper";
import LayoutGrid from "../../layout/LayoutGrid";
import Indicator from "../Indicator";
import pxToRem from "../../../utils/pxToRem";

const sharedStyles = css`
  display: flex;
  align-items: center;
  gap: ${pxToRem(4)};

  &:hover {
    span {
      text-decoration: underline;
    }
  }
`;

const ProjectHeaderWrapper = styled.div`
  margin-bottom: ${pxToRem(8)};
`;

const Client = styled.button`
  grid-column: span 1;
  ${sharedStyles}
`;

const Project = styled.button`
  grid-column: span 3;
  ${sharedStyles}
`;

const Type = styled.button`
  grid-column: span 2;
  ${sharedStyles}
`;

const Styles = styled.button`
  grid-column: span 4;
  ${sharedStyles}
`;

const Year = styled.button`
  grid-column: span 2;
  ${sharedStyles}
`;

const ProjectHeader = () => {
  return (
    <ProjectHeaderWrapper>
      <LayoutGrid>
        <Client>
          <span>Client</span> <Indicator isAscending={true} />
        </Client>
        <Project>
          <span>Project</span> <Indicator isAscending={false} />
        </Project>
        <Type>
          <span>Type</span> <Indicator isAscending={true} />
        </Type>
        <Styles>
          <span>Styles</span> <Indicator isAscending={true} />
        </Styles>
        <Year>
          <span>Year</span> <Indicator isAscending={true} />
        </Year>
      </LayoutGrid>
    </ProjectHeaderWrapper>
  );
};

export default ProjectHeader;
