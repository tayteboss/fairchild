import styled from "styled-components";
import pxToRem from "../../../utils/pxToRem";
import Link from "next/link";
import { InformationPageType } from "../../../shared/types/types";

const LinksBlockWrapper = styled.div`
  display: flex;
  gap: ${pxToRem(16)};
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

type Props = {
  email: InformationPageType["email"];
  instagramHandle: InformationPageType["instagramHandle"];
  instagramLink: InformationPageType["instagramLink"];
};

const LinksBlock = (props: Props) => {
  const { email, instagramHandle, instagramLink } = props;

  return (
    <LinksBlockWrapper>
      <Block>
        <Title>Email</Title>
        <Link href={`mailto:${email}`}>{email}</Link>
      </Block>
      <Block>
        <Title>Socials</Title>
        <Link href={instagramLink} target="_blank">
          {instagramHandle}
        </Link>
      </Block>
    </LinksBlockWrapper>
  );
};

export default LinksBlock;
