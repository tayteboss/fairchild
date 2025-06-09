import {TagIcon} from '@sanity/icons'

export default {
  title: 'Project Type',
  name: 'projectType',
  type: 'document',
  icon: TagIcon,
  fields: [
    {
      title: 'Name',
      name: 'name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
  ],
}
