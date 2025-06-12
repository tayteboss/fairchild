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
  projectsPageQueryString,
  projectsQueryString,
  projectStylesQueryString,
  projectTypesQueryString,
} from "../lib/sanityQueries";
import ProjectsList from "../components/blocks/ProjectsList";
import ProjectFilters from "../components/blocks/ProjectFilters";
import { useState, useEffect } from "react";

const PageWrapper = styled(motion.div)``;

type Props = {
  data: GalleryPageType;
  projects: ProjectType[];
  pageTransitionVariants: TransitionsType;
  projectTypes: { name: string }[];
  projectStyles: { name: string }[];
};

const Page = (props: Props) => {
  const {
    data,
    projects,
    pageTransitionVariants,
    projectTypes,
    projectStyles,
  } = props;

  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [filtersIsOpen, setFiltersIsOpen] = useState(false);
  const [filtersAreOn, setFiltersAreOn] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

  // Toggle filters panel
  const handleToggleFilters = () => {
    setFiltersIsOpen(!filtersIsOpen);
  };

  useEffect(() => {
    let tempProjects = [...projects];

    if (selectedTypes.length > 0) {
      tempProjects = tempProjects.filter((project) =>
        project.type.some((t) => selectedTypes.includes(t.name))
      );
    }

    if (selectedStyles.length > 0) {
      tempProjects = tempProjects.filter((project) =>
        project.styles.some((s) => selectedStyles.includes(s.name))
      );
    }

    setFilteredProjects(tempProjects);

    if (selectedTypes.length > 0 || selectedStyles.length > 0) {
      setFiltersAreOn(true);
    } else {
      setFiltersAreOn(false);
    }
  }, [selectedTypes, selectedStyles, projects]);

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
      <ProjectsList projects={filteredProjects} />
      <ProjectFilters
        isOpen={filtersIsOpen}
        setIsOpen={handleToggleFilters}
        filtersAreOn={filtersAreOn}
        projectTypes={projectTypes}
        projectStyles={projectStyles}
        selectedTypes={selectedTypes}
        setSelectedTypes={setSelectedTypes}
        selectedStyles={selectedStyles}
        setSelectedStyles={setSelectedStyles}
      />
    </PageWrapper>
  );
};

export async function getStaticProps() {
  const data = await client.fetch(projectsPageQueryString);
  const projects = await client.fetch(projectsQueryString);
  const projectTypes = await client.fetch(projectTypesQueryString);
  const projectStyles = await client.fetch(projectStylesQueryString);

  return {
    props: {
      data,
      projects,
      projectTypes,
      projectStyles,
    },
  };
}

export default Page;
