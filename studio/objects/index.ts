const selectMediaTypeObject = {
  title: 'Select Media Type',
  name: 'mediaType',
  type: 'string',
  options: {
    list: [
      {title: 'Image', value: 'image'},
      {title: 'Video', value: 'video'},
    ],
    layout: 'dropdown',
  },
}

const ratioList = [
  {title: '1:1 - Square', value: '100%'},
  {title: '2:3 - Portrait', value: '150%'},
  {title: '4:5 - Portrait', value: '125%'},
  {title: '5:4 - Landscape', value: '80%'},
  {title: '3:2 - Landscape', value: '66.66%'},
  {title: '16:9 - Landscape', value: '56.25%'},
]

const seoObject = {
  title: 'SEO',
  name: 'seo',
  type: 'object',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'SEO Title',
    },
    {
      name: 'description',
      type: 'text',
      title: 'Meta Description',
      rows: 3,
    },
  ],
}

const imageObject = {
  title: 'Image',
  name: 'image',
  type: 'image',
  fields: [
    {
      name: 'alt',
      type: 'string',
      title: 'Alt Text',
    },
  ],
  options: {
    collapsible: false,
    collapsed: false,
  },
}

const videoObject = {
  title: 'Video',
  name: 'video',
  type: 'mux.video',
  options: {
    collapsible: false,
    collapsed: false,
  },
}

const mediaBlock = [
  selectMediaTypeObject,
  {
    ...imageObject,
    hidden: ({parent}: any) => parent?.mediaType !== 'image',
  },
  {
    ...videoObject,
    hidden: ({parent}: any) => parent?.mediaType !== 'video',
  },
]

export {mediaBlock, imageObject, videoObject, selectMediaTypeObject, seoObject, ratioList}
