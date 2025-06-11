import styled from "styled-components";
import { NextSeo } from "next-seo";
import {
  GalleryPageType,
  ProjectType,
  TransitionsType,
} from "../shared/types/types";
import { motion } from "framer-motion";
import client from "../client";
import {
  galleryPageQueryString,
  projectsQueryString,
} from "../lib/sanityQueries";
import GalleryList from "../components/blocks/GalleryList";
import LogoSaver from "../components/blocks/LogoSaver";
import Filters from "../components/blocks/Filters";

const PageWrapper = styled(motion.div)``;

type Props = {
  data: GalleryPageType;
  projects: ProjectType[];
  pageTransitionVariants: TransitionsType;
};

const Page = (props: Props) => {
  const { data, projects, pageTransitionVariants } = props;

  return (
    <PageWrapper
      variants={pageTransitionVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      // className="performance"
    >
      <NextSeo
        title={data?.seoTitle || ""}
        description={data?.seoDescription || ""}
      />
      <GalleryList data={projects} />
      <Filters />
    </PageWrapper>
  );
};

export async function getStaticProps() {
  const data = await client.fetch(galleryPageQueryString);
  const projects = await client.fetch(projectsQueryString);

  return {
    props: {
      data,
      projects,
    },
  };
}

export default Page;
