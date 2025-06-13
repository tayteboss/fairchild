import styled from "styled-components";
import WordmarkSvg from "../../svgs/WordmarkSvg";
import LayoutWrapper from "../../layout/LayoutWrapper";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useMouseMovement } from "../../../hooks/useMouseMovement";
import GraphicOneSvg from "../../svgs/GraphicOneSvg";
import GraphicTwoSvg from "../../svgs/GraphicTwoSvg";

const graphicSvgs = [GraphicOneSvg, GraphicTwoSvg, WordmarkSvg];

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
  z-index: 1000;

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
  const [isAnimating, setIsAnimating] = useState(true);
  const router = useRouter();
  const [CurrentSvg, setCurrentSvg] = useState<React.ElementType>(
    () => WordmarkSvg
  );
  const lastIndexRef = useRef<number | null>(null);

  // Reset state on route change
  useEffect(() => {
    const handleRouteChange = () => {
      setIsVisible(true);
      setIsAnimating(true);

      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * graphicSvgs.length);
      } while (graphicSvgs.length > 1 && newIndex === lastIndexRef.current);
      lastIndexRef.current = newIndex;
      setCurrentSvg(() => graphicSvgs[newIndex]);
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router]);

  // Handle the flashing animation
  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setIsVisible((prev) => !prev);
    }, 250);

    return () => {
      clearInterval(interval);
    };
  }, [isAnimating]);

  // Use mouse movement hook with key to force reset on route changes
  const { hasMoved } = useMouseMovement({
    initialDelay: 2000,
    movementThreshold: 5,
    throttleMs: 100,
    key: router.asPath, // Add key to force hook reset on route change
  });

  // Stop animation when mouse moves
  useEffect(() => {
    if (hasMoved) {
      setIsAnimating(false);
    }
  }, [hasMoved]);

  if (hasMoved) return null;

  return (
    <LogoSaverWrapper>
      <LayoutWrapper>
        <Inner>{isVisible && <CurrentSvg />}</Inner>
      </LayoutWrapper>
    </LogoSaverWrapper>
  );
};

export default LogoSaver;
