import styled from "styled-components";
import client from "../../client";
import { ProjectType, TransitionsType } from "../../shared/types/types";
import { motion } from "framer-motion";
import { NextSeo } from "next-seo";
import ProjectPlayer from "../../components/blocks/ProjectPlayer";

type Props = {
  data: ProjectType;
  pageTransitionVariants: TransitionsType;
};

const PageWrapper = styled(motion.div)``;

const Page = (props: Props) => {
  const { data, pageTransitionVariants } = props;

  return (
    <PageWrapper
      variants={pageTransitionVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <NextSeo title={`${data?.title} — Fairchild`} />
      <ProjectPlayer
        activeProject={{
          project: data,
          action: "fullscreen",
        }}
        isFullScreen={true}
        setIsFullScreen={() => {}}
        setActiveProject={() => {}}
        useCloseLink={true}
      />
    </PageWrapper>
  );
};

export async function getStaticPaths() {
  const projectsQuery = `
		*[_type == 'project'] [0...100] {
			slug
		}
	`;

  const allProjects = await client.fetch(projectsQuery);

  return {
    paths: allProjects.map((item: any) => {
      return `/projects/${item?.slug?.current}`;
    }),
    fallback: true,
  };
}

export async function getStaticProps({ params }: any) {
  const projectQuery = `
		*[_type == 'project' && slug.current == "${params.slug[0]}"][0] {
			...,
      title,
		client,
		type[]-> {
			name
		},
		styles[]-> {
			name
		},
		year,
		credits[] {
			role,
			title,
			link
		},
		thumbnailColor,
		video {
			asset-> {
				playbackId,
				data {
					duration
				}
			}
		},
		fallbackImage {
			asset-> {
				url,
				metadata {
					lqip
				}
			}
		},
		snippetVideo {
			asset-> {
				playbackId,
				data {
					duration
				}
			}
		},
		snippetFallbackImage {
			asset-> {
				url,
				metadata {
					lqip
				}
			}
		},
		colorTempFilter {
			minTemp,
			maxTemp
		},
		saturationFilter,
		gallery[] {
			image {
				asset-> {
					url
				}
			},
			thumbnailColor,
			colorTempFilter {
				minTemp,
				maxTemp
			},
			saturationFilter
		},
		slug
		}
	`;
  const data = await client.fetch(projectQuery);

  return {
    props: {
      data,
    },
  };
}

export default Page;
