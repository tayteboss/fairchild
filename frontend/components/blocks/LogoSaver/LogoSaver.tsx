import styled from "styled-components";
import WordmarkSvg from "../../svgs/WordmarkSvg";
import LayoutWrapper from "../../layout/LayoutWrapper";
import TestSvg from "../../svgs/TestSvg";

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
  return (
    <LogoSaverWrapper>
      <LayoutWrapper>
        <Inner>
          {/* <WordmarkSvg /> */}
          <TestSvg />
        </Inner>
      </LayoutWrapper>
    </LogoSaverWrapper>
  );
};

export default LogoSaver;
