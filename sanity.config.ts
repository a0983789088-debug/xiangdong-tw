import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemaTypes'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '3zcpri8u'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  name: 'xiangdong',
  title: '香董 後台',
  projectId,
  dataset,
  basePath: '/studio',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .id('root')
          .title('內容管理')
          .items([
            S.listItem()
              .id('articles')
              .title('📄 文章')
              .child(
                S.documentTypeList('article')
                  .id('articleList')
                  .title('文章')
                  .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
              ),
            S.listItem()
              .id('products')
              .title('🛍️ 商品')
              .child(
                S.documentTypeList('product')
                  .id('productList')
                  .title('商品')
              ),
            S.listItem()
              .id('categories')
              .title('📂 分類')
              .child(
                S.documentTypeList('category')
                  .id('categoryList')
                  .title('分類')
                  .defaultOrdering([{ field: 'order', direction: 'asc' }])
              ),
            S.divider(),
            S.listItem()
              .id('siteSettings')
              .title('⚙️ 網站設定')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
              ),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
    // 隱藏 siteSettings 不在「新增」選單出現（singleton）
    templates: (templates) =>
      templates.filter(({ schemaType }) => schemaType !== 'siteSettings'),
  },
  document: {
    // 禁止「複製/刪除」siteSettings
    actions: (input, context) =>
      context.schemaType === 'siteSettings'
        ? input.filter(
            ({ action }) => action && !['duplicate', 'delete'].includes(action)
          )
        : input,
  },
})
