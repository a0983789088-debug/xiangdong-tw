/**
 * 香董後台 Sanity Studio 嵌入點
 * 訪問網址：xiangdong.tw/studio
 * 注意：此 route 不會出現在前台導覽列（GPT 規則 1）
 */
'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config'

export const dynamic = 'force-static'
export { metadata, viewport } from 'next-sanity/studio'

export default function StudioPage() {
  return <NextStudio config={config} />
}
