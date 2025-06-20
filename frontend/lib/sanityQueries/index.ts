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
		seoDescription,
		featuredProjects[]-> {
			title,
			client,
			thumbnailColor {
				hex
			},
			year,
			type[]-> {
				name
			},
			fallbackImage {
				asset-> {
					url
				}
			},
			video {
				asset-> {
					playbackId
				}
			},
			snippetVideo {
				asset-> {
					playbackId
				}
			},
			snippetFallbackImage {
				asset-> {
					url,
					metadata {
						lqip
					}
				}
			}
		}
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
		galleryRatio[]-> {
			label,
			value
		},
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

export const projectTypesQueryString = `
	*[_type == 'projectType'] {
		name
	}
`;

export const projectStylesQueryString = `
	*[_type == 'projectStyles'] {
		name
	}
`;

export const informationPageQueryString = `
	*[_type == 'informationPage'][0] {
		...,
		title,
		seoTitle,
		seoDescription,
		ideology,
		businessDescription,
		email,
		instagramHandle,
		instagramLink,
		aboutText,
		services,
		press,
		news,
		clients,
		featuredClientLogos[] {
			asset-> {
				url
			}
		},
		thankYouTitle,
		thankYouMessage
	}
`;
