import {mediaBlock} from '../objects'

export default {
  title: 'Site Settings',
  name: 'siteSettings',
  type: 'document',
  fields: [
    {
      title: 'Reference Title',
      name: 'referenceTitle',
      type: 'string',
      description: 'This is an internal reference title.',
    },
    {
      title: 'Tagline',
      name: 'tagline',
      type: 'string',
    },
    {
      title: 'Project Types',
      name: 'projectTypes',
      type: 'array',
      of: [{type: 'string'}],
    },
    {
      title: 'Project Styles',
      name: 'projectStyles',
      type: 'array',
      of: [{type: 'string'}],
    },
  ],
}
