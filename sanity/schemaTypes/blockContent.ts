import { defineType, defineArrayMember } from 'sanity'

/**
 * 文章內文用的「區塊內容」schema。
 * 支援標題、段落、引言、圖片、清單、連結等元素。
 */
export const blockContent = defineType({
  name: 'blockContent',
  title: 'Block Content',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: '段落', value: 'normal' },
        { title: 'H2 大標題', value: 'h2' },
        { title: 'H3 小標題', value: 'h3' },
        { title: '引言 (重點句)', value: 'blockquote' },
      ],
      lists: [
        { title: '無序清單', value: 'bullet' },
        { title: '編號清單', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: '粗體', value: 'strong' },
          { title: '斜體', value: 'em' },
          { title: '底線', value: 'underline' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: '超連結',
            fields: [
              {
                name: 'href',
                type: 'url',
                title: '網址',
                validation: (Rule) =>
                  Rule.uri({
                    allowRelative: true,
                    scheme: ['http', 'https', 'mailto', 'tel'],
                  }),
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: '圖片描述 (alt)',
          description: 'SEO 必填',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'caption',
          type: 'string',
          title: '圖片說明 (caption)',
          description: '顯示在圖片下方（可不填）',
        },
      ],
    }),
  ],
})
