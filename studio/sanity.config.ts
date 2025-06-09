import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'
import {muxInput} from 'sanity-plugin-mux-input'
import {vercelDeployTool} from 'sanity-plugin-vercel-deploy'
import {EarthGlobeIcon, DocumentIcon, UsersIcon, HomeIcon, CaseIcon} from '@sanity/icons'
import {colorInput} from '@sanity/color-input'

export default defineConfig({
  name: 'default',
  title: 'Fairchild',

  projectId: 'b356qmqr',
  dataset: 'production',
  plugins: [
    deskTool({
      structure: (S, context) => {
        return S.list()
          .title('Content')
          .items([
            S.divider(),
            S.listItem()
              .title('Site Settings')
              .icon(EarthGlobeIcon)
              .child(S.editor().schemaType('siteSettings').documentId('siteSettings')),
            S.divider(),
            S.listItem()
              .title('Home Page')
              .icon(HomeIcon)
              .child(S.editor().schemaType('homePage').documentId('homePage')),
            S.divider(),
            S.listItem()
              .title('Projects')
              .icon(CaseIcon)
              .child(
                S.documentList()
                  .title('Projects')
                  .schemaType('project')
                  .filter('_type == "project"'),
              ),
            S.divider(),
            S.listItem()
              .title('Gallery Page')
              .icon(DocumentIcon)
              .child(S.editor().schemaType('galleryPage').documentId('galleryPage')),
            S.listItem()
              .title('Projects Page')
              .icon(DocumentIcon)
              .child(S.editor().schemaType('projectsPage').documentId('projectsPage')),
            S.listItem()
              .title('Information Page')
              .icon(DocumentIcon)
              .child(S.editor().schemaType('informationPage').documentId('informationPage')),
          ])
      },
    }),
    visionTool(),
    colorInput(),
    muxInput({mp4_support: 'standard', max_resolution_tier: '2160p'}),
    vercelDeployTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  parts: [
    {
      name: 'part:@sanity/base/theme/variables-style',
      path: './customEditorStyles.css',
    },
  ],
})
