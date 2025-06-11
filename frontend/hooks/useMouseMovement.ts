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

  // Reset state when key changes
  useEffect(() => {
    setHasMoved(false);
    setInitialDelayComplete(false);
    setLastY(null);
  }, [key]);

  // Handle the initial delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialDelayComplete(true);
    }, initialDelay);

    return () => clearTimeout(timer);
  }, [initialDelay, key]);

  // Handle mouse movement
  useEffect(() => {
    if (!initialDelayComplete) return;

    const handleMouseMove = throttle((event: MouseEvent) => {
      if (hasMoved) return;

      // Set initial Y position if not set
      if (lastY === null) {
        setLastY(event.clientY);
        return;
      }

      // Check if cursor has moved beyond threshold
      if (Math.abs(event.clientY - lastY) > movementThreshold) {
        setHasMoved(true);
      }
    }, throttleMs);

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [
    initialDelayComplete,
    lastY,
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
