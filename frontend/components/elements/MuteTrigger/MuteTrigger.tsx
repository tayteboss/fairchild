import styled from "styled-components";
import pxToRem from "../../../utils/pxToRem";

type Props = {
  setIsMuted: (isMuted: boolean) => void;
  isMuted: boolean;
};

const MuteTriggerWrapper = styled.button`
  /* width: 47px; */
  color: var(--colour-white);
  text-align: center;
  font-family: var(--font-pressura-mono);
  font-size: ${pxToRem(11)};
  line-height: 1;
  font-weight: 400;
  text-transform: uppercase;
`;

const MuteTrigger = (props: Props) => {
  const { setIsMuted, isMuted } = props;

  return (
    <MuteTriggerWrapper
      className="type-small"
      onClick={() => setIsMuted(!isMuted)}
    >
      {isMuted ? "Unmute" : "Mute"}
    </MuteTriggerWrapper>
  );
};

export default MuteTrigger;
