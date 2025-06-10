import styled from "styled-components";
import pxToRem from "../../../utils/pxToRem";
import { useState } from "react";

const ThemeSwitchBlockWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${pxToRem(4)};
`;

const ColorBlock = styled.div<{
  $bgColor: string;
  $fgColor: string;
  $isActive: boolean;
}>`
  width: ${pxToRem(12)};
  height: ${pxToRem(12)};
  background: ${(props) => props.$bgColor};
  border: 0.5px solid
    ${(props) => (props.$isActive ? props.$fgColor : props.$bgColor)};
  cursor: crosshair;
`;

const ThemeSwitchBlock = () => {
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const colors = [
    {
      bg: "#000000",
      fg: "#FFFFFF",
    },
    {
      bg: "#9CA2A5",
      fg: "#CA1DD7",
    },
    {
      bg: "#F95B26",
      fg: "#2A27D9",
    },
    {
      bg: "#FFE7CD",
      fg: "#9CA2A5",
    },
    {
      bg: "#D3CC2F",
      fg: "#C65F16",
    },
  ];

  const handleThemeSwitch = (index: number) => {
    setActiveIndex(index);
    document.documentElement.style.setProperty("--colour-bg", colors[index].bg);
    document.documentElement.style.setProperty("--colour-fg", colors[index].fg);
  };

  return (
    <ThemeSwitchBlockWrapper>
      {colors.map((color, i) => (
        <ColorBlock
          key={i}
          $bgColor={color.bg}
          $fgColor={color.fg}
          $isActive={i === activeIndex}
          onMouseOver={() => handleThemeSwitch(i)}
        />
      ))}
    </ThemeSwitchBlockWrapper>
  );
};

export default ThemeSwitchBlock;
