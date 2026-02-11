import styled from "styled-components";
import pxToRem from "../../../utils/pxToRem";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const ThemeSwitchBlockWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${pxToRem(4)};

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    gap: ${pxToRem(8)};
  }
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

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    width: ${pxToRem(16)};
    height: ${pxToRem(16)};
  }
`;

export const themeColors = [
  {
    bg: "#000000",
    fg: "#FFFFFF",
  },
  {
    bg: "#4f0a0a",
    fg: "#D249BB",
  },
  {
    bg: "#F1874A",
    fg: "#544600",
  },
  {
    bg: "#DCFDFF",
    fg: "#828490",
  },
  {
    bg: "#B178FF",
    fg: "#460D51",
  },
];

const ThemeSwitchBlock = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const router = useRouter();

  const handleThemeSwitch = (index: number) => {
    setActiveIndex(index);
    document.documentElement.style.setProperty(
      "--colour-bg",
      themeColors[index].bg
    );
    document.documentElement.style.setProperty(
      "--colour-fg",
      themeColors[index].fg
    );
  };

  return (
    <ThemeSwitchBlockWrapper>
      {themeColors.map((color, i) => (
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
