import { defineField, defineType } from 'sanity'

export const category = defineType({
  name: 'category',
  title: '分類',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: '分類名稱',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: '網址 slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: '分類說明',
      type: 'text',
      rows: 2,
      description: '顯示在分類頁頂部、用於 SEO',
    }),
    defineField({
      name: 'order',
      title: '排序',
      type: 'number',
      description: '數字越小越前面',
      initialValue: 100,
    }),
  ],
  orderings: [
    {
      title: '依排序',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
})
