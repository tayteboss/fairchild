import styled from "styled-components";

const IndicatorWrapper = styled.div``;

type Props = {
  type: "asc" | "dsc" | "inactive";
};

const Indicator = (props: Props) => {
  const { type } = props;

  return (
    <IndicatorWrapper>
      [{type === "asc" ? "↑" : type === "dsc" ? "↓" : "·"}]
    </IndicatorWrapper>
  );
};

export default Indicator;
