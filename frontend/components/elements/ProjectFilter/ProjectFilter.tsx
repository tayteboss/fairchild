import styled from "styled-components";
import pxToRem from "../../../utils/pxToRem";

const ProjectFilterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${pxToRem(24)};
`;

const Title = styled.h3`
  text-align: center;
`;

const OptionsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${pxToRem(8)};
  justify-content: center;
`;

const Option = styled.button<{ $isActive: boolean }>`
  padding: ${pxToRem(4)} ${pxToRem(8)};
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: ${pxToRem(8)};
  background: ${({ $isActive }) =>
    $isActive ? "var(--colour-fg)" : "transparent"};
  color: ${({ $isActive }) =>
    $isActive ? "var(--colour-bg)" : "var(--colour-fg)"};

  transition: all var(--transition-speed-fast) var(--transition-ease);

  &:hover {
    border: 1px solid rgba(255, 255, 255, 1);
  }
`;

type Props = {
  title: string;
  options: { name: string }[];
  selectedOptions: string[];
  setSelectedOptions: (options: string[]) => void;
};

const ProjectFilter = (props: Props) => {
  const { title, options, selectedOptions, setSelectedOptions } = props;

  const hasOptions = options && options.length > 0;

  const handleOptionClick = (optionName: string) => {
    if (selectedOptions.includes(optionName)) {
      setSelectedOptions(selectedOptions.filter((o) => o !== optionName));
    } else {
      setSelectedOptions([...selectedOptions, optionName]);
    }
  };

  const handleAllClick = () => {
    setSelectedOptions([]);
  };

  return (
    <ProjectFilterWrapper>
      <Title>{title}</Title>
      <OptionsList>
        <Option
          key="all"
          onClick={handleAllClick}
          $isActive={selectedOptions.length === 0}
        >
          All
        </Option>
        {hasOptions &&
          options.map((option) => (
            <Option
              key={option.name}
              onClick={() => handleOptionClick(option.name)}
              $isActive={selectedOptions.includes(option.name)}
            >
              {option.name}
            </Option>
          ))}
      </OptionsList>
    </ProjectFilterWrapper>
  );
};

export default ProjectFilter;
