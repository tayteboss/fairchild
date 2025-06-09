export const mediaString = `
	...,
	mediaType,
	image {
		asset-> {
			url,
			metadata {
				lqip
			}
		},
		alt
	},
	video {
		asset-> {
			playbackId,
		},
	},
	mobileImage {
		asset-> {
			url,
			metadata {
				lqip
			}
		},
		alt
	},
	mobileVideo {
		asset-> {
			playbackId,
		},
	},
`;

export const siteSettingsQueryString = `
	*[_type == 'siteSettings'][0] {
		referenceTitle,
		tagline,
		projectTypes,
		projectStyles
	}
`;

export const homePageQueryString = `
	*[_type == 'homePage'][0] {
		referenceTitle,
		seoTitle,
		seoDescription
	}
`;

export const workPageQueryString = `
	*[_type == 'workPage'][0] {
		seoTitle,
		seoDescription
	}
`;

export const projectsQueryString = `
	*[_type == 'project'] {
		title,
		client,
		type,
		styles,
		year,
		credits[] {
			role,
			title,
			link
		},
		thumbnailColor,
		video,
		fallbackImage,
		colorTempFilter {
			minTemp,
			maxTemp
		},
		saturationFilter,
		gallery[] {
			image,
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

export const galleryPageQueryString = `
	*[_type == 'galleryPage'][0] {
		title,
		seoTitle,
		seoDescription
	}
`;

export const projectsPageQueryString = `
	*[_type == 'projectsPage'][0] {
		title,
		seoTitle,
		seoDescription
	}
`;

export const informationPageQueryString = `
	*[_type == 'informationPage'][0] {
		title,
		seoTitle,
		seoDescription
	}
`;
