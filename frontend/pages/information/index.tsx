import styled from "styled-components";
import { NextSeo } from "next-seo";
import {
  InformationPageType,
  SiteSettingsType,
  TransitionsType,
} from "../../shared/types/types";
import { motion } from "framer-motion";
import client from "../../client";
import {
  informationPageQueryString,
  siteSettingsQueryString,
} from "../../lib/sanityQueries";

const PageWrapper = styled(motion.div)``;

type Props = {
  data: InformationPageType;
  siteSettings: SiteSettingsType;
  pageTransitionVariants: TransitionsType;
};

const Page = (props: Props) => {
  const { data, siteSettings, pageTransitionVariants } = props;

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
      Information
    </PageWrapper>
  );
};

export async function getStaticProps() {
  const siteSettings = await client.fetch(siteSettingsQueryString);
  const data = await client.fetch(informationPageQueryString);

  return {
    props: {
      data,
      siteSettings,
    },
  };
}

export default Page;
