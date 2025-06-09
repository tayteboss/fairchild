import styled from "styled-components";
import { InformationPageType } from "../../../shared/types/types";
import pxToRem from "../../../utils/pxToRem";
import formatHTML from "../../../utils/formatHTML";
import { PortableText, PortableTextBlock } from "@portabletext/react";

const TitleTextBlockWrapper = styled.div`
  max-width: ${pxToRem(620)};
  margin: 0 auto;

  p {
    text-align: center;
    text-transform: initial !important;
  }

  a {
    text-transform: initial !important;
    text-decoration: underline;
  }
`;

const Title = styled.h2`
  margin-bottom: ${pxToRem(48)};
  text-align: center;
`;

const Text = styled.p`
  text-align: center;
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  li {
    text-align: center;
    text-transform: initial !important;
  }
`;

type Props = {
  title?: string;
  text?: InformationPageType["ideology"];
  useHTML?: boolean;
  richText?: PortableTextBlock[];
  useRichText?: boolean;
  list?: InformationPageType["services"];
  useList?: boolean;
};

const TitleTextBlock = (props: Props) => {
  const {
    title,
    text,
    useHTML = false,
    richText = [],
    useRichText = false,
    list = [],
    useList = false,
  } = props;

  return (
    <TitleTextBlockWrapper>
      {title && <Title>{title}</Title>}
      {text && (
        <>
          {useHTML ? (
            <div dangerouslySetInnerHTML={{ __html: formatHTML(text, "p") }} />
          ) : (
            <Text>{text}</Text>
          )}
        </>
      )}
      {richText && useRichText && <PortableText value={richText} />}
      {list && useList && (
        <List>
          {list.map((item) => (
            <li>{item}</li>
          ))}
        </List>
      )}
    </TitleTextBlockWrapper>
  );
};

export default TitleTextBlock;
