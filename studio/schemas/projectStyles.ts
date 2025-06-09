import {TagIcon} from '@sanity/icons'

export default {
  title: 'Project Styles',
  name: 'projectStyles',
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
