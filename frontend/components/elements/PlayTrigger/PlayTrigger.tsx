import styled from "styled-components";
import pxToRem from "../../../utils/pxToRem";

type Props = {
  setIsPlaying: (isPlaying: boolean) => void;
  isPlaying: boolean;
  isMobile: boolean;
};

const PlayTriggerWrapper = styled.button`
  /* width: 43px; */
  color: var(--colour-white);
  text-align: center;
  font-family: var(--font-pressura-mono);
  font-size: ${pxToRem(11)};
  line-height: 1;
  font-weight: 400;
  text-transform: uppercase;
`;

const PlayTrigger = (props: Props) => {
  const { setIsPlaying, isPlaying, isMobile } = props;

  return (
    <PlayTriggerWrapper
      className="type-small"
      onClick={() => setIsPlaying(!isPlaying)}
    >
      {isPlaying ? "Pause" : "Play"}
    </PlayTriggerWrapper>
  );
};

export default PlayTrigger;
