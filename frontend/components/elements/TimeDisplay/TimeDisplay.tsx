import React, { useEffect, useState } from "react";
import styled from "styled-components";
import pxToRem from "../../../utils/pxToRem";

const TimeDisplayWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  column-gap: ${pxToRem(4)};
  color: var(--colour-white);

  @media ${(props) => props.theme.mediaBreakpoints.mobile} {
    display: none;
  }

  span {
    font-family: var(--font-pressura-mono);
    font-size: ${pxToRem(11)};
    line-height: 1;
    font-weight: 400;
    text-transform: uppercase;
    color: var(--colour-white);
  }
`;

type Props = {
  currentTime?: number;
  useCurrentTime?: boolean;
  totalTime?: number;
};

const TimeDisplay = (props: Props) => {
  const { currentTime, totalTime, useCurrentTime } = props;
  const [currentTimeFormatted, setCurrentTimeFormated] = useState("00:00");
  const [totalTimeFormatted, setTotalTimeFormatted] = useState("00:00");

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  useEffect(() => {
    if (currentTime && useCurrentTime) {
      const formattedTime = formatTime(Math.floor(currentTime));
      setCurrentTimeFormated(formattedTime);
    }
  }, [currentTime, useCurrentTime]);

  useEffect(() => {
    if (totalTime) {
      const formattedTime = formatTime(Math.floor(totalTime));
      setTotalTimeFormatted(formattedTime);
    }
  }, [totalTime]);

  return (
    <TimeDisplayWrapper>
      {useCurrentTime ? (
        <span className="type-small">{currentTimeFormatted}</span>
      ) : (
        <span className="type-small">{totalTimeFormatted}</span>
      )}
    </TimeDisplayWrapper>
  );
};

export default TimeDisplay;
