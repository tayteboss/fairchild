import {TagIcon} from '@sanity/icons'

export default {
  title: 'Gallery Ratios',
  name: 'galleryRatios',
  type: 'document',
  icon: TagIcon,
  fields: [
    {
      title: 'Label',
      name: 'label',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
      description: 'e.g. "16:9", "4:3", "1:1"',
    },
    {
      title: 'Value',
      name: 'value',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
      description: 'Do not include the % sign',
    },
  ],
}
