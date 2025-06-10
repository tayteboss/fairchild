import styled from "styled-components";
import WordmarkSvg from "../../svgs/WordmarkSvg";
import LayoutWrapper from "../../layout/LayoutWrapper";
import { useEffect, useState } from "react";
import { useMousePosition } from "../../../hooks/useMousePosition";

const LogoSaverWrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100lvh;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 100%;
    height: auto;
  }
`;

const Inner = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LogoSaver = () => {
  const [isVisible, setIsVisible] = useState(true);
  const { y } = useMousePosition();
  const [hasMoved, setHasMoved] = useState(false);
  const [initialDelayComplete, setInitialDelayComplete] = useState(false);

  useEffect(() => {
    // Start the initial 2-second timer
    const initialTimer = setTimeout(() => {
      setInitialDelayComplete(true);
    }, 2000);

    // Start the flashing interval
    const interval = setInterval(() => {
      setIsVisible((prev) => !prev);
    }, 250);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (y !== null && initialDelayComplete) {
      setHasMoved(true);
    }
  }, [y, initialDelayComplete]);

  if (hasMoved) return null;

  return (
    <LogoSaverWrapper>
      <LayoutWrapper>
        <Inner>{isVisible && <WordmarkSvg />}</Inner>
      </LayoutWrapper>
    </LogoSaverWrapper>
  );
};

export default LogoSaver;
