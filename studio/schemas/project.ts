import {ControlsIcon} from '@sanity/icons'
import {Rule} from '@sanity/types'

export default {
  title: 'Project',
  name: 'project',
  type: 'document',
  icon: ControlsIcon,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
    },
    {
      title: 'Client',
      name: 'client',
      type: 'string',
    },
    {
      title: 'Type',
      name: 'type',
      type: 'string',
      options: {
        list: {
          type: 'reference',
          to: [{type: 'siteSettings'}],
          field: 'projectTypes',
        },
      },
    },
    {
      title: 'Styles',
      name: 'styles',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: {
          type: 'reference',
          to: [{type: 'siteSettings'}],
          field: 'projectStyles',
        },
      },
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
      description: 'Use the first frame of the video as the fallback image',
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
        },
      ],
    },
  ],
}
