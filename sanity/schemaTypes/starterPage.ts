import { defineField, defineType } from 'sanity'

const FORBIDDEN_AD_TERM = '沉香'

const adSafeText = (Rule: any) =>
  Rule.required().custom((value: string | undefined) =>
    value?.includes(FORBIDDEN_AD_TERM)
      ? '廣告政策：此欄位不得出現「' + FORBIDDEN_AD_TERM + '」'
      : true
  )

export const starterPage = defineType({
  name: 'starterPage',
  title: '入門組合落地頁',
  type: 'document',
  groups: [
    { name: 'hero', title: '首屏', default: true },
    { name: 'bundle', title: '組合內容' },
    { name: 'trust', title: '信任內容' },
    { name: 'faq', title: 'FAQ' },
  ],
  fields: [
    defineField({
      name: 'headline',
      title: '主標',
      type: 'string',
      group: 'hero',
      description: '同時用於 H1、網頁 title 與 OG title，不可出現廣告政策禁字。',
      validation: adSafeText,
      initialValue: '第一次點香，從這組開始',
    }),
    defineField({
      name: 'subheadline',
      title: '副標',
      type: 'text',
      rows: 2,
      group: 'hero',
      description: '同時用於 OG description，不可出現廣告政策禁字。',
      validation: adSafeText,
      initialValue: '四種經典木質香韻，一次找到你喜歡的日常氣味。',
    }),
    defineField({
      name: 'heroImage',
      title: '主視覺圖',
      type: 'image',
      group: 'hero',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: '圖片替代文字', type: 'string' }),
      ],
    }),
    defineField({
      name: 'items',
      title: '組合內容物',
      type: 'array',
      group: 'bundle',
      validation: (Rule) => Rule.required().min(1),
      of: [
        {
          type: 'object',
          name: 'starterBundleItem',
          title: '內容物',
          fields: [
            defineField({
              name: 'name',
              title: '品名',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'sellingPoint',
              title: '一句賣點',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'originalPrice',
              title: '單品原價（TWD）',
              type: 'number',
              validation: (Rule) => Rule.required().integer().positive(),
            }),
          ],
          preview: {
            select: { title: 'name', subtitle: 'sellingPoint' },
          },
        },
      ],
      initialValue: [
        { _type: 'starterBundleItem', name: '老山檀香線香', sellingPoint: '溫潤甜木調，日常最好入門。', originalPrice: 420 },
        { _type: 'starterBundleItem', name: '降真香線香', sellingPoint: '清爽帶甜，空間氣味俐落。', originalPrice: 380 },
        { _type: 'starterBundleItem', name: '肖楠線香', sellingPoint: '森林木質感，氣味穩定耐聞。', originalPrice: 320 },
        { _type: 'starterBundleItem', name: '台灣黃檜線香', sellingPoint: '清新樹脂香，鮮明卻不刺鼻。', originalPrice: 360 },
      ],
    }),
    defineField({
      name: 'bundlePrice',
      title: '組合價（TWD）',
      type: 'number',
      group: 'bundle',
      validation: (Rule) => Rule.required().integer().positive(),
      initialValue: 999,
    }),
    defineField({
      name: 'originalTotal',
      title: '原價合計（劃線價，TWD）',
      type: 'number',
      group: 'bundle',
      validation: (Rule) => Rule.required().integer().positive(),
      initialValue: 1480,
    }),
    defineField({
      name: 'checkoutUrl',
      title: '1shop 結帳連結',
      type: 'url',
      group: 'bundle',
      validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https'] }),
      initialValue: 'https://baujie-agarwood.my1shop.com/',
    }),
    defineField({
      name: 'trustStory',
      title: '職人故事（三行）',
      type: 'array',
      group: 'trust',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.required().length(3),
      initialValue: [
        '做這行十幾年，從擺攤、賣佛珠，一路到線香與原料。',
        '我不是大師，只堅持賣的東西要對得起客人。',
        '用了什麼料、比例怎麼配、價格怎麼來，都應該說得清楚。',
      ],
    }),
    defineField({
      name: 'communityMemberCount',
      title: '社團人數',
      type: 'number',
      group: 'trust',
      validation: (Rule) => Rule.required().integer().positive(),
      initialValue: 4886,
    }),
    defineField({
      name: 'faq',
      title: 'FAQ',
      type: 'array',
      group: 'faq',
      validation: (Rule) => Rule.required().min(1),
      of: [
        {
          type: 'object',
          name: 'starterFaqItem',
          fields: [
            defineField({ name: 'question', title: '問題', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'answer', title: '回答', type: 'text', rows: 3, validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: 'question' } },
        },
      ],
      initialValue: [
        { _type: 'starterFaqItem', question: '運費怎麼算？', answer: '運費會依你在結帳頁選擇的配送方式顯示，下單前即可確認。' },
        { _type: 'starterFaqItem', question: '收到後可以退貨嗎？', answer: '收到商品後享 7 天鑑賞期。商品需保持全新未使用並附發票，即可申請退貨；鑑賞期非試用期。' },
        { _type: 'starterFaqItem', question: '多久會出貨？', answer: '現貨商品預計下單後 1–3 個工作天出貨；例假日或訂單量較大時會順延。' },
      ],
    }),
  ],
  preview: {
    select: { title: 'headline' },
    prepare: ({ title }) => ({ title: title || '入門組合落地頁' }),
  },
})
