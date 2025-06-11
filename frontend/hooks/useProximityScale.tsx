import { useRef, useEffect, useState } from "react";
import { useMousePosition } from "./useMousePosition";

interface UseProximityScaleProps {
  maxScale?: number;
  minScale?: number;
  proximityRadius?: number;
}

export const useProximityScale = ({
  maxScale = 1,
  minScale = 0.5,
  proximityRadius = 300,
}: UseProximityScaleProps = {}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const { x: mouseX, y: mouseY } = useMousePosition();
  const [scale, setScale] = useState(minScale);

  useEffect(() => {
    if (!elementRef.current || mouseX === null || mouseY === null) return;

    const element = elementRef.current;
    const rect = element.getBoundingClientRect();

    // Calculate center point of the element
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate distance between cursor and element center
    const distance = Math.sqrt(
      Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2)
    );

    // Calculate scale based on distance
    const newScale = Math.max(
      minScale,
      Math.min(
        maxScale,
        maxScale - (distance / proximityRadius) * (maxScale - minScale)
      )
    );

    setScale(newScale);
  }, [mouseX, mouseY, maxScale, minScale, proximityRadius]);

  return { elementRef, scale };
};
