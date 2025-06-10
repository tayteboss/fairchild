import styled from "styled-components";
import pxToRem from "../../../utils/pxToRem";
import { InformationPageType } from "../../../shared/types/types";
import Link from "next/link";

const PressBlockWrapper = styled.div`
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
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Title = styled.h3`
  text-transform: uppercase;
`;

const Links = styled.div`
  display: flex;
  flex-direction: column;
`;

type Props = {
  press: InformationPageType["press"];
  news: InformationPageType["news"];
};

const PressBlock = (props: Props) => {
  const { press, news } = props;

  const hasPress = press.length > 0;
  const hasNews = news.length > 0;

  return (
    <PressBlockWrapper>
      <Block>
        <Title>Press</Title>
        <Links>
          {hasPress &&
            press.map((item, i) =>
              item.link ? (
                <Link key={i} href={item.link} target="_blank">
                  {item.title}
                </Link>
              ) : (
                <span key={i}>{item.title}</span>
              )
            )}
        </Links>
      </Block>
      <Block>
        <Title>News</Title>
        <Links>
          {hasNews &&
            news.map((item, i) =>
              item.link ? (
                <Link key={i} href={item.link} target="_blank">
                  {item.title}
                </Link>
              ) : (
                <span key={i}>{item.title}</span>
              )
            )}
        </Links>
      </Block>
    </PressBlockWrapper>
  );
};

export default PressBlock;
