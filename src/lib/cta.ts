/**
 * CTA 模組工具：把 ctaOverride 對應到 siteSettings.ctas 裡的具體一筆。
 * 文章 ctaOverride = 'default' 時，全套 CTA 都顯示；其他值時主推那一筆。
 */

export type CtaType =
  | 'line'
  | 'community'
  | 'fbBidding'
  | 'fbKnowledge'
  | 'shop'

export type CtaItem = {
  type: CtaType | string
  title: string
  description?: string
  url: string
}

export const CTA_PRESETS: Record<CtaType, CtaItem> = {
  line: {
    type: 'line',
    title: '加 LINE 領沉香新手手冊',
    description: '下載《沉香新手避雷指南》PDF + 每週直播提醒',
    url: 'https://lin.ee/89W39yX',
  },
  community: {
    type: 'community',
    title: '加入「香董香生活」LINE 社群',
    description: '每天分享香董手邊好香、即時答疑',
    url: 'https://line.me/ti/g2/uuQhXp6AQHZxdg_uwDQqcUrCIP5c-i3fBzfh1A',
  },
  fbBidding: {
    type: 'fbBidding',
    title: '加入 FB 競標社團',
    description: '每週直播競標好貨，獨家收藏品先看',
    url: 'https://www.facebook.com/groups/1789214647984397',
  },
  fbKnowledge: {
    type: 'fbKnowledge',
    title: '加入「香董職人老實說」社團',
    description: '4,488 位香友交流沉香專業知識',
    url: 'https://www.facebook.com/groups/260642251054970',
  },
  shop: {
    type: 'shop',
    title: '逛香董香舖（就醬播）',
    description: '直播即時上新、藏品級單一件',
    url: 'https://jambolive.tv/shop/62349/product/fb/',
  },
}

/**
 * 文章 ctaOverride → 主推哪幾張卡
 * 'default' = 全部 4 張（line / community / fbBidding / shop）
 * 其他      = 主推一張 + 副推 line（永遠保留 LINE 作為次選）
 */
export function resolveCtasForArticle(
  ctaOverride: string | null | undefined,
  siteCtas?: CtaItem[]
): { primary: CtaItem; secondary: CtaItem[] } {
  // 後台 siteSettings 有設就用後台、沒有就用 PRESET
  const ctasByType: Record<string, CtaItem> = { ...CTA_PRESETS }
  if (siteCtas) {
    for (const c of siteCtas) {
      if (c?.type) ctasByType[c.type] = c
    }
  }

  if (!ctaOverride || ctaOverride === 'default') {
    return {
      primary: ctasByType.line,
      secondary: [
        ctasByType.community,
        ctasByType.fbBidding,
        ctasByType.shop,
      ],
    }
  }

  // 對應到指定的 CTA
  const map: Record<string, CtaType> = {
    line: 'line',
    community: 'fbBidding',   // 「主推競標社團」對應 fbBidding
    knowledge: 'fbKnowledge', // 「主推知識社團」對應 fbKnowledge
    shop: 'shop',
  }
  const targetKey = map[ctaOverride] || 'line'
  const primary = ctasByType[targetKey]
  const secondary = [ctasByType.line].filter((c) => c.type !== primary.type)

  return { primary, secondary }
}

/** 由 type 取得通道色（用於樣式） */
export function getCtaColor(type: string): { bg: string; fg: string } {
  switch (type) {
    case 'line':
      return { bg: '#06C755', fg: '#FFFFFF' }
    case 'community':
      return { bg: '#0B2545', fg: '#FFFFFF' }
    case 'fbBidding':
    case 'fbKnowledge':
      return { bg: '#1877F2', fg: '#FFFFFF' }
    case 'shop':
      return { bg: '#C9A961', fg: '#0B2545' }
    default:
      return { bg: '#0B2545', fg: '#FFFFFF' }
  }
}
