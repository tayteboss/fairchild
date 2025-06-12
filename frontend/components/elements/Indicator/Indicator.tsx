import styled from "styled-components";

const IndicatorWrapper = styled.div``;

type Props = {
  isAscending: boolean;
};

const Indicator = (props: Props) => {
  const { isAscending } = props;

  return <IndicatorWrapper>[{isAscending ? "↑" : "↓"}]</IndicatorWrapper>;
};

export default Indicator;
