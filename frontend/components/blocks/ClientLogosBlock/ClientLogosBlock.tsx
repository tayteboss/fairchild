import styled from "styled-components";
import pxToRem from "../../../utils/pxToRem";
import InfoLogo1 from "../../svgs/InfoLogo1";
import InfoLogo2 from "../../svgs/InfoLogo2";
import InfoLogo3 from "../../svgs/InfoLogo3";
import InfoLogo4 from "../../svgs/InfoLogo4";
import InfoLogo5 from "../../svgs/InfoLogo5";

const ClientLogosBlockWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${pxToRem(64)};
  align-items: center;
  max-width: ${pxToRem(600)};
  mix-blend-mode: difference;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    flex-direction: column;
    align-items: flex-start;
    gap: ${pxToRem(16)};
  }
`;

const LogoWrapper = styled.div`
  width: ${pxToRem(64)};
  height: ${pxToRem(64)};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ClientLogosBlock = () => {
  const logos = [InfoLogo1, InfoLogo2, InfoLogo3, InfoLogo4, InfoLogo5];

  return (
    <ClientLogosBlockWrapper>
      {logos.map((Logo, index) => (
        <LogoWrapper key={index}>
          <Logo />
        </LogoWrapper>
      ))}
    </ClientLogosBlockWrapper>
  );
};

export default ClientLogosBlock;
