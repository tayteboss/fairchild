import styled from "styled-components";
import pxToRem from "../../../utils/pxToRem";
import { useRef, useState, useCallback, useEffect } from "react";

const SliderContainer = styled.div<{ $isDragging?: boolean }>`
  position: relative;
  width: 100%;
  cursor: ${({ $isDragging }) =>
    $isDragging ? "grabbing" : "default"} !important;
`;

const SliderTrack = styled.div`
  position: absolute;
  height: 1px;
  width: 100%;
  z-index: 1;
  border-top: 1px dotted var(--colour-fg);
  border-top-style: dotted;
  border-top-width: 1px;
  border-image: repeating-linear-gradient(
      90deg,
      var(--colour-fg) 0 2px,
      transparent 1px 5px
    )
    1;
`;

const SliderRange = styled.div`
  position: absolute;
  height: 1px;
  background-color: var(--colour-fg);
  z-index: 2;
`;

const SliderValue = styled.div``;

const SliderLeftValue = styled(SliderValue)``;

const SliderRightValue = styled(SliderValue)``;

const Thumb = styled.input<{ $isDragging?: boolean }>`
  pointer-events: none;
  position: absolute;
  height: 0;
  width: 100%;
  outline: none;
  -webkit-appearance: none;
  -webkit-tap-highlight-color: transparent;
  padding: 1px 0 0 0;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    cursor: ${({ $isDragging }) =>
      $isDragging ? "grabbing" : "grab"} !important;
    height: 16px;
    width: 13px;
    border-right: 6px solid var(--colour-bg);
    border-left: 6px solid var(--colour-bg);
    pointer-events: all;
    position: relative;
    background: var(--colour-fg);
  }

  &::-moz-range-thumb {
    -webkit-appearance: none;
    cursor: ${({ $isDragging }) =>
      $isDragging ? "grabbing" : "grab"} !important;
    height: 16px;
    width: 13px;
    border-right: 6px solid var(--colour-bg);
    border-left: 6px solid var(--colour-bg);
    pointer-events: all;
    position: relative;
    background: var(--colour-fg);
  }
`;

const ThumbLeft = styled(Thumb)<{ $isDragging?: boolean }>`
  z-index: 3;
`;

const ThumbRight = styled(Thumb)<{ $isDragging?: boolean }>`
  z-index: 4;
`;

const SliderLabel = styled.p`
  color: var(--colour-fg);
`;

const LabelWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${pxToRem(16)};
`;

const Values = styled.div`
  display: flex;
  gap: ${pxToRem(10)};
`;

type MultiRangeSliderProps = {
  min: number;
  max: number;
  onChange: (value: { min: number; max: number }) => void;
  label: string;
  symbol?: string;
  setIsDragging?: (isDragging: boolean) => void;
  value: { min: number; max: number };
  step?: number;
};

const MultiRangeSlider = ({
  min,
  max,
  onChange,
  label,
  symbol,
  setIsDragging,
  value,
  step = 1,
}: MultiRangeSliderProps) => {
  const [minVal, setMinVal] = useState(value.min);
  const [maxVal, setMaxVal] = useState(value.max);
  const minValRef = useRef(min);
  const maxValRef = useRef(max);
  const range = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Update refs when value prop changes
  useEffect(() => {
    minValRef.current = value.min;
    maxValRef.current = value.max;
    setMinVal(value.min);
    setMaxVal(value.max);
  }, [value]);

  // Initial width calculation and updates
  useEffect(() => {
    const updateRangeWidth = () => {
      const minPercent = getPercent(minVal);
      const maxPercent = getPercent(maxVal);

      if (range.current) {
        range.current.style.left = `${minPercent}%`;
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    };

    updateRangeWidth();
  }, [minVal, maxVal, getPercent]);

  useEffect(() => {
    onChange({ min: minVal, max: maxVal });
  }, [minVal, maxVal, onChange]);

  // Handle document-level mouse up
  useEffect(() => {
    const handleMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        setIsDragging?.(false);
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [setIsDragging]);

  const handleMouseDown = () => {
    isDraggingRef.current = true;
    setIsDragging?.(true);
  };

  return (
    <SliderContainer $isDragging={isDraggingRef.current}>
      <LabelWrapper>
        <SliderLabel>{label}</SliderLabel>
        <Values>
          <SliderLeftValue>{minVal}</SliderLeftValue>-
          <SliderRightValue>
            {maxVal}
            {symbol || ""}
          </SliderRightValue>
        </Values>
      </LabelWrapper>
      <ThumbLeft
        type="range"
        min={min}
        max={max}
        value={minVal}
        $isDragging={isDraggingRef.current}
        onMouseDown={handleMouseDown}
        step={step}
        onChange={(event) => {
          const value = Math.min(Number(event.target.value), maxVal - 1);
          setMinVal(value);
          minValRef.current = value;
        }}
        style={{ zIndex: minVal > max - 100 ? 5 : 3 }}
      />
      <ThumbRight
        type="range"
        min={min}
        max={max}
        value={maxVal}
        $isDragging={isDraggingRef.current}
        onMouseDown={handleMouseDown}
        step={step}
        onChange={(event) => {
          const value = Math.max(Number(event.target.value), minVal + 1);
          setMaxVal(value);
          maxValRef.current = value;
        }}
      />
      <SliderTrack />
      <SliderRange ref={range} />
    </SliderContainer>
  );
};

export default MultiRangeSlider;
