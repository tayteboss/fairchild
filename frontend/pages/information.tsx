import styled from "styled-components";
import { NextSeo } from "next-seo";
import { InformationPageType, TransitionsType } from "../shared/types/types";
import { motion } from "framer-motion";
import client from "../client";
import { informationPageQueryString } from "../lib/sanityQueries";
import TitleTextBlock from "../components/blocks/TitleTextBlock";
import pxToRem from "../utils/pxToRem";
import LinksBlock from "../components/blocks/LinksBlock";
import PressBlock from "../components/blocks/PressBlock";
import ClientsBlock from "../components/blocks/ClientsBlock";
import ClientLogosBlock from "../components/blocks/ClientLogosBlock";
import CreditsBlock from "../components/blocks/CreditsBlock";
import ThanksBlock from "../components/blocks/ThanksBlock";
import { useEffect, useRef, useState, useCallback } from "react";
import { useLenis } from "@studio-freight/react-lenis";
import LayoutWrapper from "../components/layout/LayoutWrapper";
import ThemeSwitchBlock from "../components/blocks/ThemeSwitchBlock";

const PageWrapper = styled(motion.div)`
  padding: ${pxToRem(120)} 0;
  position: relative;
`;

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${pxToRem(48)};
  justify-content: center;
  align-items: center;
`;

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${pxToRem(48)};
  justify-content: center;
  align-items: center;
`;

type Props = {
  data: InformationPageType;
  pageTransitionVariants: TransitionsType;
};

const Page = (props: Props) => {
  const { data, pageTransitionVariants } = props;
  const [contentSets, setContentSets] = useState(2);
  const lenis = useLenis();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Handle scroll and duplicate content when needed
  const handleScroll = useCallback(() => {
    if (!wrapperRef.current || !lenis) return;

    const wrapper = wrapperRef.current;
    const wrapperRect = wrapper.getBoundingClientRect();
    const wrapperHeight = wrapperRect.height;
    const scrollTop = lenis.scroll;
    const viewportHeight = window.innerHeight;

    if (scrollTop + viewportHeight > wrapperHeight - viewportHeight) {
      setContentSets((prev) => prev + 1);
    }
  }, [lenis]);

  // Scroll event listener
  useEffect(() => {
    if (!lenis) return;

    lenis.on("scroll", handleScroll);
    return () => lenis.off("scroll", handleScroll);
  }, [lenis, handleScroll]);

  const renderContent = () => (
    <InnerWrapper>
      <TitleTextBlock title="Ideology" text={data?.ideology || ""} />
      <TitleTextBlock text={data?.businessDescription || ""} useHTML={true} />
      <LinksBlock
        email={data?.email || ""}
        instagramHandle={data?.instagramHandle || ""}
        instagramLink={data?.instagramLink || ""}
      />
      <TitleTextBlock richText={data?.aboutText || []} useRichText={true} />
      <TitleTextBlock
        title="Services"
        list={data?.services || []}
        useList={true}
      />
      <PressBlock press={data?.press || []} news={data?.news || []} />
      <ClientsBlock clients={data?.clients || []} />
      <ClientLogosBlock data={data?.featuredClientLogos || []} />
      <CreditsBlock />
      <ThanksBlock
        title={data?.thankYouTitle || ""}
        text={data?.thankYouMessage || ""}
      />
      <ThemeSwitchBlock />
    </InnerWrapper>
  );

  return (
    <PageWrapper
      ref={wrapperRef}
      variants={pageTransitionVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <NextSeo
        title={data?.seoTitle || ""}
        description={data?.seoDescription || ""}
      />
      <LayoutWrapper>
        <Inner>
          {Array.from({ length: contentSets }).map((_, index) => (
            <div key={index}>{renderContent()}</div>
          ))}
        </Inner>
      </LayoutWrapper>
    </PageWrapper>
  );
};

export async function getStaticProps() {
  const data = await client.fetch(informationPageQueryString);

  return {
    props: {
      data,
    },
  };
}

export default Page;
