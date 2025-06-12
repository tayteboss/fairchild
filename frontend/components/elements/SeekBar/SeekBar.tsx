import React from "react";
import styled from "styled-components";

const SeekBarWrapper = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
`;

const SeekBarInner = styled.div`
  position: relative;
  width: 100%;
  height: 15px;
  cursor: pointer;
`;

const FullBar = styled.div`
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  z-index: 1;
  background: var(--colour-white);
  opacity: 0.5;
  width: 100%;
  height: 1px;

  transition: width 300ms linear;
`;

const CurrentTimeBar = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  z-index: 2;
  height: 1px;
  position: relative;
  border-top: 1px dotted var(--colour-white);
  border-top-style: dotted;
  border-top-width: 1px;
  border-image: repeating-linear-gradient(
      90deg,
      var(--colour-white) 0 2px,
      transparent 1px 5px
    )
    1;

  will-change: width;
  transition: width 300ms linear;

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    right: -1px;
    transform: translate(-50%, -50%);
    width: 1px;
    height: 16px;
    background: var(--colour-white);
  }
`;

type Props = {
  currentTime: number;
  videoLength: number | undefined;
  handleSeek: (time: number) => void;
};

const SeekBar = (props: Props) => {
  const { currentTime, videoLength, handleSeek } = props;

  const currentTimePercentage = videoLength
    ? (currentTime / videoLength) * 100
    : 0;

  const handleSeekBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = e.currentTarget;
    const clickX = e.clientX - bar.getBoundingClientRect().left;

    const newTime = videoLength ? (clickX / bar.clientWidth) * videoLength : 0;
    handleSeek(newTime);
  };

  return (
    <SeekBarWrapper>
      <SeekBarInner onClick={handleSeekBarClick}>
        <FullBar
          style={{
            width: `${100 - currentTimePercentage}%`,
          }}
        />
        <CurrentTimeBar style={{ width: `${currentTimePercentage}%` }} />
      </SeekBarInner>
    </SeekBarWrapper>
  );
};

export default SeekBar;
