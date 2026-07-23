import { defineField, defineType } from 'sanity'

const PRODUCT_TYPES = [
  { title: '沉香', value: 'agarwood' },
  { title: '線香', value: 'incense-stick' },
  { title: '佛珠 / 手珠', value: 'beads' },
  { title: '雕件 / 擺件', value: 'carving' },
  { title: '原料 / 香材', value: 'raw-material' },
  { title: '其他', value: 'other' },
]

const USAGE_CONTEXT = [
  { title: '日常用香', value: 'daily' },
  { title: '靜心 / 冥想', value: 'meditation' },
  { title: '品香 / 鑑賞', value: 'appreciation' },
  { title: '空間淨化', value: 'space' },
  { title: '禮品 / 供香', value: 'gift' },
  { title: '收藏', value: 'collection' },
]

export const product = defineType({
  name: 'product',
  title: '商品',
  type: 'document',
  groups: [
    { name: 'main', title: '主要資訊', default: true },
    { name: 'knowledge', title: '知識型欄位（SEO 用）' },
  ],
  fields: [
    // === 主要資訊（10 秒填完） ===
    defineField({
      name: 'name',
      title: '商品名',
      type: 'string',
      group: 'main',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: '網址 slug',
      type: 'slug',
      group: 'main',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: '主圖',
      type: 'image',
      group: 'main',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
      fields: [defineField({ name: 'alt', title: '圖片描述 (alt)', type: 'string' })],
    }),
    defineField({
      name: 'shortDescription',
      title: '簡介',
      type: 'text',
      group: 'main',
      rows: 2,
      description: '1-2 句話描述這個商品',
    }),
    defineField({
      name: 'externalUrl',
      title: '香董商城商品連結',
      type: 'url',
      group: 'main',
      description: '貼上香董商城商品頁連結',
      validation: (Rule) =>
        Rule.required().uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'isCollectible',
      title: '藏品級',
      type: 'boolean',
      group: 'main',
      description: '勾選後商品卡會顯示金色「藏品級」標章、CTA 文字改為「洽詢」',
      initialValue: false,
    }),

    // === 知識型欄位（SEO 用、可選但建議填） ===
    defineField({
      name: 'productType',
      title: '商品類型',
      type: 'string',
      group: 'knowledge',
      description: '讓 Google 知道這是什麼類型的香品（影響 SEO）',
      options: { list: PRODUCT_TYPES },
    }),
    defineField({
      name: 'aromaProfile',
      title: '香氣特徵',
      type: 'string',
      group: 'knowledge',
      description: '例：「奶香、溫潤、日常靜心」、「惠安系甜涼感」、「藥香、回甘」',
    }),
    defineField({
      name: 'targetAudience',
      title: '適合誰',
      type: 'string',
      group: 'knowledge',
      description: '例：「適合剛接觸沉香的新手」、「資深收藏家」、「品香愛好者」',
    }),
    defineField({
      name: 'usageContext',
      title: '使用情境',
      type: 'array',
      group: 'knowledge',
      of: [{ type: 'string' }],
      options: { list: USAGE_CONTEXT },
    }),
    defineField({
      name: 'origin',
      title: '產地（如有）',
      type: 'string',
      group: 'knowledge',
      description: '例：「越南芽莊」、「印尼加里曼丹」、「印度老山」',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'mainImage',
      isCollectible: 'isCollectible',
      aromaProfile: 'aromaProfile',
    },
    prepare({ title, media, isCollectible, aromaProfile }) {
      return {
        title,
        subtitle: [
          isCollectible ? '◆ 藏品級' : null,
          aromaProfile,
        ].filter(Boolean).join(' · '),
        media,
      }
    },
  },
})
