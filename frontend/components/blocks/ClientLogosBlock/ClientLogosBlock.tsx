import styled from "styled-components";
import { InformationPageType } from "../../../shared/types/types";
import Image from "next/image";
import pxToRem from "../../../utils/pxToRem";

const ClientLogosBlockWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${pxToRem(64)};
  align-items: center;
  max-width: ${pxToRem(600)};
`;

const ImageWrapper = styled.div`
  width: ${pxToRem(64)};
  height: ${pxToRem(64)};
  position: relative;
`;

type Props = {
  logos: InformationPageType["featuredClientLogos"];
};

const ClientLogosBlock = (props: Props) => {
  const { logos } = props;

  const hasLogos = logos.length > 0;

  return (
    <ClientLogosBlockWrapper>
      {hasLogos &&
        logos.map((logo, index) => (
          <ImageWrapper key={index}>
            <Image
              src={logo.asset.url}
              alt={logo.asset.url}
              style={{ objectFit: "contain" }}
              sizes="64px"
              width={64}
              height={64}
            />
          </ImageWrapper>
        ))}
    </ClientLogosBlockWrapper>
  );
};

export default ClientLogosBlock;
