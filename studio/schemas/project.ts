import {CaseIcon} from '@sanity/icons'
import {Rule} from '@sanity/types'

export default {
  title: 'Project',
  name: 'project',
  type: 'document',
  icon: CaseIcon,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
    },
    {
      title: 'Slug',
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      title: 'Client',
      name: 'client',
      type: 'string',
    },
    {
      title: 'Type',
      name: 'type',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'projectType'}],
        },
      ],
      validation: (Rule: any) => [
        Rule.required().error('Type is required'),
        Rule.min(1).max(1).error('Exactly one type must be selected'),
      ],
    },
    {
      title: 'Styles',
      name: 'styles',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'projectStyles'}],
        },
      ],
      validation: (Rule: any) => [
        Rule.required().error('Styles are required'),
        Rule.min(1).error('At least one style must be selected'),
      ],
    },
    {
      title: 'Year',
      name: 'year',
      type: 'string',
    },
    {
      title: 'Credits',
      name: 'credits',
      type: 'array',
      options: {
        collapsed: true,
      },
      of: [
        {
          type: 'object',
          fields: [
            {
              title: 'Role',
              name: 'role',
              type: 'string',
            },
            {
              title: 'Title',
              name: 'title',
              type: 'string',
            },
            {
              title: 'Link',
              name: 'link',
              type: 'url',
            },
          ],
        },
      ],
    },
    {
      title: 'Thumbnail Color',
      name: 'thumbnailColor',
      type: 'color',
      description: 'Select a color for the project thumbnail background',
    },
    {
      title: 'Video',
      name: 'video',
      type: 'mux.video',
    },
    {
      title: 'Fallback Image',
      name: 'fallbackImage',
      type: 'image',
      description:
        'Use the first frame of the video as the fallback image. Ensure the image is optimised',
    },
    {
      title: 'Snippet Video',
      name: 'snippetVideo',
      type: 'mux.video',
      description: '10sec maximum snippet of the hero video to be used on the home page',
    },
    {
      title: 'Snippet Fallback Image',
      name: 'snippetFallbackImage',
      type: 'image',
      description:
        'Use the first frame of the snippet video as the fallback image. Ensure the image is optimised',
    },
    // {
    //   title: 'Color Temperature Filter',
    //   name: 'colorTempFilter',
    //   type: 'object',
    //   fields: [
    //     {
    //       title: 'Min Temperature',
    //       name: 'minTemp',
    //       type: 'number',
    //       validation: (Rule: Rule) => Rule.min(2300).max(7000),
    //       description: 'Minimum color temperature (Kelvin) between 2300-7000',
    //     },
    //     {
    //       title: 'Max Temperature',
    //       name: 'maxTemp',
    //       type: 'number',
    //       validation: (Rule: Rule) => Rule.min(2300).max(7000),
    //       description: 'Maximum color temperature (Kelvin) between 2300-7000',
    //     },
    //   ],
    // },
    // {
    //   title: 'Saturation Filter',
    //   name: 'saturationFilter',
    //   type: 'number',
    //   validation: (Rule: Rule) => Rule.min(0).max(100),
    //   description: 'Saturation percentage between 0-100%',
    // },
    {
      title: 'Gallery Ratio',
      name: 'galleryRatio',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'galleryRatios'}],
        },
      ],
      validation: (Rule: any) => [
        Rule.required().error('Gallery Ratio is required'),
        Rule.min(1).max(1).error('Exactly one gallery ratio must be selected'),
      ],
    },
    {
      title: 'Gallery',
      name: 'gallery',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              title: 'Image',
              name: 'image',
              type: 'image',
              options: {
                hotspot: true,
              },
              preview: {
                select: {
                  imageUrl: 'asset.url',
                  title: 'caption',
                },
              },
            },
            {
              title: 'Thumbnail Color',
              name: 'thumbnailColor',
              type: 'color',
              description: 'Select a color for the image thumbnail background',
            },
            {
              title: 'Color Temperature Filter',
              name: 'colorTempFilter',
              type: 'object',
              fields: [
                {
                  title: 'Min Temperature',
                  name: 'minTemp',
                  type: 'number',
                  validation: (Rule: Rule) => Rule.min(2300).max(7000),
                  description: 'Minimum color temperature (Kelvin) between 2300-7000',
                },
                {
                  title: 'Max Temperature',
                  name: 'maxTemp',
                  type: 'number',
                  validation: (Rule: Rule) => Rule.min(2300).max(7000),
                  description: 'Maximum color temperature (Kelvin) between 2300-7000',
                },
              ],
            },
            {
              title: 'Saturation Filter',
              name: 'saturationFilter',
              type: 'number',
              validation: (Rule: Rule) => Rule.min(0).max(100),
              description: 'Saturation percentage between 0-100%',
            },
          ],
          preview: {
            select: {
              media: 'image',
              minTemp: 'colorTempFilter.minTemp',
              maxTemp: 'colorTempFilter.maxTemp',
              saturation: 'saturationFilter',
            },
            prepare(selection: {media: any; minTemp: number; maxTemp: number; saturation: number}) {
              const {media, minTemp, maxTemp, saturation} = selection
              return {
                title: `${minTemp} - ${maxTemp}K, ${saturation}%`,
                media: media,
              }
            },
          },
        },
      ],
    },
  ],
}
