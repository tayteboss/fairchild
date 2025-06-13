import { useEffect, useState } from "react";
import throttle from "lodash/throttle";

interface UseMouseMovementOptions {
  initialDelay?: number;
  movementThreshold?: number;
  throttleMs?: number;
  key?: string | number;
}

export const useMouseMovement = ({
  initialDelay = 2000,
  movementThreshold = 5,
  throttleMs = 100,
  key,
}: UseMouseMovementOptions = {}) => {
  const [hasMoved, setHasMoved] = useState(false);
  const [initialDelayComplete, setInitialDelayComplete] = useState(false);
  const [lastY, setLastY] = useState<number | null>(null);
  const [lastScrollY, setLastScrollY] = useState<number | null>(null);

  // Reset state when key changes
  useEffect(() => {
    setHasMoved(false);
    setInitialDelayComplete(false);
    setLastY(null);
    setLastScrollY(null);
  }, [key]);

  // Handle the initial delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialDelayComplete(true);
    }, initialDelay);

    return () => clearTimeout(timer);
  }, [initialDelay, key]);

  // Handle mouse movement, scroll, click and touch
  useEffect(() => {
    if (!initialDelayComplete) return;

    const handleMovement = throttle((y: number, isScroll: boolean) => {
      if (hasMoved) return;

      // Set initial Y position if not set
      if (isScroll) {
        if (lastScrollY === null) {
          setLastScrollY(y);
          return;
        }
        // Check if scroll has moved beyond threshold
        if (Math.abs(y - lastScrollY) > movementThreshold) {
          setHasMoved(true);
        }
      } else {
        if (lastY === null) {
          setLastY(y);
          return;
        }
        // Check if cursor has moved beyond threshold
        if (Math.abs(y - lastY) > movementThreshold) {
          setHasMoved(true);
        }
      }
    }, throttleMs);

    const handleMouseMove = (event: MouseEvent) => {
      handleMovement(event.clientY, false);
    };

    const handleScroll = () => {
      handleMovement(window.scrollY, true);
    };

    const handleClick = () => {
      setHasMoved(true);
    };

    const handleTouch = () => {
      setHasMoved(true);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("click", handleClick);
    window.addEventListener("touchstart", handleTouch);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("touchstart", handleTouch);
    };
  }, [
    initialDelayComplete,
    lastY,
    lastScrollY,
    hasMoved,
    movementThreshold,
    throttleMs,
    key,
  ]);

  return {
    hasMoved,
    initialDelayComplete,
  };
};
