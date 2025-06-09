import styled from "styled-components";
import { InformationPageType } from "../../../shared/types/types";
import pxToRem from "../../../utils/pxToRem";

const ThanksBlockWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: ${pxToRem(16)};
`;

const Inner = styled.div``;

const Text = styled.p`
  text-align: center;
  text-transform: initial !important;
`;

type Props = {
  title: InformationPageType["thankYouTitle"];
  text: InformationPageType["thankYouMessage"];
};

const ThanksBlock = (props: Props) => {
  const { title, text } = props;

  return (
    <ThanksBlockWrapper>
      <Inner>
        <Text>{title || ""}</Text>
        <Text>{text || ""}</Text>
      </Inner>
      <Inner>
        <Text>
          Copyright © {new Date().getFullYear()} Fairchild Media inc. ALL
          rights reserved.
        </Text>
        <Text>Country of publication United States of AMERICA.</Text>
      </Inner>
    </ThanksBlockWrapper>
  );
};

export default ThanksBlock;
