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
import GalleryFilters from "../components/blocks/GalleryFilters";
import { useCallback, useEffect, useState } from "react";
import ProjectGalleryCarousel from "../components/blocks/ProjectGalleryCarousel/ProjectGalleryCarousel";
import { useHeader } from "../components/layout/HeaderContext";
import useViewportWidth from "../hooks/useViewportWidth";

const PageWrapper = styled(motion.div)``;

type Props = {
  data: GalleryPageType;
  projects: ProjectType[];
  yearRange: { min: number; max: number };
  pageTransitionVariants: TransitionsType;
};

const DEFAULT_COLOR_TEMP = { min: 2300, max: 7000 };
const DEFAULT_SATURATION = { min: 0, max: 100 };

const Page = (props: Props) => {
  const { data, projects, yearRange, pageTransitionVariants } = props;

  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [isDragging, setIsDragging] = useState(false);
  const [filtersIsOpen, setFiltersIsOpen] = useState(false);
  const [filtersAreOn, setFiltersAreOn] = useState(false);
  const [colorTemp, setColorTemp] = useState(DEFAULT_COLOR_TEMP);
  const [saturation, setSaturation] = useState(DEFAULT_SATURATION);
  const [year, setYear] = useState({ min: yearRange.min, max: yearRange.max });
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<
    number | null
  >(null);
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState<
    number | null
  >(null);
  const [animationPhase, setAnimationPhase] = useState<
    "idle" | "fade" | "center" | "carousel"
  >("idle");
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [selectedProjectRatio, setSelectedProjectRatio] = useState<{
    label: string;
    value: string;
  }>({
    label: "16:9",
    value: "56.25",
  });

  const { setHeaderText, setIsHovering } = useHeader();

  const viewport = useViewportWidth();
  const isMobile = viewport === "mobile" || viewport === "tabletPortrait";

  // Toggle filters panel
  const handleToggleFilters = useCallback(() => {
    setFiltersIsOpen(!filtersIsOpen);
  }, [filtersIsOpen]);

  const handleGalleryClick = useCallback(
    (projectIndex: number, galleryIndex: number) => {
      setSelectedGalleryIndex(galleryIndex);
      setSelectedProjectIndex(projectIndex);
      setSelectedProjectRatio(
        filteredProjects[projectIndex].galleryRatio[0] || {
          label: "16:9",
          value: "56.25",
        }
      );
      setAnimationPhase("fade");
      setIsCarouselOpen(true);

      setHeaderText({
        logo: isMobile ? "" : filteredProjects[projectIndex].client || "",
        tagline: isMobile ? "" : filteredProjects[projectIndex].title || "",
        year: isMobile ? "" : filteredProjects[projectIndex].year || "",
      });
      setIsHovering(true);

      // After fade, move to carousel
      setTimeout(() => {
        setAnimationPhase("carousel");
      }, 200);
    },
    [filteredProjects, isMobile, setHeaderText, setIsHovering]
  );

  const handleCloseCarousel = useCallback(() => {
    setIsCarouselOpen(false);
    setSelectedProjectIndex(null);
    setSelectedGalleryIndex(null);
    setAnimationPhase("idle");
    setSelectedProjectRatio({
      label: "16:9",
      value: "56.25",
    });
  }, []);

  useEffect(() => {
    if (isDragging) return;

    // Check if filters are at default state
    const isDefaultState =
      colorTemp.min === DEFAULT_COLOR_TEMP.min &&
      colorTemp.max === DEFAULT_COLOR_TEMP.max &&
      saturation.min === DEFAULT_SATURATION.min &&
      saturation.max === DEFAULT_SATURATION.max &&
      year.min === yearRange.min &&
      year.max === yearRange.max;

    if (isDefaultState) {
      setFilteredProjects(projects);
      setFiltersAreOn(false);
      return;
    }

    setFiltersAreOn(true);

    const projectsWithFilteredGalleries = projects
      .map((project) => {
        // Year filter at the project level
        const hasYear = project.year && !isNaN(parseInt(project.year));
        if (hasYear) {
          const projectYear = parseInt(project.year);
          const isYearInRange =
            projectYear >= year.min && projectYear <= year.max;
          if (!isYearInRange) {
            return null; // Remove project if it's outside the year range
          }
        }

        if (!project.gallery) {
          return {
            ...project,
            gallery: [],
          };
        }

        const filteredGallery = project.gallery.filter((galleryItem) => {
          // Color temperature filter for each gallery item
          const hasColorTemp =
            galleryItem.colorTempFilter?.minTemp &&
            galleryItem.colorTempFilter?.maxTemp;
          if (hasColorTemp) {
            const galleryColorTempMiddle =
              (galleryItem.colorTempFilter.minTemp +
                galleryItem.colorTempFilter.maxTemp) /
              2;
            const isColorTempInRange =
              galleryColorTempMiddle >= colorTemp.min &&
              galleryColorTempMiddle <= colorTemp.max;
            if (!isColorTempInRange) return false;
          }

          // Saturation filter for each gallery item
          const hasSaturation =
            typeof galleryItem.saturationFilter === "number";
          if (hasSaturation) {
            const isSaturationInRange =
              galleryItem.saturationFilter >= saturation.min &&
              galleryItem.saturationFilter <= saturation.max;
            if (!isSaturationInRange) return false;
          }

          return true;
        });

        return {
          ...project,
          gallery: filteredGallery,
        };
      })
      .filter(
        (project): project is ProjectType =>
          project !== null && project.gallery.length > 0
      );

    setFilteredProjects(projectsWithFilteredGalleries);
  }, [colorTemp, saturation, year, projects, isDragging, yearRange]);

  const selectedProject =
    selectedProjectIndex !== null
      ? filteredProjects[selectedProjectIndex]
      : null;

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
      <GalleryList
        data={filteredProjects}
        filtersIsOpen={filtersIsOpen}
        handleGalleryClick={handleGalleryClick}
        selectedProjectIndex={selectedProjectIndex}
        animationPhase={animationPhase}
      />
      <GalleryFilters
        isOpen={filtersIsOpen}
        setIsOpen={handleToggleFilters}
        colorTemp={colorTemp}
        setColorTemp={setColorTemp}
        saturation={saturation}
        setSaturation={setSaturation}
        year={year}
        setYear={setYear}
        yearRange={yearRange}
        setIsDragging={setIsDragging}
        filtersAreOn={filtersAreOn}
      />
      <ProjectGalleryCarousel
        project={selectedProject}
        onClose={handleCloseCarousel}
        animationPhase={animationPhase}
        initialGalleryIndex={selectedGalleryIndex}
        allProjects={selectedProject ? [selectedProject] : []}
        isOpen={isCarouselOpen}
        selectedProjectRatio={selectedProjectRatio}
      />
    </PageWrapper>
  );
};

export async function getStaticProps() {
  const data = await client.fetch(galleryPageQueryString);
  let projects = await client.fetch(projectsQueryString);

  const yearRange = projects.reduce(
    (acc: { min: number; max: number }, project: ProjectType) => {
      const year = parseInt(project.year);
      if (!acc.min || year < acc.min) acc.min = year;
      if (!acc.max || year > acc.max) acc.max = year;
      return acc;
    },
    { min: 0, max: 0 }
  );

  return {
    props: {
      data,
      projects,
      yearRange,
    },
  };
}

export default Page;
