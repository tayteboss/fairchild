import styled from "styled-components";
import pxToRem from "../../../utils/pxToRem";
import Link from "next/link";
import { InformationPageType } from "../../../shared/types/types";

const LinksBlockWrapper = styled.div`
  display: flex;
  gap: ${pxToRem(16)};
  mix-blend-mode: difference;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    width: 100%;
  }
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
    width: 50%;
    flex: 1;
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

const List = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

type Props = {
  email: InformationPageType["email"];
  instagramAccounts: InformationPageType["instagramAccounts"];
};

const LinksBlock = (props: Props) => {
  const { email, instagramAccounts } = props;

  const hasInstagramAccounts =
    instagramAccounts && instagramAccounts.length > 0;

  return (
    <LinksBlockWrapper>
      <Block>
        <Title>Email</Title>
        <Link href={`mailto:${email}`}>{email}</Link>
      </Block>
      <Block>
        <Title>Socials</Title>
        <List>
          {hasInstagramAccounts &&
            instagramAccounts.map((account, index) => (
              <Link href={account.link} target="_blank" key={index}>
                {account.handle}
              </Link>
            ))}
        </List>
      </Block>
    </LinksBlockWrapper>
  );
};

export default LinksBlock;
