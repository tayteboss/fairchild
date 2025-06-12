import styled from "styled-components";
import pxToRem from "../../../utils/pxToRem";
import SeekBar from "../../elements/SeekBar";
import TimeDisplay from "../../elements/TimeDisplay";

const ControlsPanelWrapper = styled.div`
  width: ${pxToRem(500)};
  max-width: 60vw;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: space-between;
  gap: ${pxToRem(12)};
`;

type Props = {
  currentTime: number;
  videoLength: number | undefined;
  handleSeek: (time: number) => void;
};

const ControlsPanel = (props: Props) => {
  const { currentTime, videoLength, handleSeek } = props;

  return (
    <ControlsPanelWrapper>
      <TimeDisplay currentTime={currentTime} useCurrentTime={true} />
      <SeekBar
        videoLength={videoLength}
        currentTime={currentTime}
        handleSeek={handleSeek}
      />
      <TimeDisplay totalTime={videoLength} />
    </ControlsPanelWrapper>
  );
};

export default ControlsPanel;
