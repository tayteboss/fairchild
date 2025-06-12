import styled from "styled-components";
import pxToRem from "../../../utils/pxToRem";
import Link from "next/link";

const CreditsBlockWrapper = styled.div`
  display: flex;
  gap: ${pxToRem(16)};
  mix-blend-mode: difference;
`;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${pxToRem(8)};
  justify-content: center;
  align-items: center;
  text-align: center;
  width: ${pxToRem(300)};
  flex: 1;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    width: auto;
  }

  a {
    text-transform: initial !important;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Title = styled.h3`
  text-transform: uppercase;
`;

const CreditsBlock = () => {
  return (
    <CreditsBlockWrapper>
      <Block>
        <Title>Design</Title>
        <Link href="https://www.bienstudio.com.au/" target="_blank">
          Bien Studio
        </Link>
      </Block>
      <Block>
        <Title>Development</Title>
        <Link href="https://tayte.co/" target="_blank">
          Tayte.co
        </Link>
      </Block>
    </CreditsBlockWrapper>
  );
};

export default CreditsBlock;
