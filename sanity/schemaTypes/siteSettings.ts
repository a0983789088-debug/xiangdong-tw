import { defineField, defineType } from 'sanity'

const CTA_TYPES = [
  { title: 'LINE 官方帳號', value: 'line' },
  { title: 'LINE 社群（香董香生活）', value: 'community' },
  { title: 'FB 競標社團', value: 'fbBidding' },
  { title: 'FB 知識社團（職人老實說）', value: 'fbKnowledge' },
  { title: '香董商城', value: 'shop' },
]

export const siteSettings = defineType({
  name: 'siteSettings',
  title: '網站設定',
  type: 'document',
  groups: [
    { name: 'site', title: '基本設定', default: true },
    { name: 'livestream', title: '直播花絮' },
    { name: 'faq', title: '首頁 FAQ' },
    { name: 'cta', title: 'CTA 模組' },
    { name: 'tracking', title: '追蹤碼' },
  ],
  fields: [
    defineField({
      name: 'siteTitle',
      title: '網站名稱',
      type: 'string',
      group: 'site',
      initialValue: '香董｜真正的天然好香',
    }),
    defineField({
      name: 'siteDescription',
      title: '網站描述',
      type: 'text',
      group: 'site',
      rows: 2,
      initialValue:
        '香董：推動沉香「標準化」與「價格透明化」。不只賣成品，連製香原材料都直接販售。真正能走得長久的品牌，建立在信任，不是神話。',
    }),
    defineField({
      name: 'defaultOgImage',
      title: '預設社群分享圖',
      type: 'image',
      group: 'site',
    }),
    defineField({
      name: 'founderPhoto',
      title: '香董本人照片',
      type: 'image',
      group: 'site',
      description: '會顯示在首頁「關於香董」段 + /about 頁',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: '圖片描述 (alt)', type: 'string' })],
    }),

    // === Livestream 本週直播 ===
    defineField({
      name: 'livestreamTitle',
      title: '直播主題',
      type: 'string',
      group: 'livestream',
      description: '最近一場直播的主題或亮點。例：「多產區沉香鑑賞局 + 印度老山 20mm 手珠開搶」',
    }),
    defineField({
      name: 'livestreamSchedule',
      title: '直播時間（固定時段）',
      type: 'string',
      group: 'livestream',
      description: '訪客需要知道何時來追直播。例：「每週二、四晚上 7:00」',
    }),
    defineField({
      name: 'livestreamContent',
      title: '直播精華內容',
      type: 'text',
      group: 'livestream',
      rows: 3,
      description: '介紹最近一場直播看到什麼。1-2 句就好',
    }),

    // === Homepage FAQ ===
    defineField({
      name: 'homepageFaq',
      title: '首頁底部 FAQ',
      type: 'array',
      group: 'faq',
      description:
        '沉香常見問題。會出現在首頁底部 + 產生 SEO Rich Snippet（Google 可能直接顯示）',
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
      initialValue: [
        {
          _type: 'faqItem',
          question: '沉香為什麼價格差很多？',
          answer:
            '沉香的價格由「產地、油脂含量、結香時間、稀有度、品相」共同決定。同樣是越南沉香，三十年陳化的老料跟近年的新料，價差可以到 10 倍以上。便宜得不合理的「沉香」99% 是泡油或合成品。',
        },
        {
          _type: 'faqItem',
          question: '新手適合哪種沉香？',
          answer:
            '新手建議從「印尼沉香」或「老山檀」開始：價格彈性大、香韻溫和、容易培養嗅覺記憶。等你聞過幾款、開始有偏好，再去體驗越南沉香的清雅、收藏級單一件。',
        },
        {
          _type: 'faqItem',
          question: '線香一定會有化學香精嗎？',
          answer:
            '不一定，但市面上大量便宜線香確實含有化學香精或合成黏粉。判斷方式：天然線香燃燒時有油花、香韻有層次、不刺鼻、不頭暈；化學線香往往氣味單一、燒久了不舒服。',
        },
        {
          _type: 'faqItem',
          question: '沉香是不是越貴越好？',
          answer:
            '不一定。價格反映稀有度與工藝，但不代表「適合你」。一支天價的香可能真的很好，但你只敢偶爾點一次；一支價格合理的香，你每天都願意點 ── 後者其實才真正進到你的生活。香董做的就是讓「真正好的香」回到合理。',
        },
        {
          _type: 'faqItem',
          question: '怎麼保存沉香才不會壞？',
          answer:
            '4 個重點：濕度 60-70%、避免陽光直射、密封但要透氣（用木盒、不要塑膠袋）、遠離香水樟腦等異味來源。如果發現香韻變淡，可以拿出來在陰涼處透氣幾天，部分香韻會回來。',
        },
      ],
    }),

    // === CTA Module ===
    defineField({
      name: 'ctas',
      title: 'CTA 通道設定',
      type: 'array',
      group: 'cta',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'type', title: '通道類型', type: 'string',
              options: { list: CTA_TYPES },
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: 'title', title: '按鈕主文', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'description', title: '按鈕副文', type: 'string' }),
            defineField({
              name: 'url', title: '連結網址', type: 'url',
              validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https'] }),
            }),
          ],
          preview: { select: { title: 'title', subtitle: 'type' } },
        },
      ],
    }),
    defineField({
      name: 'floatingButton',
      title: '右下角浮動按鈕',
      type: 'string',
      group: 'cta',
      options: { list: CTA_TYPES },
      initialValue: 'line',
    }),

    // === Tracking ===
    defineField({
      name: 'gaId',
      title: 'Google Analytics 4 ID',
      type: 'string',
      group: 'tracking',
      description: '格式：G-XXXXXXXXXX',
    }),
    defineField({
      name: 'metaPixelId',
      title: 'Meta Pixel ID',
      type: 'string',
      group: 'tracking',
    }),
    defineField({
      name: 'searchConsoleVerification',
      title: 'Google Search Console 驗證碼',
      type: 'string',
      group: 'tracking',
    }),
  ],
  preview: { prepare: () => ({ title: '網站設定' }) },
})
