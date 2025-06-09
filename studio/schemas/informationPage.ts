export default {
  title: 'Information Page',
  name: 'informationPage',
  type: 'document',
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
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
      title: 'Ideology',
      name: 'ideology',
      type: 'string',
    },
    {
      title: 'Business Description',
      name: 'businessDescription',
      type: 'text',
      rows: 3,
    },
    {
      title: 'Email',
      name: 'email',
      type: 'string',
    },
    {
      title: 'Instagram Handle',
      name: 'instagramHandle',
      type: 'string',
    },
    {
      title: 'Instagram Link',
      name: 'instagramLink',
      type: 'url',
    },
    {
      title: 'About Text',
      name: 'aboutText',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
          lists: [],
          marks: {
            decorators: [],
            annotations: [
              {
                title: 'Link',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url',
                    validation: (Rule: any) =>
                      Rule.uri({
                        scheme: ['http', 'https', 'mailto'],
                      }),
                  },
                ],
              },
            ],
          },
        },
      ],
    },
    {
      title: 'Services',
      name: 'services',
      type: 'array',
      of: [{type: 'string'}],
    },
    {
      title: 'Press',
      name: 'press',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
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
      title: 'News',
      name: 'news',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
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
      title: 'Clients',
      name: 'clients',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              title: 'Name',
              name: 'name',
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
      title: 'Featured Client Logos',
      name: 'featuredClientLogos',
      type: 'array',
      of: [{type: 'image'}],
    },
    {
      title: 'Thank You Title',
      name: 'thankYouTitle',
      type: 'string',
    },
    {
      title: 'Thank You Message',
      name: 'thankYouMessage',
      type: 'string',
    },
  ],
}
