import { defineField, defineType } from 'sanity'

const TAG_PRESETS = [
  '惠安', '星洲', '沉香粉', '線香', '佛珠',
  '新手', '收藏', '供香', '空間淨化', '真偽辨識',
  '奇楠', '越南沉香', '印尼沉香', '檀香', '老山檀',
  '新山檀', '油線', '結香', '水沉', '香道',
]

const CTA_OPTIONS = [
  { title: '使用全站預設（90% 文章選這個）', value: 'default' },
  { title: '主推：LINE 加好友禮', value: 'line' },
  { title: '主推：FB 競標社團', value: 'community' },
  { title: '主推：FB 知識社團（職人老實說）', value: 'knowledge' },
  { title: '主推：香董商城', value: 'shop' },
]

export const article = defineType({
  name: 'article',
  title: '文章',
  type: 'document',
  groups: [
    { name: 'content', title: '內容', default: true },
    { name: 'faq', title: 'FAQ（SEO 加分）' },
    { name: 'seo', title: 'SEO 進階設定' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: '標題',
      type: 'string',
      group: 'content',
      description: '這會變成文章頁的大標、Google 搜尋結果上的標題',
      validation: (Rule) => Rule.required().min(8).max(80),
    }),
    defineField({
      name: 'slug',
      title: '網址 slug (英文)',
      type: 'slug',
      group: 'content',
      description: '系統會從標題自動建議。發布後請勿亂改，會傷 SEO',
      options: {
        source: 'title',
        maxLength: 80,
        slugify: (input) =>
          input
            .toLowerCase()
            .replace(/[\s一-龥]+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
            .slice(0, 80),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: '摘要',
      type: 'text',
      group: 'content',
      rows: 3,
      description: '1-2 句話介紹這篇。顯示在文章列表、Google 搜尋結果摘要',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'coverImage',
      title: '封面圖',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: '圖片描述 (alt)',
          type: 'string',
          description: 'SEO 必填：簡述圖片內容',
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: '分類',
      type: 'reference',
      group: 'content',
      to: [{ type: 'category' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tags',
      title: '標籤',
      type: 'array',
      group: 'content',
      description: '從預設標籤中選擇（避免標籤雜亂）',
      of: [{ type: 'string' }],
      options: { list: TAG_PRESETS.map((t) => ({ title: t, value: t })) },
    }),
    defineField({
      name: 'publishedAt',
      title: '發布日期',
      type: 'datetime',
      group: 'content',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: '內文',
      type: 'blockContent',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'relatedProducts',
      title: '相關商品',
      type: 'array',
      group: 'content',
      description: '這篇文章提到的商品。文章底部會自動顯示',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
    }),
    defineField({
      name: 'relatedArticles',
      title: '延伸閱讀（手動指定的相關文章）',
      type: 'array',
      group: 'content',
      description: '不填的話系統會自動推薦同分類的最新 3 篇',
      of: [{ type: 'reference', to: [{ type: 'article' }] }],
      validation: (Rule) => Rule.max(4),
    }),
    defineField({
      name: 'ctaOverride',
      title: '主推 CTA',
      type: 'string',
      group: 'content',
      description: '這篇文章底部要主推哪個轉換通道（不填 = 全站預設）',
      options: { list: CTA_OPTIONS },
      initialValue: 'default',
    }),

    // === FAQ（SEO Rich Snippet 加分） ===
    defineField({
      name: 'faq',
      title: 'FAQ 問答',
      type: 'array',
      group: 'faq',
      description: '常見問答。會自動生成 SEO Rich Snippet schema（Google 搜尋結果可能直接顯示）',
      of: [
        {
          type: 'object',
          name: 'faqItem',
          fields: [
            defineField({
              name: 'question',
              title: '問題',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'answer',
              title: '回答',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: 'question' },
            prepare: ({ title }) => ({ title: title || '(未填問題)' }),
          },
        },
      ],
    }),

    // === SEO 進階（可不填，自動帶入） ===
    defineField({
      name: 'seoTitle',
      title: 'SEO 標題（可不填）',
      type: 'string',
      group: 'seo',
      description: '若不填，自動使用上方「標題」',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO 描述（可不填）',
      type: 'text',
      group: 'seo',
      rows: 2,
      description: '若不填，自動使用上方「摘要」',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'ogImage',
      title: '社群分享圖（可不填）',
      type: 'image',
      group: 'seo',
      description: '若不填，自動使用上方「封面圖」',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category.name',
      media: 'coverImage',
      publishedAt: 'publishedAt',
    },
    prepare({ title, category, media, publishedAt }) {
      const date = publishedAt
        ? new Date(publishedAt).toLocaleDateString('zh-TW')
        : '未發布'
      return {
        title,
        subtitle: `${category || '未分類'} · ${date}`,
        media,
      }
    },
  },
})
