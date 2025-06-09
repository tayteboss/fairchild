import styled from "styled-components";
import { NextSeo } from "next-seo";
import {
  InformationPageType,
  SiteSettingsType,
  TransitionsType,
} from "../shared/types/types";
import { motion } from "framer-motion";
import client from "../client";
import {
  informationPageQueryString,
  siteSettingsQueryString,
} from "../lib/sanityQueries";
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

  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(2);
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [contentSets, setContentSets] = useState(2);

  const lenis = useLenis();

  const wrapperRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<number>();
  const inactivityTimerRef = useRef<NodeJS.Timeout>();
  const resizeTimerRef = useRef<NodeJS.Timeout>();
  const startDelayTimerRef = useRef<NodeJS.Timeout>();

  // Reset inactivity timer
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    inactivityTimerRef.current = setTimeout(
      () => {
        setIsAutoScrolling(true);
      },
      isMobile ? 5000 : 3000
    );
  }, [isMobile]);

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

  // Auto scroll callback
  const autoScroll = useCallback(() => {
    if (!lenis) return;

    const currentSpeed = isHovering ? scrollSpeed * 0.3 : scrollSpeed;
    lenis.scrollTo(lenis.scroll + currentSpeed, {
      duration: 0.1,
      immediate: false,
    });

    autoScrollRef.current = requestAnimationFrame(autoScroll);
  }, [lenis, scrollSpeed, isHovering]);

  // Set scroll speed based on device type with debounce
  useEffect(() => {
    const handleResize = () => {
      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current);
      }

      resizeTimerRef.current = setTimeout(() => {
        const mobile = window.innerWidth <= 768;
        setIsMobile(mobile);
        setScrollSpeed(mobile ? 2 : 2);
      }, 100);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current);
      }
    };
  }, []);

  // Start delay effect
  useEffect(() => {
    startDelayTimerRef.current = setTimeout(() => {
      setIsAutoScrolling(true);
    }, 2000);

    return () => {
      if (startDelayTimerRef.current) {
        clearTimeout(startDelayTimerRef.current);
      }
    };
  }, []);

  // Scroll event listener
  useEffect(() => {
    if (!lenis) return;

    lenis.on("scroll", handleScroll);
    return () => lenis.off("scroll", handleScroll);
  }, [lenis, handleScroll]);

  // Auto scroll effect
  useEffect(() => {
    if (!isAutoScrolling || !lenis) return;

    autoScrollRef.current = requestAnimationFrame(autoScroll);

    return () => {
      if (autoScrollRef.current) {
        cancelAnimationFrame(autoScrollRef.current);
      }
    };
  }, [isAutoScrolling, lenis, autoScroll]);

  // Handle user interaction
  useEffect(() => {
    const handleUserInteraction = () => {
      setIsAutoScrolling(false);
      resetInactivityTimer();
    };

    window.addEventListener("wheel", handleUserInteraction);
    window.addEventListener("touchstart", handleUserInteraction);
    window.addEventListener("touchmove", handleUserInteraction);

    return () => {
      window.removeEventListener("wheel", handleUserInteraction);
      window.removeEventListener("touchstart", handleUserInteraction);
      window.removeEventListener("touchmove", handleUserInteraction);
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [resetInactivityTimer]);

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
      <ClientLogosBlock logos={data?.featuredClientLogos || []} />
      <CreditsBlock />
      <ThanksBlock
        title={data?.thankYouTitle || ""}
        text={data?.thankYouMessage || ""}
      />
    </InnerWrapper>
  );

  return (
    <PageWrapper
      ref={wrapperRef}
      variants={pageTransitionVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <NextSeo
        title={data?.seoTitle || ""}
        description={data?.seoDescription || ""}
      />
      <Inner>
        {Array.from({ length: contentSets }).map((_, index) => (
          <div key={index}>{renderContent()}</div>
        ))}
      </Inner>
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
