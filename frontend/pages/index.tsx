import styled from "styled-components";
import { NextSeo } from "next-seo";
import { HomePageType, TransitionsType } from "../shared/types/types";
import { motion } from "framer-motion";
import client from "../client";
import { homePageQueryString } from "../lib/sanityQueries";
import FeaturedProjects from "../components/blocks/FeaturedProjects";
import TestMobileFeaturedProjects from "../components/blocks/TestMobileFeaturedProjects";
import { useEffect } from "react";
import { useHeader } from "../components/layout/HeaderContext";

const PageWrapper = styled(motion.div)``;

type Props = {
  data: HomePageType;
  pageTransitionVariants: TransitionsType;
};

const Page = (props: Props) => {
  const { data, pageTransitionVariants } = props;

  const { setHeaderText, setIsHovering } = useHeader();

  useEffect(() => {
    setHeaderText({
      logo: "Fairchild",
      tagline: "",
    });
    setIsHovering(false);
  }, []);

  return (
    <PageWrapper
      variants={pageTransitionVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <NextSeo
        title={data?.seoTitle || ""}
        description={data?.seoDescription || ""}
      />
      <FeaturedProjects data={data?.featuredProjects} />
      <TestMobileFeaturedProjects data={data?.featuredProjects} />
      {/* <MobileFeaturedProjects data={data?.featuredProjects} /> */}
    </PageWrapper>
  );
};

export async function getStaticProps() {
  const data = await client.fetch(homePageQueryString);

  return {
    props: {
      data,
    },
  };
}

export default Page;
