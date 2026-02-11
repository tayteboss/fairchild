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

const ThemeSwitchBlock = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const router = useRouter();

  const colors = [
    {
      bg: "#000000",
      fg: "#FFFFFF",
    },
    {
      bg: "#511B1B",
      fg: "#D249BB",
    },
    {
      bg: "#F1874A",
      fg: "#BF2C25",
    },
    {
      bg: "#DCFDFF",
      fg: "#898989",
    },
    {
      bg: "#A869FF",
      fg: "#511D0D",
    },
  ];

  const handleThemeSwitch = (index: number) => {
    setActiveIndex(index);
    document.documentElement.style.setProperty("--colour-bg", colors[index].bg);
    document.documentElement.style.setProperty("--colour-fg", colors[index].fg);
  };

  useEffect(() => {
    document.documentElement.style.setProperty("--colour-bg", colors[0].bg);
    document.documentElement.style.setProperty("--colour-fg", colors[0].fg);
  }, [router]);

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
