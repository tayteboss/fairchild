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

const Styles = styled.p`
  grid-column: span 4;
`;

const Year = styled.button`
  grid-column: span 2;
  ${sharedStyles}
`;

type Props = {
  handleSort: (key: string) => void;
  sortConfig: {
    key: string;
    direction: string;
  };
};

const ProjectHeader = (props: Props) => {
  const { handleSort, sortConfig } = props;

  const getIndicatorType = (key: string) => {
    if (sortConfig.key !== key) {
      return "inactive";
    }
    return sortConfig.direction === "asc" ? "asc" : "dsc";
  };

  return (
    <ProjectHeaderWrapper>
      <LayoutGrid>
        <Client onClick={() => handleSort("client")}>
          <span>Client</span> <Indicator type={getIndicatorType("client")} />
        </Client>
        <Project onClick={() => handleSort("project")}>
          <span>Project</span> <Indicator type={getIndicatorType("project")} />
        </Project>
        <Type onClick={() => handleSort("type")}>
          <span>Type</span> <Indicator type={getIndicatorType("type")} />
        </Type>
        <Styles>
          <span>Styles</span>
        </Styles>
        <Year onClick={() => handleSort("year")}>
          <span>Year</span> <Indicator type={getIndicatorType("year")} />
        </Year>
      </LayoutGrid>
    </ProjectHeaderWrapper>
  );
};

export default ProjectHeader;
