import styled from "styled-components";
import { NextSeo } from "next-seo";
import {
  GalleryPageType,
  ProjectType,
  TransitionsType,
} from "../../shared/types/types";
import { motion } from "framer-motion";
import client from "../../client";
import {
  projectsPageQueryString,
  projectsQueryString,
  projectStylesQueryString,
  projectTypesQueryString,
} from "../../lib/sanityQueries";
import ProjectsList from "../../components/blocks/ProjectsList";
import ProjectFilters from "../../components/blocks/ProjectFilters";
import { useState, useEffect } from "react";
import ProjectPlayer from "../../components/blocks/ProjectPlayer";

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
  const [sortConfig, setSortConfig] = useState({
    key: "client",
    direction: "asc",
  });
  const [activeProject, setActiveProject] = useState<{
    project: ProjectType | null;
    action: "hover" | "fullscreen" | "inactive";
  }>({
    project: null,
    action: "inactive",
  });
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Toggle filters panel
  const handleToggleFilters = () => {
    setFiltersIsOpen(!filtersIsOpen);
  };

  const handleSort = (key: string) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    } else if (key === "year" && sortConfig.key !== "year") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    let tempProjects = [...projects];

    if (selectedTypes.length > 0) {
      tempProjects = tempProjects.filter((project) =>
        selectedTypes.every((type) => project.type.some((t) => t.name === type))
      );
    }

    if (selectedStyles.length > 0) {
      tempProjects = tempProjects.filter((project) =>
        selectedStyles.every((style) =>
          project.styles.some((s) => s.name === style)
        )
      );
    }

    if (sortConfig.key) {
      tempProjects.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortConfig.key) {
          case "client":
            aValue = a.client?.toLowerCase();
            bValue = b.client?.toLowerCase();
            break;
          case "project":
            aValue = a.title?.toLowerCase();
            bValue = b.title?.toLowerCase();
            break;
          case "type":
            aValue = a.type[0]?.name.toLowerCase() || "";
            bValue = b.type[0]?.name.toLowerCase() || "";
            break;
          case "year":
            aValue = a.year;
            bValue = b.year;
            break;
          default:
            return 0;
        }

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredProjects(tempProjects);

    if (selectedTypes.length > 0 || selectedStyles.length > 0) {
      setFiltersAreOn(true);
    } else {
      setFiltersAreOn(false);
    }
  }, [selectedTypes, selectedStyles, projects, sortConfig]);

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
      <ProjectsList
        projects={filteredProjects}
        handleSort={handleSort}
        sortConfig={sortConfig}
        setActiveProject={setActiveProject}
        isFullScreen={isFullScreen}
      />
      <ProjectPlayer
        activeProject={activeProject}
        isFullScreen={isFullScreen}
        setIsFullScreen={setIsFullScreen}
        setActiveProject={setActiveProject}
      />
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
  let projects = await client.fetch(projectsQueryString);
  const projectTypes = await client.fetch(projectTypesQueryString);
  const projectStyles = await client.fetch(projectStylesQueryString);

  projects = projects.sort((a: ProjectType, b: ProjectType) => {
    const clientA = a.client.toLowerCase();
    const clientB = b.client.toLowerCase();
    return clientA.localeCompare(clientB);
  });

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
