import {mediaBlock} from '../objects'

export default {
  title: 'Home Page',
  name: 'homePage',
  type: 'document',
  fields: [
    {
      title: 'Reference Title',
      name: 'referenceTitle',
      type: 'string',
      description: 'This is an internal reference title.',
    },
    {
      title: 'SEO title',
      name: 'seoTitle',
      type: 'string',
    },
    {
      title: 'SEO Description',
      name: 'seoDescription',
      type: 'string',
    },
    {
      title: 'Featured Projects',
      name: 'featuredProjects',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'project'}]}],
      validation: (Rule) => Rule.max(10),
      description: 'Works best with an odd number of projects.',
    },
  ],
}
