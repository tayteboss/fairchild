import { ReactNode } from "react";
import styled from "styled-components";
import pxToRem from "../../../utils/pxToRem";

type Props = {
  children: ReactNode;
};

const Wrapper = styled.div`
  margin: 0 auto;
  padding: 0 ${pxToRem(8)};
`;

const LayoutWrapper = (props: Props) => (
  <Wrapper className="layout-wrapper">{props.children}</Wrapper>
);

export default LayoutWrapper;
